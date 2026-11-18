import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path

from .constants import (
    SANDBOX_MAX_CODE,
    SANDBOX_MAX_OUTPUT_BYTES,
    SANDBOX_MAX_TEST,
    SANDBOX_TIMEOUT_SECONDS,
    SQL_N1_MAX_ROWS,
)


class SandboxError(ValueError):
    pass


HARNESS = r'''
import ast
import builtins
import contextlib
import io
import json
import sys
import traceback

ALLOWED_IMPORTS = {
    "collections", "copy", "dataclasses", "datetime", "decimal", "enum",
    "fractions", "functools", "itertools", "json", "math", "operator",
    "random", "re", "sqlite3", "statistics", "string", "textwrap", "time",
    "typing",
}
BLOCKED_NAMES = {
    "__builtins__", "__loader__", "__spec__", "__package__", "__file__",
    "open", "eval", "exec", "compile", "input", "breakpoint", "exit", "quit",
    "help", "globals", "locals", "vars", "dir", "getattr", "setattr",
    "delattr", "hasattr", "memoryview", "__import__",
}
BLOCKED_CALLS = {
    "open", "eval", "exec", "compile", "input", "breakpoint", "exit", "quit",
    "help", "globals", "locals", "vars", "dir", "getattr", "setattr",
    "delattr", "hasattr", "__import__",
}
SAFE_DUNDER_ATTRS = {
    "__annotations__", "__bool__", "__call__", "__contains__", "__doc__",
    "__enter__", "__eq__", "__exit__", "__format__", "__ge__", "__getitem__",
    "__gt__", "__hash__", "__init__", "__iter__", "__le__", "__len__",
    "__lt__", "__module__", "__name__", "__ne__", "__next__", "__qualname__",
    "__repr__", "__setitem__", "__slots__", "__str__",
}
EXCLUDED_BUILTINS = {
    "open", "eval", "exec", "compile", "input", "breakpoint", "exit", "quit",
    "help", "globals", "locals", "vars", "dir", "getattr", "setattr",
    "delattr", "hasattr", "memoryview", "__import__", "__loader__",
    "__spec__", "__package__", "__file__",
}

def validate(tree):
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split(".")[0] not in ALLOWED_IMPORTS:
                    raise ValueError("Import ruxsat etilmagan: " + alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.level:
                raise ValueError("Nisbiy import ruxsat etilmagan.")
            root = (node.module or "").split(".")[0]
            if root not in ALLOWED_IMPORTS:
                raise ValueError("Import ruxsat etilmagan: " + (node.module or ""))
        elif isinstance(node, ast.Name):
            if node.id in BLOCKED_NAMES:
                raise ValueError("Ruxsat etilmagan nom: " + node.id)
        elif isinstance(node, ast.Attribute):
            if node.attr.startswith("__") and node.attr not in SAFE_DUNDER_ATTRS:
                raise ValueError("Ruxsat etilmagan atribut: " + node.attr)
        elif isinstance(node, ast.Call):
            func = node.func
            if isinstance(func, ast.Name) and func.id in BLOCKED_CALLS:
                raise ValueError("Ruxsat etilmagan chaqiruv: " + func.id)
            if isinstance(func, ast.Attribute) and func.attr in BLOCKED_CALLS:
                raise ValueError("Ruxsat etilmagan chaqiruv: " + func.attr)

REAL_IMPORT = builtins.__import__

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    if level:
        raise ImportError("Nisbiy import ruxsat etilmagan.")
    if name.split(".")[0] not in ALLOWED_IMPORTS:
        raise ImportError("Import ruxsat etilmagan: " + name)
    return REAL_IMPORT(name, globals, locals, fromlist, level)

SAFE_BUILTINS = {
    name: value
    for name, value in vars(builtins).items()
    if name not in EXCLUDED_BUILTINS and (not name.startswith("__") or name == "__build_class__")
}
SAFE_BUILTINS["__import__"] = safe_import

def main():
    code_path, test_path, result_path = sys.argv[1:4]
    with open(code_path, "r", encoding="utf-8") as handle:
        code = handle.read()
    test_code = ""
    if test_path != "-":
        with open(test_path, "r", encoding="utf-8") as handle:
            test_code = handle.read()

    result = {
        "ok": False,
        "stdout": "",
        "stderr": "",
        "testPassed": None,
        "testMessage": None,
    }
    out = io.StringIO()
    err = io.StringIO()
    try:
        user_tree = ast.parse(code, filename="student.py")
        validate(user_tree)
        test_tree = None
        if test_code:
            test_tree = ast.parse(test_code, filename="test.py")
            validate(test_tree)
    except BaseException:
        result["stderr"] = "Xavfsizlik tekshiruvi: " + traceback.format_exc(limit=3)
        with open(result_path, "w", encoding="utf-8") as handle:
            json.dump(result, handle, ensure_ascii=False)
        return

    env = {"__name__": "__main__", "__builtins__": SAFE_BUILTINS}
    try:
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            exec(compile(user_tree, "student.py", "exec"), env, env)
            if test_tree is not None:
                try:
                    exec(compile(test_tree, "test.py", "exec"), env, env)
                    result["testPassed"] = True
                except BaseException:
                    result["testPassed"] = False
                    result["testMessage"] = traceback.format_exc(limit=4)
        result["ok"] = True
    except BaseException:
        err.write(traceback.format_exc(limit=4))

    result["stdout"] = out.getvalue()
    result["stderr"] = err.getvalue()
    with open(result_path, "w", encoding="utf-8") as handle:
        json.dump(result, handle, ensure_ascii=False)

if __name__ == "__main__":
    main()
'''


def _preexec_limits():
    os.setsid()
    import resource

    resource.setrlimit(resource.RLIMIT_CPU, (2, 2))
    resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_CORE, (0, 0))
    resource.setrlimit(resource.RLIMIT_NPROC, (1, 1))


def _read_limited(stream, target: bytearray, state: dict, lock: threading.Lock, process):
    while True:
        chunk = stream.read(4096)
        if not chunk:
            break
        with lock:
            remaining = SANDBOX_MAX_OUTPUT_BYTES - state["bytes"]
            if remaining > 0:
                target.extend(chunk[:remaining])
                state["bytes"] += min(len(chunk), remaining)
            if len(chunk) > remaining:
                state["truncated"] = True
        if state["truncated"]:
            try:
                process.kill()
            except OSError:
                pass
            break


def run_python(code: str, test_code: str = "") -> dict:
    if not isinstance(code, str) or not code.strip():
        raise SandboxError("Kod bo‘sh.")
    if len(code) > SANDBOX_MAX_CODE:
        raise SandboxError("Kod hajmi juda katta.")
    if test_code and len(test_code) > SANDBOX_MAX_TEST:
        raise SandboxError("Test kodi hajmi juda katta.")

    started = time.perf_counter()
    tempdir = Path(tempfile.mkdtemp(prefix="paimon-sandbox-"))
    code_path = tempdir / "student.py"
    test_path = tempdir / "test.py"
    runner_path = tempdir / "runner.py"
    result_path = tempdir / "result.json"
    code_path.write_text(code, encoding="utf-8")
    test_path.write_text(test_code, encoding="utf-8")
    runner_path.write_text(HARNESS, encoding="utf-8")

    env = {
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUNBUFFERED": "1",
        "HOME": str(tempdir),
        "TEMP": str(tempdir),
        "TMP": str(tempdir),
        "TMPDIR": str(tempdir),
    }
    for key in ("SYSTEMROOT", "WINDIR", "COMSPEC", "PATH"):
        if key in os.environ:
            env[key] = os.environ[key]

    command = [
        sys.executable,
        "-I",
        "-B",
        "-X",
        "utf8",
        str(runner_path),
        str(code_path),
        str(test_path) if test_code else "-",
        str(result_path),
    ]

    kwargs = {
        "cwd": str(tempdir),
        "env": env,
        "stdin": subprocess.DEVNULL,
        "stdout": subprocess.PIPE,
        "stderr": subprocess.PIPE,
        "bufsize": 0,
    }
    if os.name == "posix":
        kwargs["preexec_fn"] = _preexec_limits
    else:
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)

    process = subprocess.Popen(command, **kwargs)
    out_buffer = bytearray()
    err_buffer = bytearray()
    state = {"bytes": 0, "truncated": False}
    lock = threading.Lock()
    threads = [
        threading.Thread(
            target=_read_limited,
            args=(process.stdout, out_buffer, state, lock, process),
            daemon=True,
        ),
        threading.Thread(
            target=_read_limited,
            args=(process.stderr, err_buffer, state, lock, process),
            daemon=True,
        ),
    ]
    for thread in threads:
        thread.start()

    timed_out = False
    try:
        process.wait(timeout=SANDBOX_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        timed_out = True
        process.kill()
        process.wait(timeout=2)
    for thread in threads:
        thread.join(timeout=2)

    elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
    process_stdout = out_buffer.decode("utf-8", errors="replace")
    process_stderr = err_buffer.decode("utf-8", errors="replace")
    result = {}
    try:
        result = json.loads(result_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        result = {}

    stdout = result.get("stdout") if result.get("stdout") is not None else process_stdout
    stderr = result.get("stderr") if result.get("stderr") is not None else process_stderr
    if process_stderr and process_stderr not in stderr:
        stderr = (stderr + "\n" + process_stderr).strip()

    if timed_out:
        stderr = (stderr + "\nVaqt chegarasidan oshdi (3s).").strip()
    if state["truncated"]:
        stderr = (stderr + "\nChiqish hajmi chegaralandi.").strip()
    if not result and process.returncode not in (0, None):
        stderr = (stderr + f"\nPython jarayoni {process.returncode} kodi bilan tugadi.").strip()

    shutil.rmtree(tempdir, ignore_errors=True)
    return {
        "ok": bool(result.get("ok", False)) and not timed_out,
        "stdout": stdout[-SANDBOX_MAX_OUTPUT_BYTES:],
        "stderr": stderr[-SANDBOX_MAX_OUTPUT_BYTES:],
        "elapsedMs": elapsed_ms,
        "testPassed": result.get("testPassed"),
        "testMessage": (result.get("testMessage") or "")[:4000] or None,
        "executionMode": "real-python",
    }


def run_sql_n1(mode: str, rows: int = 12) -> dict:
    if mode not in {"n_plus_1", "select_related"}:
        raise SandboxError("Noto‘g‘ri SQL rejimi.")
    try:
        rows = int(rows)
    except (TypeError, ValueError):
        rows = 12
    rows = max(1, min(rows, SQL_N1_MAX_ROWS))

    connection = sqlite3.connect(":memory:")
    queries = []
    connection.set_trace_callback(queries.append)
    started = time.perf_counter()
    try:
        connection.executescript(
            """
            CREATE TABLE authors (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );
            CREATE TABLE books (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                author_id INTEGER NOT NULL REFERENCES authors(id)
            );
            """
        )
        authors = [(index, f"Muallif #{index}") for index in range(1, rows + 1)]
        books = [
            (index, f"Backend Kitob #{index}", index)
            for index in range(1, rows + 1)
        ]
        connection.executemany("INSERT INTO authors VALUES (?, ?)", authors)
        connection.executemany("INSERT INTO books VALUES (?, ?, ?)", books)
        queries.clear()

        sample_rows = []
        if mode == "n_plus_1":
            book_rows = connection.execute(
                "SELECT id, title, author_id FROM books LIMIT ?", (rows,)
            ).fetchall()
            for book_id, title, author_id in book_rows:
                author = connection.execute(
                    "SELECT name FROM authors WHERE id = ?", (author_id,)
                ).fetchone()
                sample_rows.append({"book": title, "author": author[0] if author else ""})
        else:
            joined = connection.execute(
                """
                SELECT b.title, a.name
                FROM books b
                INNER JOIN authors a ON b.author_id = a.id
                LIMIT ?
                """,
                (rows,),
            ).fetchall()
            sample_rows = [{"book": title, "author": author} for title, author in joined]

        query_count = len(queries)
        plan_mode = "n_plus_1" if mode == "n_plus_1" else "select_related"
        explain_sql = (
            "SELECT id, title, author_id FROM books LIMIT ?"
            if plan_mode == "n_plus_1"
            else """
                SELECT b.title, a.name
                FROM books b
                INNER JOIN authors a ON b.author_id = a.id
                LIMIT ?
            """
        )
        explain_plan = [
            " | ".join(str(part) for part in row)
            for row in connection.execute(
                "EXPLAIN QUERY PLAN " + explain_sql, (rows,)
            ).fetchall()
        ]
        elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
        return {
            "ok": True,
            "mode": mode,
            "queryCount": query_count,
            "elapsedMs": elapsed_ms,
            "queries": queries[:50],
            "explainPlan": explain_plan,
            "sampleRows": sample_rows,
            "executionMode": "real-sqlite-engine",
        }
    finally:
        connection.close()
