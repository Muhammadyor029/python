import React from 'react';
import {motion} from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Bug,
  Code2,
  Compass,
  Cpu,
  Database,
  Flame,
  FolderGit2,
  Layers,
  Moon,
  Send,
  ShieldAlert,
  Sparkles,
  Sun,
  Terminal,
  Trophy,
} from 'lucide-react';
import {BACKEND_ASSETS} from '../data/backendCards';
import type {AcademyState} from '../data/academyApi';
import {ACHIEVEMENT_BADGES, LEARNING_TIERS} from '../data/roadmapProfile';

export type ActiveView =
  | 'dashboard'
  | 'hammasi'
  | 'python'
  | 'django'
  | 'api'
  | 'lessons'
  | 'visuals'
  | 'workspace'
  | 'projects'
  | 'academy'
  | 'roadmap';

interface DashboardOverviewProps {
  onSelectView: (view: ActiveView, scrollTargetId?: string) => void;
  completedModuleCount: number;
  totalModuleCount: number;
  academyState: AcademyState;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenModal: (key: string) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTION_CARDS: {
  view: 'hammasi' | 'python' | 'django' | 'api';
  number: string;
  badge: string;
  title: string;
  desc: string;
  highlights: string[];
  cta: string;
  icon: React.ComponentType<{className?: string}>;
  image: string;
}[] = [
  {
    view: 'hammasi',
    number: '01',
    badge: '16 bob · 440 mavzu yo‘nalishi',
    title: '1. Barcha Mavzular',
    desc: 'print("Salom, Dunyo!") dan boshlab Django + PostgreSQL + Celery + Docker production serverigacha bo‘lgan 12 ta modul, 16 bob va 440 mavzu yo‘nalishi atlasi.',
    highlights: [
      '12-modulli interaktiv darslik + terminal',
      'Python (150), PG (90), Django (120), DRF (80) yo‘nalishlari',
      '28 ta suhbat kartochkasi va random test',
    ],
    cta: '1-bo‘limni ochish',
    icon: Layers,
    image: BACKEND_ASSETS.terminal,
  },
  {
    view: 'python',
    number: '02',
    badge: '150 mavzu · 0 dan Ekspertgacha',
    title: '2. Python Akademiyasi',
    desc: 'Hatto int va str nimaligidan boshlab Decimal pul aniqligi, is vs ==, deepcopy, yield generatorlar, dekoratorlar, with kontekst menejeri va GIL/Asyncio gacha.',
    highlights: [
      '10 ta asosiy tur jonli qutilarda (int, list, dict...)',
      'Xotira, Generator RAM va GIL laboratoriyasi',
      'Python Bug Hunter va random savollar',
    ],
    cta: 'Python bo‘limiga kirish',
    icon: Code2,
    image: BACKEND_ASSETS.terminal,
  },
  {
    view: 'django',
    number: '03',
    badge: '210 mavzu · Baza & Arxitektura',
    title: '3. Django & PostgreSQL',
    desc: 'SQL NULL tuzoqlari, MVCC va VACUUM, B-tree/GIN/BRIN indekslari, Django ORM N+1 yechimi, Celery + Redis jonli oqimi va Paimon saytining o‘z haqiqiy Django fayllari.',
    highlights: [
      'N+1 vs select_related va MVCC vizualizatori',
      'Celery + Redis 14ms vs 4,200ms simulyatori',
      'paimon_academy_django loyiha kodlari',
    ],
    cta: 'Django & SQL ga kirish',
    icon: Database,
    image: BACKEND_ASSETS.vault,
  },
  {
    view: 'api',
    number: '04',
    badge: '80 mavzu · REST & Xavfsizlik',
    title: '4. API Yozish (DRF)',
    desc: 'Serializer 3-bosqichli validatsiyasi, Mass Assignment (fields="__all__") xavfidan himoya, JWT Access/Refresh, 401 vs 403, IDOR, Rate Limiting va jonli Endpoint Tester.',
    highlights: [
      'Jonli Django DRF Endpoint Simulyatori',
      'IDOR, JWT va CursorPagination qoidalari',
      'API Bug Hunter va Validatsiya tartibi o‘yini',
    ],
    cta: 'API bo‘limiga kirish',
    icon: Send,
    image: BACKEND_ASSETS.pipeline,
  },
];

const STUDIO_CARDS: {
  view: 'lessons' | 'visuals' | 'workspace' | 'projects' | 'academy' | 'roadmap';
  tag: string;
  title: string;
  desc: string;
  cta: string;
  icon: React.ComponentType<{className?: string}>;
}[] = [
  {
    view: 'lessons',
    tag: '12-BOSQICHLI DARSLIK',
    title: 'Lesson Engine (5 Kod Darajasi)',
    desc: 'Muammo → Hayotiy analogiya → Ichki mexanizm → 5 xil murakkablikdagi kod → Python sandbox tajriba va xatolar.',
    cta: 'Darslikni ochish',
    icon: BookOpen,
  },
  {
    view: 'visuals',
    tag: 'INTERAKTIV VIZUALIZATSIYA',
    title: '5 ta Visual Learning Lab',
    desc: 'Python Stack/Heap, Django Request Lifecycle, Real SQLite N+1 vs JOIN, API Auth Flow va PostgreSQL B-Tree/MVCC.',
    cta: 'Lablarni ko‘rish',
    icon: Cpu,
  },
  {
    view: 'workspace',
    tag: 'PYTHON SANDBOX',
    title: 'Guided Coding Workspace',
    desc: '3-ustunli amaliy IDE: bosqichma-bosqich ko‘rsatmalar, Tab-indent muharrir va serverda ishlaydigan assert testlar.',
    cta: 'Kod yozish',
    icon: Terminal,
  },
  {
    view: 'projects',
    tag: 'PORTFOLIO & KANBAN',
    title: '6 ta Real Backend Loyiha',
    desc: 'CLI Contact Book, Django Blog, Blog REST API, E-Commerce, Mini PAIMON LMS va Multi-Tenant SaaS + ER & Kanban.',
    cta: 'Loyihalarga kirish',
    icon: FolderGit2,
  },
  {
    view: 'academy',
    tag: 'MUHANDISLIK AKADEMIYASI',
    title: 'Debugging, Code Review & Prod',
    desc: 'Stack trace o‘qib xato tuzatish, PR #142/#189 Code Review qilish va Docker/Nginx/Slow-Query incidentlarini yechish.',
    cta: 'Akademiyaga kirish',
    icon: ShieldAlert,
  },
  {
    view: 'roadmap',
    tag: 'PROFIL & SMART ROADMAP',
    title: '6 Daraja, XP va 9 Yutuq',
    desc: 'Absolute Beginner → Expert yo‘l xaritasi, aqlli yo‘naltiruvchi va amaliy natijalar bo‘yicha shaxsiy statistika.',
    cta: 'Profilni ochish',
    icon: Compass,
  },
];

export function DashboardOverview({
  onSelectView,
  completedModuleCount,
  totalModuleCount,
  academyState,
  isDark,
  onToggleTheme,
  onOpenModal,
}: DashboardOverviewProps) {
  const progressPct = Math.round(
    (completedModuleCount / Math.max(1, totalModuleCount)) * 100
  );

  const effectiveXp = academyState.xp;
  let currentTier = LEARNING_TIERS[0];
  for (const t of LEARNING_TIERS) {
    if (effectiveXp >= t.minXp) currentTier = t;
  }

  const unlockedBadges = ACHIEVEMENT_BADGES.filter((b) =>
    b.checkUnlocked({
      xp: effectiveXp,
      lessonsCount: academyState.completedLessons.length,
      exercisesCount: academyState.solvedExercises.length,
      projectsCount: academyState.completedProjectTasks.length,
      bugsCount: academyState.solvedBugs.length,
      reviewsCount: academyState.completedReviews.length,
      incidentsCount: academyState.solvedIncidents.length,
      modulesCount: completedModuleCount,
    })
  ).length;

  return (
    <div className="relative z-10 border-t border-[var(--hairline)]">
      {/* Ambient accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[70vw] max-w-[820px] h-[320px] rounded-full opacity-20 blur-[115px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,90,31,0.45) 0%, rgba(255,154,74,0.1) 55%, transparent 75%)',
        }}
      />

      <section
        id="dashboard"
        className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-16 pb-14"
      >
        {/* Introduction + Live Progress Summary */}
        <motion.div
          initial={{opacity: 0, y: 14}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.1}}
          transition={{duration: 0.45, ease: EASE}}
          className="liquid-glass rounded-[24px] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">
              PAIMON 2.0 BACKEND ACADEMY · SAYT BILAN TANISHUV VA YO‘NALISH
            </p>
            <h2
              className="mt-2.5 text-[clamp(26px,2.7vw,42px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              Backendni <em className="italic">tushunib, vizual ko‘rib</em> va
              real kod yozib o‘rganing.
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--body)]">
              PAIMON 2.0 formulasi:{' '}
              <strong>
                UNDERSTAND → VISUALIZE → CODE → DEBUG → BUILD → MASTER
              </strong>
              . Pastda ham klassik 4 ta asosiy bo‘lim, ham yangi interaktiv
              muhandislik studiyalari mavjud.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="liquid-glass-pill px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono">
                <Trophy className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span className="font-semibold text-[var(--ink)]">
                  {currentTier.level}
                </span>
                <span className="text-[var(--muted)]">· {effectiveXp} XP</span>
              </div>
              <div className="liquid-glass-pill px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-mono">
                <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span className="text-[var(--ink)]">
                  {academyState.streakDays}d
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectView('roadmap')}
                className="liquid-glass-pill px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>
                  {unlockedBadges}/{ACHIEVEMENT_BADGES.length} Yutuq
                </span>
              </button>
            </div>

            <div className="liquid-glass-pill px-4 py-2 rounded-2xl flex items-center gap-3 text-xs font-mono">
              <span className="text-[var(--muted)]">Modullar:</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">
                {completedModuleCount} / {totalModuleCount} ({progressPct}%)
              </span>
              <div className="w-16 h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.1] overflow-hidden">
                <div
                  className="h-full bg-[#FF5A1F] rounded-full transition-all duration-300"
                  style={{width: `${progressPct}%`}}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectView('lessons')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>12-Bosqichli Darslikni boshlash</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectView('hammasi', 'hammasi-test')}
                className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
              >
                <Bug className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Random Test &amp; Bug Hunter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* PAIMON 2.0 Interactive Studios */}
        <div id="paimon-studios" className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <p className="eyebrow">
              PAIMON 2.0 · INTERAKTIV MUHANDISLIK STUDIYALARI
            </p>
            <span className="text-xs font-mono text-[var(--muted)]">
              Python + SQLite sandbox + 6 loyiha Kanban
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STUDIO_CARDS.map((studio) => {
              const Icon = studio.icon;
              return (
                <button
                  key={studio.view}
                  type="button"
                  onClick={() => onSelectView(studio.view)}
                  className="text-left liquid-glass liquid-glass-interactive rounded-[22px] p-5 flex flex-col justify-between gap-4 border border-[var(--glass-border)] hover:border-[#FF5A1F]/45 cursor-pointer group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#FF5A1F] font-semibold">
                        {studio.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3
                      className="text-lg font-normal tracking-[-0.015em] text-[var(--ink)]"
                      style={{fontFamily: 'var(--serif)'}}
                    >
                      {studio.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--body)]">
                      {studio.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--hairline)] flex items-center justify-between text-xs font-medium text-[#FF5A1F]">
                    <span>{studio.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Core Curriculum Section Portal Cards */}
        <div className="mt-10 mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="eyebrow">ASOSIY 4 TA O‘QUV BO‘LIMI · 440 MAVZU YO‘NALISHI</p>
          <span className="text-xs font-mono text-[var(--muted)]">
            Har bir bo‘limda nazariya, laboratoriya va random testlar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SECTION_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.view}
                initial={{opacity: 0, y: 14}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.08}}
                transition={{duration: 0.45, delay: idx * 0.05, ease: EASE}}
                onClick={() => onSelectView(card.view)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectView(card.view);
                  }
                }}
                className="liquid-glass liquid-glass-interactive rounded-[24px] p-5 md:p-6 flex flex-col justify-between gap-5 cursor-pointer group border border-[var(--glass-border)] hover:border-[#FF5A1F]/45"
              >
                <div className="space-y-4">
                  {/* Top visual strip */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <span className="text-[#FF5A1F] font-semibold">
                        BO‘LIM {card.number}
                      </span>
                      <span className="text-[var(--muted)]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[var(--muted)]">{card.badge}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3
                      className="text-xl md:text-2xl font-normal tracking-[-0.02em] text-[var(--ink)]"
                      style={{fontFamily: 'var(--serif)'}}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs md:text-sm leading-relaxed text-[var(--body)]">
                      {card.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 m-0 p-0 list-none pt-1">
                    {card.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-xs text-[var(--body)]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[var(--hairline)] flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-[var(--muted)] inline-flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>Amaliy laboratoriya + Random test</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF5A1F] group-hover:translate-x-0.5 transition-transform">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Quick Practice Shortcuts */}
        <div className="mt-6 liquid-glass rounded-[20px] p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-[#FF5A1F] shrink-0" />
            <p className="text-xs md:text-sm text-[var(--body)]">
              <strong className="text-[var(--ink)]">Tezkor kirish:</strong>{' '}
              to‘g‘ridan-to‘g‘ri Real SQLite ORM Lab, Python IDE, Celery
              simulyatori yoki savol bazasini ochish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectView('workspace')}
              className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
            >
              Python IDE
            </button>
            <button
              type="button"
              onClick={() => onSelectView('visuals')}
              className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
            >
              Visual Lablar
            </button>
            <button
              type="button"
              onClick={() => onSelectView('django', 'celery-lab')}
              className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
            >
              Celery Simulyator
            </button>
            <button
              type="button"
              onClick={() => onSelectView('api', 'api-lab')}
              className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
            >
              DRF Endpoint Tester
            </button>
            <button
              type="button"
              onClick={() => onSelectView('hammasi', 'intervyu-baza')}
              className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
            >
              Intervyu Bazasi
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer on Dashboard */}
      <footer className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] py-8 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[var(--ink)] text-sm tracking-[-0.02em]">
            Paimon Backend
          </span>
          <span aria-hidden="true">·</span>
          <span>
            print(&quot;Salom, Dunyo!&quot;) dan Python, PostgreSQL, Django, DRF
            va Docker deploygacha.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpenModal('Start')}
            className="hover:text-[var(--ink)] cursor-pointer transition-colors"
          >
            Yo‘riqnoma
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Kunduzgi</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Tungi</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
