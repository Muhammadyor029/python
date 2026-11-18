export type AcademyProgressCategory =
  | 'completedLessons'
  | 'solvedExercises'
  | 'completedProjectTasks'
  | 'solvedBugs'
  | 'completedReviews'
  | 'solvedIncidents'
  | 'completedModules';

export interface AcademyState {
  completedLessons: string[];
  solvedExercises: string[];
  completedProjectTasks: string[];
  solvedBugs: string[];
  completedReviews: string[];
  solvedIncidents: string[];
  completedModules: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface PythonExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  testPassed?: boolean | null;
  testMessage?: string | null;
  executionMode: 'real-python' | 'fallback';
}

export interface SqlN1Result {
  ok: boolean;
  mode: 'n_plus_1' | 'select_related';
  queryCount: number;
  elapsedMs: number;
  queries: string[];
  explainPlan: string[];
  sampleRows: {book: string; author: string}[];
  executionMode: 'real-sqlite-engine' | 'simulation';
}

const STORAGE_KEY = 'paimon-2-academy-state';

export const EMPTY_ACADEMY_STATE: AcademyState = {
  completedLessons: [],
  solvedExercises: [],
  completedProjectTasks: [],
  solvedBugs: [],
  completedReviews: [],
  solvedIncidents: [],
  completedModules: [],
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
};

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : '';
}

async function getCsrfToken(): Promise<string> {
  let token = readCookie('csrftoken');
  if (token) return token;
  const res = await fetch('/api/csrf/', {credentials: 'same-origin'});
  if (!res.ok) return '';
  const data = (await res.json()) as {csrfToken?: string};
  return data.csrfToken || readCookie('csrftoken');
}

export function loadLocalAcademyState(): AcademyState {
  if (typeof window === 'undefined') return {...EMPTY_ACADEMY_STATE};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let legacyModules: string[] = [];
    try {
      const legacyRaw = localStorage.getItem('paimon-completed-modules');
      const parsedLegacy = legacyRaw ? JSON.parse(legacyRaw) : [];
      legacyModules = Array.isArray(parsedLegacy) ? parsedLegacy : [];
    } catch {
      legacyModules = [];
    }
    if (!raw) return {...EMPTY_ACADEMY_STATE, completedModules: legacyModules};
    const parsed = JSON.parse(raw) as Partial<AcademyState>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      solvedExercises: Array.isArray(parsed.solvedExercises)
        ? parsed.solvedExercises
        : [],
      completedProjectTasks: Array.isArray(parsed.completedProjectTasks)
        ? parsed.completedProjectTasks
        : [],
      solvedBugs: Array.isArray(parsed.solvedBugs) ? parsed.solvedBugs : [],
      completedReviews: Array.isArray(parsed.completedReviews)
        ? parsed.completedReviews
        : [],
      solvedIncidents: Array.isArray(parsed.solvedIncidents)
        ? parsed.solvedIncidents
        : [],
      completedModules: Array.isArray(parsed.completedModules)
        ? parsed.completedModules
        : legacyModules,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 1,
      lastActiveDate:
        typeof parsed.lastActiveDate === 'string'
          ? parsed.lastActiveDate
          : new Date().toISOString().slice(0, 10),
    };
  } catch {
    return {...EMPTY_ACADEMY_STATE};
  }
}

export function saveLocalAcademyState(state: AcademyState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export async function fetchServerAcademyState(): Promise<AcademyState | null> {
  try {
    const res = await fetch('/api/academy/state/', {
      credentials: 'same-origin',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as AcademyState;
    return data;
  } catch {
    return null;
  }
}

export async function postServerProgress(
  category: AcademyProgressCategory,
  id: string,
  _xpDelta = 25,
  remove = false
): Promise<AcademyState | null> {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch('/api/academy/progress/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({category, id, remove}),
    });
    if (!res.ok) return null;
    return (await res.json()) as AcademyState;
  } catch {
    return null;
  }
}

export async function executeRealPython(
  code: string,
  testCode?: string
): Promise<PythonExecResult> {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch('/api/sandbox/python/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({code, testCode}),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {error?: string};
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return (await res.json()) as PythonExecResult;
  } catch (err) {
    return {
      ok: false,
      stdout: '',
      stderr: `Server sandboxiga ulanib bo‘lmadi: ${
        err instanceof Error ? err.message : 'Tarmoq xatosi'
      }`,
      elapsedMs: 0,
      executionMode: 'fallback',
    };
  }
}

export async function executeRealSqlN1(
  mode: 'n_plus_1' | 'select_related',
  rows = 12
): Promise<SqlN1Result> {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch('/api/sandbox/sql-n1/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({mode, rows}),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as SqlN1Result;
  } catch {
    return {
      ok: true,
      mode,
      queryCount: mode === 'n_plus_1' ? rows + 1 : 1,
      elapsedMs: 0,
      queries:
        mode === 'n_plus_1'
          ? [
              `SELECT id, title, author_id FROM books LIMIT ${rows}`,
              'SELECT id, name FROM authors WHERE id = 1',
              'SELECT id, name FROM authors WHERE id = 2',
              '... (har bir qator uchun yana qayta so‘rov)',
            ]
          : [
              `SELECT b.id, b.title, a.name FROM books b INNER JOIN authors a ON b.author_id = a.id LIMIT ${rows}`,
            ],
      explainPlan: [
        mode === 'n_plus_1'
          ? 'SEARCH authors USING INTEGER PRIMARY KEY (rowid=?) (N marta!)'
          : 'SCAN b + SEARCH a USING INTEGER PRIMARY KEY (1 marta)',
      ],
      sampleRows: [
        {book: 'Backend Kitob #1', author: 'Muallif #2'},
        {book: 'Backend Kitob #2', author: 'Muallif #3'},
      ],
      executionMode: 'simulation',
    };
  }
}
