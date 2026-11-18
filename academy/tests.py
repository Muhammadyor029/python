import json

from django.test import Client, TestCase


class AcademyApiTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)

    def csrf_token(self):
        response = self.client.get("/api/csrf/")
        self.assertEqual(response.status_code, 200)
        return response.json()["csrfToken"]

    def post_json(self, path, payload, token=None):
        headers = {}
        if token:
            headers["HTTP_X_CSRFTOKEN"] = token
        return self.client.post(
            path,
            data=json.dumps(payload),
            content_type="application/json",
            **headers,
        )

    def test_health(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_progress_requires_csrf(self):
        response = self.post_json(
            "/api/academy/progress/",
            {"category": "completedLessons", "id": "lesson-01"},
        )
        self.assertEqual(response.status_code, 403)

    def test_progress_uses_server_side_xp(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/academy/progress/",
            {
                "category": "completedLessons",
                "id": "lesson-01",
                "xpDelta": 9999,
            },
            token,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["xp"], 30)
        self.assertEqual(response.json()["completedLessons"], ["lesson-01"])

    def test_progress_is_isolated_per_session(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/academy/progress/",
            {"category": "completedLessons", "id": "lesson-01"},
            token,
        )
        self.assertEqual(response.status_code, 200)

        other = Client()
        other_state = other.get("/api/academy/state/").json()
        self.assertEqual(other_state["completedLessons"], [])
        self.assertEqual(other_state["xp"], 0)

    def test_progress_rejects_unknown_category(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/academy/progress/",
            {"category": "unknown", "id": "lesson-01"},
            token,
        )
        self.assertEqual(response.status_code, 400)

    def test_python_sandbox_runs_real_code(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/sandbox/python/",
            {"code": "print(2 + 2)", "testCode": "assert 2 + 2 == 4"},
            token,
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertTrue(payload["testPassed"])
        self.assertEqual(payload["stdout"], "4\n")
        self.assertEqual(payload["executionMode"], "real-python")

    def test_python_sandbox_blocks_unsafe_import(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/sandbox/python/", {"code": "import os"}, token
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertFalse(payload["ok"])
        self.assertIn("Import", payload["stderr"])

    def test_python_sandbox_blocks_dunder_escape(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/sandbox/python/",
            {"code": "print((1).__class__.__subclasses__())"},
            token,
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertFalse(payload["ok"])
        self.assertIn("atribut", payload["stderr"])

    def test_python_sandbox_allows_safe_dunder_name(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/sandbox/python/",
            {"code": "def f():\n    pass\nprint(f.__name__)"},
            token,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["stdout"], "f\n")

    def test_sql_n_plus_one_counts_queries(self):
        token = self.csrf_token()
        response = self.post_json(
            "/api/sandbox/sql-n1/", {"mode": "n_plus_1", "rows": 3}, token
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["queryCount"], 4)

        response = self.post_json(
            "/api/sandbox/sql-n1/", {"mode": "select_related", "rows": 3}, token
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["queryCount"], 1)
