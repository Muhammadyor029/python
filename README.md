# Paimon Academy

Paimon 2.0 backend engineering academy. The visual design is preserved; the backend is Django and the React/Vite frontend is served by Django in production.

## Live deployment

- App: https://paimon-academy.onrender.com
- Health: https://paimon-academy.onrender.com/api/health/
- Render region: Frankfurt
- Database: Render Postgres (free, PostgreSQL 16)

## Stack

- Frontend: React 19, Vite 8, TypeScript, Tailwind CSS 4
- Node.js: 22.12+ (local and Render build)
- Backend: Django 6, SQLite locally, PostgreSQL on Render
- Static files: WhiteNoise
- Production server: Gunicorn

## Local setup

```powershell
npm install
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
npm run build
python manage.py runserver 127.0.0.1:8000
```

Open `http://127.0.0.1:8000`.

For frontend hot reload, run Django in one terminal and Vite in another:

```powershell
python manage.py runserver 127.0.0.1:8000
npm run dev
```

Open `http://127.0.0.1:5173`. Vite proxies `/api` requests to Django.

## Checks

```powershell
npm run lint
npm run build
python manage.py check
python manage.py test academy
```

`npm audit` currently reports high-severity advisories in Vite's build-only `picomatch` dependency. They affect local/build tooling, not the production JavaScript bundle; update when Vite ships a patched release.

## API

- `GET /api/health/` - service and Python version
- `GET /api/csrf/` - CSRF token
- `GET /api/academy/state/` - current browser-session progress
- `POST /api/academy/progress/` - add or remove a completed item
- `POST /api/sandbox/python/` - run Python code and optional tests
- `POST /api/sandbox/sql-n1/` - compare N+1 and JOIN query counts

Progress is scoped to the Django session cookie. XP is calculated on the server; the browser cannot set arbitrary XP.

## Project structure

```text
academy/              Django app: models, views, sandbox, progress service
backend/              Django settings and URLs
src/                  React application
public/               Vite public assets
dist/                 Production frontend build
manage.py             Django entry point
requirements.txt      Python dependencies
render.yaml           Render blueprint
build.sh              Render build command
```

## Render deployment

1. Create a GitHub repository and push this folder.
2. In Render, choose **New > Blueprint** and select the repository.
3. Render reads `render.yaml`, creates the web service and PostgreSQL database, then runs `build.sh`.
4. After deployment, open the service URL. `DJANGO_ALLOWED_HOSTS` and `DJANGO_CSRF_TRUSTED_ORIGINS` already allow `*.onrender.com` in the blueprint.

Manual Git setup:

```powershell
git init
git add .
git commit -m "Migrate Paimon Academy backend to Django"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Security notes

- CSRF protection is enabled for all POST endpoints.
- Progress is stored per session and protected against concurrent writes.
- Python execution uses a separate process, import allowlist, blocked dangerous names, timeout, memory/CPU limits on Linux, and output limits.
- The Python sandbox is an educational runner, not a hard multi-tenant security boundary. For untrusted public code, use isolated containers or a browser/WASM runtime.
- The SQL lab runs against an in-memory SQLite database and does not touch production data.
