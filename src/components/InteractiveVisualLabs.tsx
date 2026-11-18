import React, {useEffect, useState} from 'react';
import {motion} from 'motion/react';
import {
  Activity,
  Cpu,
  Database,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Server,
  SkipBack,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import {executeRealSqlN1, SqlN1Result} from '../data/academyApi';

export type VisualLabKey =
  | 'python-visual'
  | 'django-visual'
  | 'orm-visual'
  | 'api-visual'
  | 'postgres-visual';

interface InteractiveVisualLabsProps {
  initialLab?: VisualLabKey;
}

const LAB_TABS: {id: VisualLabKey; label: string; icon: React.ComponentType<{className?: string}>}[] = [
  {id: 'python-visual', label: 'Python Visual Lab', icon: Cpu},
  {id: 'django-visual', label: 'Django Visual Lab', icon: Server},
  {id: 'orm-visual', label: 'Django ORM (Real SQLite)', icon: Gauge},
  {id: 'api-visual', label: 'API Visual Lab', icon: Activity},
  {id: 'postgres-visual', label: 'PostgreSQL Visual Lab', icon: Database},
];

// Reusable Step-by-Step Playback Controls
function PlaybackBar({
  step,
  maxSteps,
  playing,
  speed,
  onTogglePlay,
  onPrev,
  onNext,
  onReset,
  onSpeedChange,
}: {
  step: number;
  maxSteps: number;
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (s: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer"
        >
          {playing ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onPrev}
          aria-label="Oldingi qadam"
          className="liquid-glass-pill p-1.5 rounded-full text-[var(--ink)] cursor-pointer"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Keyingi qadam"
          className="liquid-glass-pill p-1.5 rounded-full text-[var(--ink)] cursor-pointer"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Qayta boshlash"
          className="liquid-glass-pill p-1.5 rounded-full text-[var(--body)] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="text-[var(--muted)] tabular-nums">
          Bosqich: <strong className="text-[var(--ink)]">{step + 1}</strong> /{' '}
          {maxSteps}
        </span>
        <div className="flex items-center gap-1">
          {[0.5, 1, 2].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => onSpeedChange(sp)}
              className={`px-2 py-0.5 rounded-full text-[11px] cursor-pointer ${
                speed === sp
                  ? 'bg-[#FF5A1F] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const PY_DECORATOR_STEPS = [
  {
    title: '1. Modul yuklanishi (Definition Time)',
    desc: 'Python `@vaqt_olcha` ni ko‘rganda `hisobot = vaqt_olcha(hisobot)` ni darhol bajaradi. `func` closure katagida saqlanadi.',
    activeLayer: 'wrap',
  },
  {
    title: '2. Funksiya chaqirilishi: `hisobot("May")`',
    desc: 'Foydalanuvchi `hisobot` ni chaqirganda aslida `wrapper(*args, **kwargs)` ishga tushadi.',
    activeLayer: 'enter',
  },
  {
    title: '3. Pre-logic (Taymer yoqildi)',
    desc: 'Asl funksiyadan oldin `t0 = time.perf_counter()` va audit/ruxsat tekshiruvi bajariladi.',
    activeLayer: 'pre',
  },
  {
    title: '4. Asl `func()` bajarilishi',
    desc: 'Ichkarida saqlangan asl `hisobot("May")` chaqiriladi va qiymat `natija` ga olinadi.',
    activeLayer: 'core',
  },
  {
    title: '5. Post-logic & `return natija`',
    desc: 'Vaqt farqi chiqariladi va `natija` chaqiruvchiga qaytariladi.',
    activeLayer: 'exit',
  },
];

const DJANGO_LIFECYCLE_STEPS = [
  {
    node: 'Browser / Client',
    desc: 'Foydalanuvchi `GET /api/v1/orders/42/` HTTP so‘rovini TLS (HTTPS) orqali yuboradi.',
    detail: 'Headers: Authorization: Bearer eyJhbGci..., Accept: application/json',
  },
  {
    node: 'Nginx / Gunicorn (WSGI/ASGI)',
    desc: 'Nginx statik fayllarni o‘zi beradi, dinamik API so‘rovni Gunicorn (WSGI) yoki Uvicorn (ASGI) workerga uzatadi.',
    detail: 'WSGI: har worker 1 sinxron so‘rov | ASGI: 1 Event Loop minglab async I/O so‘rovlar.',
  },
  {
    node: 'Django Middleware Chain',
    desc: 'SecurityMiddleware → SessionMiddleware → CsrfViewMiddleware → AuthenticationMiddleware tartibda ishlaydi va `request.user` ni biriktiradi.',
    detail: 'Onion modeli: kirishda yuqoridan pastga, javob qaytishda pastdan yuqoriga!',
  },
  {
    node: 'URL Resolver',
    desc: '`urls.py` dagi `path("orders/<int:pk>/", ...)` dan mos View va `pk=42` parametrini ajratib oladi.',
    detail: 'Topilmasa darhol 404 Resolver404 qaytadi.',
  },
  {
    node: 'View Execution & ORM',
    desc: 'View `select_related()` bilan ORM QuerySet tuzadi; evaluate bo‘lganda PostgreSQLga SQL yuboriladi.',
    detail: 'SELECT * FROM orders INNER JOIN users ... WHERE orders.id = 42',
  },
  {
    node: 'PostgreSQL → Response',
    desc: 'Baza qatorni qaytaradi, Serializer JSON yasaydi va Middleware orqali `200 OK` mijozga ketadi.',
    detail: 'Cache hit bo‘lsa ORM/DB bosqichi butunlay chetlab o‘tiladi.',
  },
];

const API_LIFECYCLE_STEPS = [
  {
    stage: '1. HTTP Request + JWT Header',
    desc: 'Klient `POST /api/v1/orders/` ga JSON body + `Authorization: Bearer ...` + `Idempotency-Key` yuboradi.',
  },
  {
    stage: '2. JWT Authentication (401 tekshiruvi)',
    desc: 'Token imzosi va muddati tekshiriladi. Yaroqsiz bo‘lsa darhol `401 Unauthorized` qaytadi.',
  },
  {
    stage: '3. Permissions & Throttling (403 / 429)',
    desc: 'Ruxsat (`IsAuthenticated`, `IsOwner`) va limit (`60/min`) tekshiriladi. Ruxsat yetmasa `403`, limitdan oshsa `429 Too Many Requests`.',
  },
  {
    stage: '4. 3-Step Serializer Validation (400)',
    desc: '1) Field types → 2) `validate_<field>()` → 3) `validate(attrs)`. `read_only_fields` o‘zgartirishga urinish e’tiborsiz qoldiriladi.',
  },
  {
    stage: '5. Idempotency + Atomic Save → 201 Created',
    desc: 'Bazaga saqlanib, natija JSON formatida va `Idempotency-Key` keshida qaytariladi.',
  },
];

export function InteractiveVisualLabs({
  initialLab = 'python-visual',
}: InteractiveVisualLabsProps) {
  const [activeLab, setActiveLab] = useState<VisualLabKey>(initialLab);

  useEffect(() => {
    setActiveLab(initialLab);
  }, [initialLab]);

  // Shared Step Playback state
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Python sub-visual selector
  const [pyTopic, setPyTopic] = useState<'memory' | 'exec' | 'decorator' | 'structures'>('decorator');
  // PostgreSQL sub-visual selector
  const [joinType, setJoinType] = useState<'INNER' | 'LEFT' | 'RIGHT' | 'FULL'>('INNER');
  const [pgMode, setPgMode] = useState<'join' | 'index' | 'mvcc'>('join');
  const [scanMode, setScanMode] = useState<'seq' | 'btree'>('btree');

  // Real SQLite ORM N+1 state
  const [sqlResult, setSqlResult] = useState<SqlN1Result | null>(null);
  const [sqlLoading, setSqlLoading] = useState(false);

  const maxSteps =
    activeLab === 'python-visual'
      ? PY_DECORATOR_STEPS.length
      : activeLab === 'django-visual'
        ? DJANGO_LIFECYCLE_STEPS.length
        : activeLab === 'api-visual'
          ? API_LIFECYCLE_STEPS.length
          : 4;

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [activeLab, pyTopic]);

  useEffect(() => {
    if (!playing) return;
    const intervalMs = Math.round(1350 / speed);
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % maxSteps);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [playing, speed, maxSteps]);

  const runRealSqlTest = async (mode: 'n_plus_1' | 'select_related') => {
    setSqlLoading(true);
    const res = await executeRealSqlN1(mode, 12);
    setSqlResult(res);
    setSqlLoading(false);
  };

  useEffect(() => {
    if (activeLab === 'orm-visual' && !sqlResult) {
      void runRealSqlTest('n_plus_1');
    }
  }, [activeLab, sqlResult]);

  return (
    <div className="liquid-glass rounded-[24px] p-5 md:p-8 border border-[var(--glass-border)] space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
            PAIMON 2.0 · INTERACTIVE VISUAL LEARNING LABS
          </p>
          <h2
            className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Mexanizmlarni <em className="italic">harakatda</em> va qadam-baqadam ko‘ring
          </h2>
          <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] max-w-2xl">
            Play / Pause / Step / Speed tugmalari bilan Python xotirasi,
            Dekoratorlar, Django Request zanjiri, Real SQLite N+1 so‘rovlari va
            PostgreSQL JOIN/Index ishlashini boshqaring.
          </p>
        </div>
      </div>

      {/* 5 Lab Tabs */}
      <div className="flex flex-wrap gap-2">
        {LAB_TABS.map((t) => {
          const Icon = t.icon;
          const active = activeLab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveLab(t.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
                active
                  ? 'bg-[#FF5A1F] text-white shadow-[0_4px_14px_rgba(255,90,31,0.3)]'
                  : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* 1. PYTHON VISUAL LAB                                              */}
      {/* ================================================================= */}
      {activeLab === 'python-visual' && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['decorator', 'Decorator Wrapper Flow'],
                ['memory', 'Variables, Heap & Copy'],
                ['exec', 'Bytecode → PVM Call Stack'],
                ['structures', 'Dict Hash / Stack / Queue'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => setPyTopic(k)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                  pyTopic === k
                    ? 'bg-[var(--ink)] text-[var(--bg)]'
                    : 'liquid-glass-pill text-[var(--body)]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {pyTopic === 'decorator' && (
            <>
              <PlaybackBar
                step={step}
                maxSteps={PY_DECORATOR_STEPS.length}
                playing={playing}
                speed={speed}
                onTogglePlay={() => setPlaying((p) => !p)}
                onPrev={() =>
                  setStep((s) => (s - 1 + PY_DECORATOR_STEPS.length) % PY_DECORATOR_STEPS.length)
                }
                onNext={() => setStep((s) => (s + 1) % PY_DECORATOR_STEPS.length)}
                onReset={() => {
                  setPlaying(false);
                  setStep(0);
                }}
                onSpeedChange={setSpeed}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F1115] border border-white/10 space-y-4">
                  <div className="text-[11px] font-mono text-[#FFB06A]">
                    @vaqt_olcha(hisobot) — Wrapper qatlamlari
                  </div>
                  <motion.div
                    animate={{
                      borderColor:
                        step === 1 || step === 2 || step === 4
                          ? '#FF5A1F'
                          : 'rgba(255,255,255,0.18)',
                    }}
                    className="p-4 rounded-2xl border-2 border-dashed space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#D8DEE9]">
                      <span>wrapper(*args, **kwargs)</span>
                      <span className="text-[#FF5A1F]">
                        {step === 2
                          ? 't0 = perf_counter()'
                          : step === 4
                            ? 'return natija'
                            : 'Closure: func'}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        scale: step === 3 ? 1.03 : 1,
                        borderColor:
                          step === 3 ? '#10B981' : 'rgba(255,255,255,0.14)',
                        backgroundColor:
                          step === 3
                            ? 'rgba(16,185,129,0.14)'
                            : 'rgba(255,255,255,0.03)',
                      }}
                      className="p-4 rounded-xl border text-center font-mono text-xs text-white"
                    >
                      Asl funksiya: <strong>hisobot(&quot;May&quot;)</strong>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="lg:col-span-6 space-y-2.5">
                  {PY_DECORATOR_STEPS.map((st, idx) => (
                    <button
                      key={st.title}
                      type="button"
                      onClick={() => setStep(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        idx === step
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[var(--ink)]'
                          : 'border-[var(--hairline)] text-[var(--body)] opacity-75'
                      }`}
                    >
                      <div className="font-mono font-semibold text-[#FF5A1F]">
                        {st.title}
                      </div>
                      <div className="mt-1 leading-relaxed">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {pyTopic === 'memory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-3 border border-white/10">
                <div className="text-[#FFB06A]">Stack Names → Heap PyObjects</div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04]">
                  <span>a ──▶</span>
                  <span className="text-[#9FE6B8]">PyObject List @ 0x7FA1 (refcnt=2)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04]">
                  <span>b = a ──▶</span>
                  <span className="text-[#FFB06A]">Aynan o‘sha 0x7FA1 (a is b == True)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04]">
                  <span>c = deepcopy(a) ──▶</span>
                  <span className="text-sky-300">Yangi 0x9B04 + ichki nusxalar</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-[var(--hairline)] text-xs md:text-sm text-[var(--body)] leading-relaxed space-y-2">
                <p>
                  <strong className="text-[var(--ink)]">Reference Counting:</strong>{' '}
                  Har bir obyekt necha o‘zgaruvchi unga qarab turganini sanaydi.
                  `refcnt == 0` bo‘lishi bilan CPython xotirani darhol qaytaradi
                  (siklik havolalarni esa Cyclic GC tozalaydi).
                </p>
                <p>
                  <strong className="text-[var(--ink)]">Mutable vs Immutable:</strong>{' '}
                  `int`, `str`, `tuple` o‘zgarmaydi — `x += 1` yangi manzil yaratadi.
                  `list`, `dict`, `set` esa joyida (in-place) o‘zgaradi.
                </p>
              </div>
            </div>
          )}

          {pyTopic === 'exec' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                {
                  t: '1. Source Code (.py)',
                  d: 'Lexer va Parser kodni AST (Abstract Syntax Tree) daraxtiga aylantiradi.',
                },
                {
                  t: '2. Bytecode (.pyc)',
                  d: 'Compiler AST dan PVM tushunadigan instruksiyalar (`LOAD_FAST`, `CALL`) tuzadi.',
                },
                {
                  t: '3. PVM & Call Stack',
                  d: 'Har bir funksiya chaqiruvida Stack Frame ochiladi; `return` da yopiladi. O‘zgaruvchilar LEGB (Local→Enclosing→Global→Built-in) bo‘yicha izlanadi.',
                },
                {
                  t: '4. GC & Memory Free',
                  d: 'Reference count 0 ga tushgan stack/heap obyektlari tozalanadi.',
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] text-xs space-y-1.5"
                >
                  <div className="font-mono font-semibold text-[#FF5A1F]">
                    {b.t}
                  </div>
                  <p className="text-[var(--body)] leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          )}

          {pyTopic === 'structures' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                {
                  name: 'List & Tuple',
                  info: 'List — dinamik pointer massivi (append amaliy O(1)). Tuple — o‘zgarmas va kichikroq xotirali ketma-ketlik.',
                },
                {
                  name: 'Dict & Set (Hash Table)',
                  info: 'hash(kalit) → bucket indeksi orqali O(1) qidiruv. Collision chiqsa Python ochiq adreslash (open addressing probing) bilan keyingi bo‘sh katakka o‘tadi.',
                },
                {
                  name: 'Stack (LIFO) & Queue (FIFO)',
                  info: 'Stack: `append`/`pop()` (Call Stack). Queue: `collections.deque` bilan `popleft()` O(1) (`list.pop(0)` O(N) sekin!).',
                },
                {
                  name: 'Linked List, Tree & Graph',
                  info: 'Linked List — tugun havolalari. Tree — iyerarxiya (B-tree indekslar!). Graph — ijtimoiy tarmoq va yo‘nalishlar (BFS/DFS).',
                },
              ].map((card) => (
                <div
                  key={card.name}
                  className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-1.5"
                >
                  <div className="font-mono font-semibold text-[var(--ink)]">
                    {card.name}
                  </div>
                  <p className="text-[var(--body)] leading-relaxed">{card.info}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. DJANGO VISUAL LAB                                              */}
      {/* ================================================================= */}
      {activeLab === 'django-visual' && (
        <div className="space-y-5">
          <PlaybackBar
            step={step}
            maxSteps={DJANGO_LIFECYCLE_STEPS.length}
            playing={playing}
            speed={speed}
            onTogglePlay={() => setPlaying((p) => !p)}
            onPrev={() =>
              setStep((s) => (s - 1 + DJANGO_LIFECYCLE_STEPS.length) % DJANGO_LIFECYCLE_STEPS.length)
            }
            onNext={() => setStep((s) => (s + 1) % DJANGO_LIFECYCLE_STEPS.length)}
            onReset={() => {
              setPlaying(false);
              setStep(0);
            }}
            onSpeedChange={setSpeed}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DJANGO_LIFECYCLE_STEPS.map((st, idx) => {
              const active = idx === step;
              const passed = idx < step;
              return (
                <button
                  key={st.node}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-[#FF5A1F] bg-[#FF5A1F] text-white shadow-[0_6px_18px_rgba(255,90,31,0.3)]'
                      : passed
                        ? 'border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[var(--ink)]'
                        : 'border-[var(--hairline)] text-[var(--body)]'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-80">
                    BOSQICH 0{idx + 1}
                  </div>
                  <div className="mt-1 text-xs font-semibold leading-snug">
                    {st.node}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-2xl bg-[#0F1115] text-[#D8DEE9] border border-white/10 space-y-2">
            <div className="text-xs font-mono text-[#FFB06A]">
              {DJANGO_LIFECYCLE_STEPS[step]?.node}
            </div>
            <p className="text-sm text-white leading-relaxed">
              {DJANGO_LIFECYCLE_STEPS[step]?.desc}
            </p>
            <div className="pt-2 border-t border-white/10 font-mono text-xs text-[#9FE6B8]">
              {DJANGO_LIFECYCLE_STEPS[step]?.detail}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. DJANGO ORM VISUAL LAB (REAL SQLITE EXECUTION!)                 */}
      {/* ================================================================= */}
      {activeLab === 'orm-visual' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={sqlLoading}
                onClick={() => void runRealSqlTest('n_plus_1')}
                className={`px-4 py-2 rounded-full text-xs font-mono cursor-pointer ${
                  sqlResult?.mode === 'n_plus_1'
                    ? 'bg-red-600 text-white'
                    : 'liquid-glass-pill text-[var(--ink)]'
                }`}
              >
                ❌ Yomon kod: Book.objects.all() (N+1)
              </button>
              <button
                type="button"
                disabled={sqlLoading}
                onClick={() => void runRealSqlTest('select_related')}
                className={`px-4 py-2 rounded-full text-xs font-mono cursor-pointer ${
                  sqlResult?.mode === 'select_related'
                    ? 'bg-[#FF5A1F] text-white'
                    : 'liquid-glass-pill text-[var(--ink)]'
                }`}
              >
                ✅ To‘g‘ri: select_related(&quot;author&quot;)
              </button>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>
                {sqlResult?.executionMode === 'real-sqlite-engine'
                  ? 'Haqiqiy SQLite Dvigateli (Real Execution)'
                  : 'Simulyatsiya'}
              </span>
            </span>
          </div>

          {sqlResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0F1115] text-white font-mono">
                    <div className="text-[11px] text-[#8B9098]">
                      Bajarilgan SQL soni
                    </div>
                    <div
                      className={`mt-1 text-2xl font-semibold ${
                        sqlResult.queryCount > 1
                          ? 'text-red-400'
                          : 'text-[#9FE6B8]'
                      }`}
                    >
                      {sqlResult.queryCount} ta
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] text-white font-mono">
                    <div className="text-[11px] text-[#8B9098]">
                      Real ijro vaqti
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-[#FFB06A]">
                      {sqlResult.elapsedMs} ms
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[var(--body)]">
                  <strong>EXPLAIN QUERY PLAN:</strong>
                  <div className="mt-1 p-2.5 rounded-lg bg-[#0F1115] text-[#D8DEE9] text-[11px]">
                    {sqlResult.explainPlan.join('\n')}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs border border-white/10 space-y-2 max-h-[260px] overflow-y-auto">
                <div className="text-[#FFB06A]">
                  Real SQLite Query Log ({sqlResult.queryCount} ta so‘rov):
                </div>
                {sqlResult.queries.map((q, idx) => (
                  <div
                    key={`${idx}-${q}`}
                    className={`p-2 rounded-lg border ${
                      idx > 0
                        ? 'border-red-500/35 bg-red-500/10 text-red-200'
                        : 'border-emerald-500/35 bg-emerald-500/10 text-[#9FE6B8]'
                    }`}
                  >
                    #{idx + 1}: {q}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. API ARCHITECTURE VISUAL LAB                                    */}
      {/* ================================================================= */}
      {activeLab === 'api-visual' && (
        <div className="space-y-5">
          <PlaybackBar
            step={step}
            maxSteps={API_LIFECYCLE_STEPS.length}
            playing={playing}
            speed={speed}
            onTogglePlay={() => setPlaying((p) => !p)}
            onPrev={() =>
              setStep((s) => (s - 1 + API_LIFECYCLE_STEPS.length) % API_LIFECYCLE_STEPS.length)
            }
            onNext={() => setStep((s) => (s + 1) % API_LIFECYCLE_STEPS.length)}
            onReset={() => {
              setPlaying(false);
              setStep(0);
            }}
            onSpeedChange={setSpeed}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {API_LIFECYCLE_STEPS.map((st, idx) => {
              const active = idx === step;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    active
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/12 text-[var(--ink)]'
                      : 'border-[var(--hairline)] text-[var(--body)]'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-[#FF5A1F]">
                    {st.stage}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed">{st.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. POSTGRESQL VISUAL LAB (JOIN + INDEX SCAN + MVCC)               */}
      {/* ================================================================= */}
      {activeLab === 'postgres-visual' && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['join', 'SQL JOIN Visualizer (INNER / LEFT / RIGHT / FULL)'],
                ['index', 'Seq Scan vs B-tree Index Scan'],
                ['mvcc', 'MVCC, Locks & WAL'],
              ] as const
            ).map(([m, lbl]) => (
              <button
                key={m}
                type="button"
                onClick={() => setPgMode(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                  pgMode === m
                    ? 'bg-[var(--ink)] text-[var(--bg)]'
                    : 'liquid-glass-pill text-[var(--body)]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {pgMode === 'join' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['INNER', 'LEFT', 'RIGHT', 'FULL'] as const).map((jt) => (
                  <button
                    key={jt}
                    type="button"
                    onClick={() => setJoinType(jt)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                      joinType === jt
                        ? 'bg-[#FF5A1F] text-white'
                        : 'liquid-glass-pill text-[var(--body)]'
                    }`}
                  >
                    {jt} JOIN
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                  <div className="text-[#FF5A1F] font-semibold mb-2">
                    Chap jadval: users
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded bg-emerald-500/15">id=1 | Ali (buyurtma bor)</div>
                    <div className="p-2 rounded bg-emerald-500/15">id=2 | Vali (buyurtma bor)</div>
                    <div
                      className={`p-2 rounded ${
                        joinType === 'LEFT' || joinType === 'FULL'
                          ? 'bg-amber-500/20'
                          : 'opacity-40 bg-white/5'
                      }`}
                    >
                      id=3 | Guli (buyurtma YO‘Q)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                  <div className="text-[#FF5A1F] font-semibold mb-2">
                    O‘ng jadval: orders
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded bg-emerald-500/15">order#10 | user_id=1</div>
                    <div className="p-2 rounded bg-emerald-500/15">order#11 | user_id=2</div>
                    <div
                      className={`p-2 rounded ${
                        joinType === 'RIGHT' || joinType === 'FULL'
                          ? 'bg-sky-500/20'
                          : 'opacity-40 bg-white/5'
                      }`}
                    >
                      order#12 | user_id=NULL (anonim)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] border border-white/10">
                  <div className="text-[#FFB06A] font-semibold mb-2">
                    {joinType} JOIN Natijasi:
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[#9FE6B8]">(Ali, order#10)</div>
                    <div className="text-[#9FE6B8]">(Vali, order#11)</div>
                    {(joinType === 'LEFT' || joinType === 'FULL') && (
                      <div className="text-amber-300">(Guli, NULL)</div>
                    )}
                    {(joinType === 'RIGHT' || joinType === 'FULL') && (
                      <div className="text-sky-300">(NULL, order#12)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {pgMode === 'index' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setScanMode('seq')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    scanMode === 'seq'
                      ? 'bg-red-600 text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  Seq Scan (Indekssiz: 1,000,000 qator)
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('btree')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    scanMode === 'btree'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  B-tree Index Scan (O(log N): ~3 sakrash)
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs border border-white/10">
                {scanMode === 'seq'
                  ? 'Disk sahifalari ketma-ket tekshiriladi: ko‘p I/O, sekin.'
                  : 'B-tree Root -> Branch -> Leaf -> Heap Fetch: O(log N), tez.'}
              </div>
            </div>
          )}

          {pgMode === 'mvcc' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {[
                {
                  t: 'WAL (Write-Ahead Logging)',
                  d: 'Ma’lumot disk jadvaliga yozilishidan OLDIN WAL jurnaliga ketma-ket yoziladi — elektr o‘chsa ham ACID Durability saqlanadi.',
                },
                {
                  t: 'MVCC & Vacuum',
                  d: 'Har qatorda `xmin` va `xmax` bor. O‘quvchi va yozuvchi bir-birini bloklamaydi; o‘lik qatorlarni `VACUUM` tozalaydi.',
                },
                {
                  t: 'Partitioning & Replication',
                  d: 'Katta jadvallar sanalar bo‘yicha bo‘linadi (Partitioning); Streaming Replication esa o‘qish yuklamasini Read-Replica larga tarqatadi.',
                },
              ].map((x) => (
                <div
                  key={x.t}
                  className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-1.5"
                >
                  <div className="font-mono font-semibold text-[#FF5A1F]">
                    {x.t}
                  </div>
                  <p className="text-[var(--body)] leading-relaxed">{x.d}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
