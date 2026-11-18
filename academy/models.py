from datetime import date

from django.db import models


class LearnerState(models.Model):
    session_key = models.CharField(max_length=64, unique=True)
    completed_lessons = models.JSONField(default=list, blank=True)
    solved_exercises = models.JSONField(default=list, blank=True)
    completed_project_tasks = models.JSONField(default=list, blank=True)
    solved_bugs = models.JSONField(default=list, blank=True)
    completed_reviews = models.JSONField(default=list, blank=True)
    solved_incidents = models.JSONField(default=list, blank=True)
    completed_modules = models.JSONField(default=list, blank=True)
    xp = models.PositiveIntegerField(default=0)
    streak_days = models.PositiveIntegerField(default=1)
    last_active_date = models.DateField(default=date.today)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.session_key[:10]}… ({self.xp} XP)"
