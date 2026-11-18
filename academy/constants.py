import re

CATEGORY_FIELDS = {
    "completedLessons": "completed_lessons",
    "solvedExercises": "solved_exercises",
    "completedProjectTasks": "completed_project_tasks",
    "solvedBugs": "solved_bugs",
    "completedReviews": "completed_reviews",
    "solvedIncidents": "solved_incidents",
    "completedModules": "completed_modules",
}

XP_BY_CATEGORY = {
    "completedLessons": 30,
    "solvedExercises": 45,
    "completedProjectTasks": 50,
    "solvedBugs": 40,
    "completedReviews": 40,
    "solvedIncidents": 55,
    "completedModules": 20,
}

ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$")
MAX_ITEMS_PER_CATEGORY = 500

SANDBOX_MAX_CODE = 20_000
SANDBOX_MAX_TEST = 20_000
SANDBOX_TIMEOUT_SECONDS = 3.0
SANDBOX_MAX_OUTPUT_BYTES = 64 * 1024
SQL_N1_MAX_ROWS = 50

RATE_LIMITS = {
    "sandbox": (30, 60),
    "progress": (120, 60),
}
