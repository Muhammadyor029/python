from datetime import timedelta

from django.core.cache import cache
from django.db import transaction
from django.utils import timezone

from .constants import (
    CATEGORY_FIELDS,
    ID_PATTERN,
    MAX_ITEMS_PER_CATEGORY,
    RATE_LIMITS,
    XP_BY_CATEGORY,
)
from .models import LearnerState


def ensure_session(request) -> str:
    if not request.session.session_key:
        request.session.create()
        request.session.save()
    return request.session.session_key


def get_learner_state(request) -> LearnerState:
    session_key = ensure_session(request)
    state, _ = LearnerState.objects.get_or_create(session_key=session_key)
    return state


def state_to_payload(state: LearnerState) -> dict:
    return {
        "completedLessons": list(state.completed_lessons or []),
        "solvedExercises": list(state.solved_exercises or []),
        "completedProjectTasks": list(state.completed_project_tasks or []),
        "solvedBugs": list(state.solved_bugs or []),
        "completedReviews": list(state.completed_reviews or []),
        "solvedIncidents": list(state.solved_incidents or []),
        "completedModules": list(state.completed_modules or []),
        "xp": state.xp,
        "streakDays": state.streak_days,
        "lastActiveDate": state.last_active_date.isoformat(),
    }


def validate_progress(category: str, item_id: str, remove: bool) -> tuple[str, str, bool]:
    if category not in CATEGORY_FIELDS:
        raise ValueError("Noto‘g‘ri progress kategoriyasi.")
    if not isinstance(item_id, str) or not ID_PATTERN.fullmatch(item_id):
        raise ValueError("Noto‘g‘ri progress identifikatori.")
    if not isinstance(remove, bool):
        raise ValueError("`remove` boolean bo‘lishi kerak.")
    return category, item_id, remove


@transaction.atomic
def apply_progress(request, category: str, item_id: str, remove: bool) -> LearnerState:
    session_key = ensure_session(request)
    state, _ = LearnerState.objects.select_for_update().get_or_create(
        session_key=session_key
    )
    field_name = CATEGORY_FIELDS[category]
    items = list(getattr(state, field_name) or [])
    already_present = item_id in items
    xp_delta = XP_BY_CATEGORY[category]

    if remove:
        if already_present:
            items = [item for item in items if item != item_id]
            state.xp = max(0, state.xp - xp_delta)
    elif not already_present:
        if len(items) >= MAX_ITEMS_PER_CATEGORY:
            raise ValueError("Progress limiti tugagan.")
        items.append(item_id)
        state.xp = state.xp + xp_delta

    setattr(state, field_name, items)
    today = timezone.localdate()
    if state.last_active_date == today:
        pass
    elif state.last_active_date == today - timedelta(days=1):
        state.streak_days += 1
    else:
        state.streak_days = 1
    state.last_active_date = today
    state.save()
    return state


def rate_limit_exceeded(request, bucket: str) -> bool:
    limit, window = RATE_LIMITS[bucket]
    identifier = request.session.session_key or request.META.get("REMOTE_ADDR", "unknown")
    key = f"rate:{bucket}:{identifier}"
    if cache.add(key, 0, timeout=window):
        cache.incr(key)
        return False
    try:
        count = cache.incr(key)
    except ValueError:
        cache.set(key, 1, timeout=window)
        return False
    return count > limit
