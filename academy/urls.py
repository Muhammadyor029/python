from django.urls import path

from . import views

urlpatterns = [
    path("api/health/", views.health, name="health"),
    path("api/csrf/", views.csrf, name="csrf"),
    path("api/academy/state/", views.academy_state, name="academy-state"),
    path("api/academy/progress/", views.academy_progress, name="academy-progress"),
    path("api/sandbox/python/", views.sandbox_python, name="sandbox-python"),
    path("api/sandbox/sql-n1/", views.sandbox_sql_n1, name="sandbox-sql-n1"),
]
