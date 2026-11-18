import json
import logging
import sys
from datetime import datetime, timezone as dt_timezone

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .sandbox import SandboxError, run_python, run_sql_n1
from .services import (
    apply_progress,
    get_learner_state,
    rate_limit_exceeded,
    state_to_payload,
    validate_progress,
)

logger = logging.getLogger(__name__)


def _json_body(request) -> dict:
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("JSON noto‘g‘ri.") from exc
    if not isinstance(payload, dict):
        raise ValueError("JSON obyekt bo‘lishi kerak.")
    return payload


@require_GET
def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "paimon-academy",
            "python": sys.version.split()[0],
            "sandbox": "real-python",
            "time": datetime.now(dt_timezone.utc).isoformat(),
        }
    )


@ensure_csrf_cookie
@require_GET
def csrf(request):
    return JsonResponse({"csrfToken": get_token(request)})


@ensure_csrf_cookie
@require_GET
def academy_state(request):
    state = get_learner_state(request)
    return JsonResponse(state_to_payload(state))


@csrf_protect
@require_POST
def academy_progress(request):
    if rate_limit_exceeded(request, "progress"):
        return JsonResponse({"error": "Juda ko‘p so‘rov. Biroz kuting."}, status=429)
    try:
        payload = _json_body(request)
        category, item_id, remove = validate_progress(
            payload.get("category"),
            payload.get("id"),
            payload.get("remove", False),
        )
        state = apply_progress(request, category, item_id, remove)
        return JsonResponse(state_to_payload(state))
    except ValueError as exc:
        return JsonResponse({"error": str(exc)}, status=400)


@csrf_protect
@require_POST
def sandbox_python(request):
    if rate_limit_exceeded(request, "sandbox"):
        return JsonResponse({"error": "Juda ko‘p so‘rov. Biroz kuting."}, status=429)
    try:
        payload = _json_body(request)
        code = payload.get("code", "")
        test_code = payload.get("testCode") or ""
        if not isinstance(code, str) or not isinstance(test_code, str):
            raise ValueError("Kod matn bo‘lishi kerak.")
        return JsonResponse(run_python(code, test_code))
    except (ValueError, SandboxError) as exc:
        return JsonResponse({"error": str(exc)}, status=400)
    except Exception:
        logger.exception("Python sandbox failed")
        return JsonResponse(
            {"error": "Sandbox ichki xatosi. Keyinroq urinib ko‘ring."},
            status=500,
        )


@csrf_protect
@require_POST
def sandbox_sql_n1(request):
    if rate_limit_exceeded(request, "sandbox"):
        return JsonResponse({"error": "Juda ko‘p so‘rov. Biroz kuting."}, status=429)
    try:
        payload = _json_body(request)
        mode = payload.get("mode", "n_plus_1")
        rows = payload.get("rows", 12)
        return JsonResponse(run_sql_n1(mode, rows))
    except (ValueError, SandboxError) as exc:
        return JsonResponse({"error": str(exc)}, status=400)
    except Exception:
        logger.exception("SQL sandbox failed")
        return JsonResponse(
            {"error": "SQL sandbox ichki xatosi. Keyinroq urinib ko‘ring."},
            status=500,
        )


@require_GET
def spa_index(request):
    index_path = settings.BASE_DIR / "dist" / "index.html"
    if not index_path.exists():
        return HttpResponse(
            "Frontend build topilmadi. `npm run build` ni ishga tushiring.",
            status=503,
            content_type="text/plain; charset=utf-8",
        )
    return render(request, "index.html")
