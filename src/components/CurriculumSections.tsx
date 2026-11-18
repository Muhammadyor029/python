import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Activity,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  FileCode2,
  FolderOpen,
  Layers,
  Moon,
  Play,
  RotateCcw,
  Send,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  CURRICULUM_MODULES,
  DJANGO_API_ENDPOINTS,
  DJANGO_PROJECT_FILES,
} from '../data/curriculum';
import {shuffleArray} from '../data/challenges';
import type {ActiveView} from './DashboardOverview';
import {PythonTypesLab} from './PythonTypesLab';
import {PythonDeepDive} from './PythonDeepDive';
import {SyllabusAtlasSection} from './SyllabusAtlasSection';
import {PostgresDjangoLab} from './PostgresDjangoLab';
import {InteractiveTestArena} from './InteractiveTestArena';
import {InterviewBankSection} from './InterviewBankSection';
import {LessonEngine} from './LessonEngine';
import {InteractiveVisualLabs, VisualLabKey} from './InteractiveVisualLabs';
import {GuidedCodingWorkspace} from './GuidedCodingWorkspace';
import {ProjectStudioSection} from './ProjectStudioSection';
import {AcademyLabsSection} from './AcademyLabsSection';
import {RoadmapAndProfileSection} from './RoadmapAndProfileSection';
import type {AcademyState} from '../data/academyApi';

export type SectionViewId = Exclude<ActiveView, 'dashboard'>;

interface CurriculumSectionsProps {
  activeSection: SectionViewId;
  onSelectView: (view: ActiveView, scrollTargetId?: string) => void;
  completedIds: string[];
  onMarkModuleCompleted: (id: string) => void;
  academyState: AcademyState;
  onCompleteLesson: (lessonId: string) => void;
  onSolveExercise: (exerciseId: string) => void;
  onCompleteProjectTask: (taskId: string) => void;
  onSolveBug: (bugId: string) => void;
  onCompleteReview: (reviewId: string) => void;
  onSolveIncident: (incidentId: string) => void;
  activeVisualLab: VisualLabKey;
  onSelectVisualLab: (lab: VisualLabKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenModal: (key: string) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface CeleryJob {
  id: number;
  label: string;
  worker: number;
  progress: number;
  done: boolean;
}

const STUDIO_TABS: {id: SectionViewId; label: string}[] = [
  {id: 'lessons', label: 'Darslik (12-step)'},
  {id: 'visuals', label: 'Visual Lablar'},
  {id: 'workspace', label: 'Coding Workspace'},
  {id: 'projects', label: '6 Loyiha + Kanban'},
  {id: 'academy', label: 'Debug & Prod'},
  {id: 'roadmap', label: 'Roadmap & Profil'},
];

const STUDIO_ID_SET = new Set<SectionViewId>(STUDIO_TABS.map((t) => t.id));

export function CurriculumSections({
  activeSection,
  onSelectView,
  completedIds,
  onMarkModuleCompleted,
  academyState,
  onCompleteLesson,
  onSolveExercise,
  onCompleteProjectTask,
  onSolveBug,
  onCompleteReview,
  onSolveIncident,
  activeVisualLab,
  onSelectVisualLab,
  isDark,
  onToggleTheme,
  onOpenModal,
}: CurriculumSectionsProps) {
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizShuffleSeed, setQuizShuffleSeed] = useState(0);
  const [visibleTermLines, setVisibleTermLines] = useState<number>(0);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [copiedModuleCode, setCopiedModuleCode] = useState(false);

  // Live Celery vs Blocking simulation state
  const [simMode, setSimMode] = useState<'celery' | 'sync'>('celery');
  const [simRunning, setSimRunning] = useState(false);
  const [simStage, setSimStage] = useState<number>(0);
  const [simUserStatus, setSimUserStatus] = useState<string>(
    'Buyurtma yuborishga tayyor'
  );
  const [simElapsedMs, setSimElapsedMs] = useState<number>(0);
  const [jobs, setJobs] = useState<CeleryJob[]>([]);

  // Django Project Structure Explorer state
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);

  // Live Django DRF API Endpoint Tester state
  const [activeEndpointIdx, setActiveEndpointIdx] = useState(0);
  const [endpointRunCount, setEndpointRunCount] = useState(0);
  const [visibleTraceSteps, setVisibleTraceSteps] = useState(4);

  const termTimerRef = useRef<number | null>(null);
  const traceTimerRef = useRef<number | null>(null);
  const simTimersRef = useRef<number[]>([]);
  const jobCounterRef = useRef(4090);

  const activeMod = CURRICULUM_MODULES[activeModIdx];
  const activeFile = DJANGO_PROJECT_FILES[activeFileIdx];
  const activeEndpoint = DJANGO_API_ENDPOINTS[activeEndpointIdx];

  const shuffledModuleOptions = useMemo(() => {
    return shuffleArray(
      activeMod.quizOptions.map((text, idx) => ({
        text,
        isCorrect: idx === activeMod.quizCorrectIndex,
      }))
    );
  }, [activeMod, quizShuffleSeed]);

  useEffect(() => {
    setSelectedAnswer(null);
    setVisibleTermLines(activeMod.terminalOutput.length);
    setIsRunningCode(false);
    if (termTimerRef.current) {
      window.clearInterval(termTimerRef.current);
      termTimerRef.current = null;
    }
  }, [activeModIdx, activeMod.terminalOutput.length]);

  useEffect(() => {
    setVisibleTraceSteps(activeEndpoint.middlewareTrace.length);
    if (traceTimerRef.current) {
      window.clearInterval(traceTimerRef.current);
      traceTimerRef.current = null;
    }
  }, [activeEndpointIdx, activeEndpoint.middlewareTrace.length]);

  useEffect(() => {
    return () => {
      if (termTimerRef.current) window.clearInterval(termTimerRef.current);
      if (traceTimerRef.current) window.clearInterval(traceTimerRef.current);
      simTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const runModuleTerminal = () => {
    if (termTimerRef.current) window.clearInterval(termTimerRef.current);
    setVisibleTermLines(0);
    setIsRunningCode(true);
    let count = 0;
    termTimerRef.current = window.setInterval(() => {
      count += 1;
      setVisibleTermLines(count);
      if (count >= activeMod.terminalOutput.length) {
        if (termTimerRef.current) window.clearInterval(termTimerRef.current);
        termTimerRef.current = null;
        setIsRunningCode(false);
      }
    }, 320);
  };

  const runEndpointSimulation = () => {
    if (traceTimerRef.current) window.clearInterval(traceTimerRef.current);
    setVisibleTraceSteps(0);
    setEndpointRunCount((c) => c + 1);
    let step = 0;
    traceTimerRef.current = window.setInterval(() => {
      step += 1;
      setVisibleTraceSteps(step);
      if (step >= activeEndpoint.middlewareTrace.length) {
        if (traceTimerRef.current) window.clearInterval(traceTimerRef.current);
        traceTimerRef.current = null;
      }
    }, 210);
  };

  const handleSelectQuiz = (idx: number, isCorrect: boolean) => {
    setSelectedAnswer(idx);
    if (isCorrect) {
      onMarkModuleCompleted(activeMod.id);
    }
  };

  const handleCopyModuleCode = async () => {
    try {
      await navigator.clipboard.writeText(activeMod.code);
      setCopiedModuleCode(true);
      setTimeout(() => setCopiedModuleCode(false), 1600);
    } catch {
      setCopiedModuleCode(false);
    }
  };

  const handleCopyFileCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 1600);
    } catch {
      setCopiedFile(false);
    }
  };

  const triggerOrderSimulation = () => {
    simTimersRef.current.forEach((id) => window.clearTimeout(id));
    simTimersRef.current = [];
    setSimRunning(true);
    setSimStage(1);
    setSimElapsedMs(0);

    const orderNum = ++jobCounterRef.current;

    if (simMode === 'celery') {
      setSimUserStatus(`POST /api/v1/orders/ #${orderNum} yuborildi...`);

      const t1 = window.setTimeout(() => {
        setSimStage(2);
        setSimElapsedMs(6);
      }, 220);

      const t2 = window.setTimeout(() => {
        setSimStage(3);
        setSimElapsedMs(11);
      }, 460);

      const t3 = window.setTimeout(() => {
        setSimStage(4);
        setSimElapsedMs(14);
        setSimUserStatus(
          `201 Created — Foydalanuvchi 14 ms da javob oldi! (transaction.on_commit → Celery)`
        );
        setSimRunning(false);

        const newJobs: CeleryJob[] = [
          {
            id: orderNum * 10 + 1,
            label: `#${orderNum} Email yuborish`,
            worker: 1,
            progress: 15,
            done: false,
          },
          {
            id: orderNum * 10 + 2,
            label: `#${orderNum} PDF chek yaratish`,
            worker: 2,
            progress: 10,
            done: false,
          },
          {
            id: orderNum * 10 + 3,
            label: `#${orderNum} Telegram xabar`,
            worker: 3,
            progress: 20,
            done: false,
          },
        ];
        setJobs(newJobs);

        const steps = [45, 78, 100];
        steps.forEach((pct, sIdx) => {
          const jt = window.setTimeout(() => {
            setJobs((prev) =>
              prev.map((j) => ({
                ...j,
                progress: pct,
                done: pct === 100,
              }))
            );
          }, (sIdx + 1) * 600);
          simTimersRef.current.push(jt);
        });
      }, 740);

      simTimersRef.current.push(t1, t2, t3);
    } else {
      setJobs([]);
      setSimUserStatus(
        `POST /api/v1/orders/ #${orderNum} — Django email va PDF tugashini kutmoqda...`
      );
      const t1 = window.setTimeout(() => {
        setSimStage(2);
        setSimElapsedMs(850);
      }, 500);
      const t2 = window.setTimeout(() => {
        setSimStage(3);
        setSimElapsedMs(2400);
        setSimUserStatus(
          'Hali ham PDF generatsiya qilinmoqda (ekran qotgan)...'
        );
      }, 1400);
      const t3 = window.setTimeout(() => {
        setSimStage(4);
        setSimElapsedMs(4200);
        setSimUserStatus(
          `201 Created — Foydalanuvchi 4,200 ms kutishga majbur bo‘ldi!`
        );
        setSimRunning(false);
      }, 2600);
      simTimersRef.current.push(t1, t2, t3);
    }
  };

  const progressPct = Math.round(
    (completedIds.length / CURRICULUM_MODULES.length) * 100
  );

  return (
    <div className="relative z-10 min-h-[100svh] pt-[74px]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[70vw] max-w-[860px] h-[340px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,90,31,0.45) 0%, rgba(255,154,74,0.12) 55%, transparent 75%)',
        }}
      />

      {/* Consistent Top-Left Back Button (no enclosing rectangle box; no 1-4 cross-section tabs) */}
      <div className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-1 pb-2 flex flex-wrap items-center justify-between gap-3">
        <motion.button
          type="button"
          initial={{opacity: 0, x: -12, scale: 0.94}}
          animate={{opacity: 1, x: 0, scale: 1}}
          transition={{duration: 0.35, ease: EASE}}
          onClick={() => onSelectView('dashboard')}
          className="liquid-glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>Dashboardga qaytish</span>
        </motion.button>

        {STUDIO_ID_SET.has(activeSection) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {STUDIO_TABS.map((tab, tIdx) => {
              const active = activeSection === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  initial={{opacity: 0, y: -8, scale: 0.94}}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  transition={{duration: 0.32, delay: tIdx * 0.035, ease: EASE}}
                  onClick={() => onSelectView(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-mono cursor-pointer whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#FF5A1F] text-white shadow-[0_3px_10px_rgba(255,90,31,0.28)]'
                      : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* =================================================================== */}
        {/* 1-BO'LIM: Barcha Mavzular — Salom Dunyodan Django Saytgacha        */}
        {/* =================================================================== */}
        {activeSection === 'hammasi' && (
          <motion.div
            key="section-hammasi"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="paimon-enter-scope"
          >
            <section
              id="panel-hammasi"
              className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-6 pb-16"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">
                    1-BO‘LIM · SALOM DUNYODAN PROFESSIONAL BACKENDGACHA
                  </p>
                  <h2
                    className="mt-3 text-[clamp(28px,2.9vw,46px)] leading-[1.07] tracking-[-0.025em] text-[var(--ink)]"
                    style={{fontFamily: 'var(--serif)'}}
                  >
                    <code className="text-[0.82em] font-mono text-[#FF5A1F]">
                      print(&quot;Salom, Dunyo!&quot;)
                    </code>{' '}
                    dan <em className="italic">Django + Docker</em> servergacha.
                  </h2>
                  <p className="mt-2.5 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
                    Paimon Akademiyasining 1-bo‘limida 440 mavzu yo‘nalishi
                    12 ta modul va amaliy qo‘llanmalar xaritasi ko‘rinishida
                    jamlangan.
                  </p>
                </div>

                <div className="liquid-glass-pill px-4 py-2 rounded-full inline-flex items-center gap-3 self-start">
                  <span className="text-xs font-mono text-[var(--muted)]">
                    O‘zlashtirish:
                  </span>
                  <span className="text-xs font-mono font-medium tabular-nums text-[var(--ink)]">
                    {completedIds.length} / {CURRICULUM_MODULES.length} modul
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.1] overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{width: `${progressPct}%`}}
                      transition={{duration: 0.4, ease: EASE}}
                      className="h-full bg-[#FF5A1F] rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* 8-module navigation strip */}
              <div className="mt-8 flex flex-wrap gap-2">
                {CURRICULUM_MODULES.map((mod, idx) => {
                  const active = idx === activeModIdx;
                  const done = completedIds.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveModIdx(idx)}
                      className={`relative px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap ${
                        active
                          ? 'bg-[#FF5A1F] text-white shadow-[0_4px_14px_rgba(255,90,31,0.35)]'
                          : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span className="font-mono opacity-80">{mod.step}</span>
                      <span>
                        {mod.id === 'python-zero'
                          ? 'Python 0 dan'
                          : mod.id === 'http-json'
                            ? 'HTTP & JSON'
                            : mod.id === 'postgresql-orm'
                              ? 'PostgreSQL'
                              : mod.id === 'django-mvt'
                                ? 'Django & DRF'
                                : mod.id === 'auth-security'
                                  ? 'Auth & JWT'
                                  : mod.id === 'redis-cache'
                                    ? 'Redis Kesh'
                                    : mod.id === 'celery-workers'
                                      ? 'Celery & Beat'
                                      : 'Docker & Deploy'}
                      </span>
                      {done && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            active ? 'text-white' : 'text-[#FF5A1F]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Module Liquid Glass Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMod.id}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.28, ease: EASE}}
                  className="mt-6 liquid-glass rounded-[24px] p-5 md:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
                    <div>
                      <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--muted)]">
                        <span className="text-[#FF5A1F] font-medium">
                          MODUL {activeMod.step}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{activeMod.level}</span>
                      </div>
                      <h3
                        className="mt-2 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
                        style={{fontFamily: 'var(--serif)'}}
                      >
                        {activeMod.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--body)]">
                        {activeMod.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    <div className="lg:col-span-5 space-y-5">
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/20 border border-[var(--hairline)]">
                        <img
                          src={activeMod.image}
                          alt={activeMod.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-3.5 left-4 right-4 text-white">
                          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FFB06A]">
                            Hayotiy tasavvur
                          </p>
                          <p className="text-sm font-medium mt-0.5 leading-snug">
                            {activeMod.analogyTitle}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                        <p className="text-sm leading-[1.65] text-[var(--body)]">
                          {activeMod.analogyText}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--muted)] mb-3">
                          Asosiy tushunchalar
                        </p>
                        <ul className="space-y-2.5 m-0 p-0 list-none">
                          {activeMod.concepts.map((c) => (
                            <li
                              key={c}
                              className="flex items-start gap-2.5 text-sm text-[var(--body)] leading-relaxed"
                            >
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-5">
                      <div className="rounded-2xl border border-[var(--hairline)] bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--hairline)]">
                          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
                            <FileCode2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                            <span className="text-[var(--ink)]">
                              {activeMod.codeTitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleCopyModuleCode}
                              className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-[var(--ink)] cursor-pointer"
                            >
                              {copiedModuleCode ? (
                                <>
                                  <Check className="w-3 h-3 text-[#FF5A1F]" />
                                  <span>Nusxalandi</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Nusxalash</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={runModuleTerminal}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shadow-[0_2px_10px_rgba(255,90,31,0.3)]"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>
                                {isRunningCode
                                  ? 'Ko‘rsatilmoqda...'
                                  : 'Natijani ko‘rish'}
                              </span>
                            </button>
                          </div>
                        </div>
                        <pre className="m-0 p-4 overflow-x-auto text-[12.5px] leading-[1.6] font-mono text-[var(--ink)]">
                          {activeMod.code}
                        </pre>
                      </div>

                      <div className="rounded-2xl border border-[var(--hairline)] bg-[#0F1115] text-[#E6E9EE] p-4 font-mono text-xs">
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[11px] text-[#8B9098]">
                          <span className="inline-flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
                            <span>Simulyatsiya: kutilgan terminal natijasi</span>
                          </span>
                          <button
                            type="button"
                            onClick={runModuleTerminal}
                            className="inline-flex items-center gap-1 text-[#FFB06A] hover:text-white cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Qayta ishlatish</span>
                          </button>
                        </div>
                        <div className="space-y-1 min-h-[78px]">
                          {activeMod.terminalOutput
                            .slice(0, visibleTermLines)
                            .map((line, i) => (
                              <motion.div
                                key={`${activeMod.id}-line-${i}`}
                                initial={{opacity: 0, x: -4}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.18}}
                                className={
                                  i === 0
                                    ? 'text-[#FFB06A]'
                                    : line.includes('OK') ||
                                        line.includes('Salom') ||
                                        line.includes('succeeded')
                                      ? 'text-[#9FE6B8]'
                                      : 'text-[#D4D8DF]'
                                }
                              >
                                {line}
                              </motion.div>
                            ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#FF5A1F]">
                            Tezkor tekshiruv (Random variantlar)
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAnswer(null);
                              setQuizShuffleSeed((s) => s + 1);
                            }}
                            className="text-[11px] font-mono text-[var(--muted)] hover:text-[#FF5A1F] cursor-pointer"
                          >
                            Aralashtirish ↻
                          </button>
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-[var(--ink)]">
                          {activeMod.quizQuestion}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {shuffledModuleOptions.map((opt, oIdx) => {
                            const chosen = selectedAnswer === oIdx;
                            let btnStyle =
                              'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]';
                            if (selectedAnswer !== null) {
                              if (opt.isCorrect) {
                                btnStyle =
                                  'bg-emerald-600/90 text-white border border-emerald-500';
                              } else if (chosen) {
                                btnStyle =
                                  'bg-red-600/85 text-white border border-red-500';
                              }
                            }
                            return (
                              <button
                                key={`${activeMod.id}-${quizShuffleSeed}-${opt.text}`}
                                type="button"
                                onClick={() =>
                                  handleSelectQuiz(oIdx, opt.isCorrect)
                                }
                                className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all text-left ${btnStyle}`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                        {selectedAnswer !== null && (
                          <motion.p
                            initial={{opacity: 0, y: 4}}
                            animate={{opacity: 1, y: 0}}
                            className="mt-3 text-xs leading-relaxed text-[var(--body)]"
                          >
                            {activeMod.quizExplanation}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 16-chapter atlas covering 440 topic areas */}
              <SyllabusAtlasSection />

              {/* Section 1 Interactive Randomized Arena */}
              <InteractiveTestArena
                scope="hammasi"
                sectionId="hammasi-test"
                heading="1-bo‘lim sinovi: Umumiy Backend Arxitektura Testi"
                subtitle="Python, PostgreSQL, Django va DRF bo‘yicha random savollar, sayt xatolarini tuzatish va bajarilish tartibini yig‘ish."
              />
            </section>

            {/* Full Interview Flashcards Reference inside Section 1 */}
            <InterviewBankSection />
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 2-BO'LIM: Python Akademiyasi — 0 dan Ekspertgacha (150 Mavzu)      */}
        {/* =================================================================== */}
        {activeSection === 'python' && (
          <motion.section
            key="section-python"
            id="panel-python"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="relative paimon-enter-scope"
          >
            <div className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-6">
              <p className="eyebrow">
                2-BO‘LIM · PYTHON AKADEMIYASI (150 MAVZU)
              </p>
            </div>

            <PythonTypesLab />

            <div className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pb-16">
              <PythonDeepDive />
              <InteractiveTestArena
                scope="python"
                sectionId="python-test"
                heading="2-bo‘lim sinovi: Python Amaliy Testi va Bug Hunter"
                subtitle="Pulda Decimal xatolari, mutable default argument, GIL, Generator va deepcopy bo‘yicha random sinovlar."
              />
            </div>
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* 3-BO'LIM: Django & PostgreSQL + Celery + Sayt Arxitekturasi        */}
        {/* =================================================================== */}
        {activeSection === 'django' && (
          <motion.section
            key="section-django"
            id="panel-django"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-6 pb-16 paimon-enter-scope"
          >
            <p className="eyebrow">
              3-BO‘LIM · DJANGO (120) &amp; POSTGRESQL (90) + CELERY
            </p>
            <h2
              className="mt-3 text-[clamp(28px,2.85vw,45px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)] max-w-3xl"
              style={{fontFamily: 'var(--serif)'}}
            >
              PostgreSQL bazasi, <em className="italic">Django ORM</em>, Celery
              va shu Paimon saytining haqiqiy kodi.
            </h2>
            <p className="mt-2.5 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
              N+1 muammosini yo‘qotish, MVCC/VACUUM, B-tree/GIN/BRIN
              indekslari, Celery asinxron navbati va Paimon platformasining o‘z
              haqiqiy Django fayl tuzilmasini ko‘ring.
            </p>

            <PostgresDjangoLab />

            {/* Live Celery vs Blocking simulation */}
            <div id="celery-lab" className="mt-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
                    JONLI ARXITEKTURA SIMULYATORI
                  </p>
                  <h3
                    className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
                    style={{fontFamily: 'var(--serif)'}}
                  >
                    Nima uchun <em className="italic">Celery va Redis</em> har
                    bir Django saytga kerak?
                  </h3>
                </div>

                <div className="liquid-glass-pill inline-flex items-center p-1 rounded-full self-start relative">
                  {(
                    [
                      ['celery', 'Celery + Redis (14 ms)'],
                      ['sync', 'Celery-siz (4,200 ms)'],
                    ] as const
                  ).map(([m, label]) => {
                    const active = simMode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSimMode(m);
                          setSimStage(0);
                          setJobs([]);
                          setSimElapsedMs(0);
                          setSimUserStatus('Buyurtma yuborishga tayyor');
                        }}
                        className={`relative px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer z-10 whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-[#FF5A1F] text-white'
                            : 'text-[var(--body)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 liquid-glass rounded-[24px] p-5 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={simRunning}
                      onClick={triggerOrderSimulation}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 disabled:opacity-60 cursor-pointer shadow-[0_6px_20px_rgba(255,90,31,0.34)] transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {simRunning
                          ? 'So‘rov ketmoqda...'
                          : 'Buyurtma yuborish (POST /api/v1/orders/)'}
                      </span>
                    </button>
                    <span className="text-xs font-mono tabular-nums text-[var(--muted)]">
                      Javob vaqti:{' '}
                      <strong className="text-[var(--ink)]">
                        {simElapsedMs > 0 ? `${simElapsedMs} ms` : '—'}
                      </strong>
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[var(--ink)]">
                    {simUserStatus}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      stage: 1,
                      title: '1. Nginx (Darvozabon)',
                      sub: 'SSL tekshiruvi va so‘rovni Gunicorn’ga uzatish',
                      role: 'Reverse Proxy',
                    },
                    {
                      stage: 2,
                      title: '2. Django API View',
                      sub: 'Serializer tekshiruvi va JWT foydalanuvchini aniqlash',
                      role: 'Mantiq markazi',
                    },
                    {
                      stage: 3,
                      title: '3. PostgreSQL Baza',
                      sub: 'transaction.atomic() bilan yozish va COMMIT (4 ms)',
                      role: 'Doimiy ombor',
                    },
                    {
                      stage: 4,
                      title:
                        simMode === 'celery'
                          ? '4. Redis Broker → 201 OK'
                          : '4. Og‘ir kutish → 201 OK',
                      sub:
                        simMode === 'celery'
                          ? 'on_commit() vazifani navbatga tashladi, mijoz darhol javob oldi!'
                          : 'Email va PDF tugamaguncha mijoz sahifasi qotib turadi.',
                      role: simMode === 'celery' ? 'Asinxron navbat' : 'Bloklangan',
                    },
                  ].map((node) => {
                    const reached = simStage >= node.stage;
                    const current = simStage === node.stage;
                    return (
                      <motion.div
                        key={node.stage}
                        animate={{
                          borderColor: current
                            ? 'rgba(255,90,31,0.85)'
                            : reached
                              ? 'rgba(255,90,31,0.35)'
                              : undefined,
                          scale: current ? 1.015 : 1,
                        }}
                        transition={{duration: 0.25}}
                        className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.025] relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                          <span>{node.role}</span>
                          {reached && (
                            <span className="text-[#FF5A1F] font-medium">
                              {current ? 'Faol ●' : 'Tayyor ✓'}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-2 text-sm font-medium text-[var(--ink)]">
                          {node.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--body)]">
                          {node.sub}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {simMode === 'celery' && jobs.length > 0 && (
                    <motion.div
                      initial={{opacity: 0, height: 0}}
                      animate={{opacity: 1, height: 'auto'}}
                      exit={{opacity: 0, height: 0}}
                      transition={{duration: 0.3, ease: EASE}}
                      className="mt-6 pt-6 border-t border-[var(--hairline)]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--muted)] inline-flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" />
                          <span>
                            Celery Workerlar (Foydalanuvchi kutmasdan fonda
                            ishlamoqda)
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02]"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-[var(--muted)]">
                                Worker-{job.worker}
                              </span>
                              <span
                                className={`font-mono text-[11px] ${
                                  job.done ? 'text-emerald-500' : 'text-[#FF5A1F]'
                                }`}
                              >
                                {job.done ? 'Bajarildi ✓' : `${job.progress}%`}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-medium text-[var(--ink)]">
                              {job.label}
                            </p>
                            <div className="mt-2.5 h-1.5 rounded-full bg-black/[0.07] dark:bg-white/[0.09] overflow-hidden">
                              <motion.div
                                initial={{width: '10%'}}
                                animate={{width: `${job.progress}%`}}
                                transition={{duration: 0.45, ease: EASE}}
                                className={`h-full rounded-full ${
                                  job.done ? 'bg-emerald-500' : 'bg-[#FF5A1F]'
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Paimon Django Project Structure Explorer */}
            <div
              id="yol-xaritasi"
              className="mt-8 liquid-glass rounded-[24px] p-5 md:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] pb-2 border-b border-[var(--hairline)]">
                  <FolderOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>paimon_academy_django/</span>
                </div>
                {DJANGO_PROJECT_FILES.map((file, fIdx) => {
                  const active = fIdx === activeFileIdx;
                  return (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => setActiveFileIdx(fIdx)}
                      className={`text-left px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border ${
                        active
                          ? 'bg-[#FF5A1F] text-white border-transparent shadow-[0_4px_14px_rgba(255,90,31,0.3)]'
                          : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.02] text-[var(--ink)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <div className="text-xs font-mono font-medium">
                        {file.path}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          active ? 'text-white/85' : 'text-[var(--muted)]'
                        }`}
                      >
                        {file.role}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-8 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[var(--hairline)]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink)]">
                      <Server className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span className="font-medium">{activeFile.path}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Hayotiy vazifasi: {activeFile.analogy}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyFileCode}
                    className="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--ink)] cursor-pointer"
                  >
                    {copiedFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FF5A1F]" />
                        <span>Nusxalandi</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kodni nusxalash</span>
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeFile.path}
                    initial={{opacity: 0, y: 5}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -5}}
                    transition={{duration: 0.2, ease: EASE}}
                    className="mt-4 mb-0 p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.03] dark:bg-white/[0.03] overflow-x-auto text-[12.5px] leading-[1.6] font-mono text-[var(--ink)] flex-1"
                  >
                    {activeFile.code}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            <InteractiveTestArena
              scope="django"
              sectionId="django-test"
              heading="3-bo‘lim sinovi: Django & PostgreSQL Server Testi"
              subtitle="NULL tuzoqlari, transaction.on_commit(), AddIndexConcurrently migratsiya xatolari va SQL bajarilish tartibini sinang."
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* 4-BO'LIM: API Yozish (DRF) — Serializatsiya, JWT, Xavfsizlik       */}
        {/* =================================================================== */}
        {activeSection === 'api' && (
          <motion.section
            key="section-api"
            id="panel-api"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-6 pb-16 paimon-enter-scope"
          >
            <p className="eyebrow">
              4-BO‘LIM · API YOZISH (DRF · 80 MAVZU) &amp; XAVFSIZLIK
            </p>
            <h2
              className="mt-3 text-[clamp(28px,2.85vw,45px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)] max-w-3xl"
              style={{fontFamily: 'var(--serif)'}}
            >
              Professional <em className="italic">Django REST API</em>:
              validatsiya, JWT, IDOR himoyasi va jonli so‘rovlar.
            </h2>
            <p className="mt-2.5 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
              API yozishda eng muhim qoidalar: Mass Assignment dan saqlanish,
              3-bosqichli validatsiya, Access/Refresh JWT, ScopedRateThrottle,
              Idempotency-Key va drf-spectacular OpenAPI hujjatlashtirish.
            </p>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="liquid-glass rounded-[20px] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5A1F]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. Serializer 3-Bosqichli Himoya</span>
                </div>
                <h3 className="text-base font-medium text-[var(--ink)]">
                  fields=&quot;__all__&quot; dan qoching!
                </h3>
                <p className="text-xs leading-relaxed text-[var(--body)]">
                  Avval maydon turi, keyin <code>validate_&lt;field&gt;</code>,
                  so‘ng <code>validate(attrs)</code> ishlaydi.{' '}
                  <code>is_staff</code>, <code>user</code> va{' '}
                  <code>balance</code> maydonlarini doim <code>read_only</code>{' '}
                  qiling.
                </p>
              </div>

              <div className="liquid-glass rounded-[20px] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5A1F]">
                  <Layers className="w-4 h-4" />
                  <span>2. ViewSet vs APIView &amp; IDOR</span>
                </div>
                <h3 className="text-base font-medium text-[var(--ink)]">
                  401 vs 403 va get_queryset()
                </h3>
                <p className="text-xs leading-relaxed text-[var(--body)]">
                  401 — login yo‘q; 403 — ruxsat yo‘q. Birovning obyektini URL
                  orqali ko‘rib qo‘ymaslik (IDOR) uchun{' '}
                  <code>get_queryset()</code> ni <code>request.user</code> bilan
                  filtrlang.
                </p>
              </div>

              <div className="liquid-glass rounded-[20px] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5A1F]">
                  <Activity className="w-4 h-4" />
                  <span>3. Production API Standarti</span>
                </div>
                <h3 className="text-base font-medium text-[var(--ink)]">
                  CursorPagination &amp; Idempotency
                </h3>
                <p className="text-xs leading-relaxed text-[var(--body)]">
                  Katta ro‘yxatlarda <code>CursorPagination</code>, to‘lov
                  POST’larida <code>Idempotency-Key</code>, og‘ir PDF/Exportlarda
                  esa <code>202 Accepted</code> + Celery ishlating.
                </p>
              </div>
            </div>

            {/* Live Paimon DRF API Endpoint Simulator */}
            <div
              id="api-lab"
              className="mt-7 liquid-glass rounded-[24px] p-5 md:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink)]">
                  <Activity className="w-4 h-4 text-[#FF5A1F]" />
                  <span className="font-medium">
                    Paimon Akademiya — Jonli Django DRF Endpoint Simulyatori
                  </span>
                </div>
                <button
                  type="button"
                  onClick={runEndpointSimulation}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>So‘rov yuborish (Run View)</span>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {DJANGO_API_ENDPOINTS.map((ep, idx) => {
                  const isSel = idx === activeEndpointIdx;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setActiveEndpointIdx(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-all inline-flex items-center gap-2 ${
                        isSel
                          ? 'bg-[#FF5A1F] text-white'
                          : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          isSel
                            ? 'text-white'
                            : ep.method === 'POST'
                              ? 'text-[#FF5A1F]'
                              : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span>{ep.path}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-6 space-y-3">
                  <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-[var(--ink)] font-medium">
                        {activeEndpoint.viewName}
                      </span>
                      <span className="text-[#FF5A1F]">
                        {activeEndpoint.cacheStatus}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--body)]">
                      {activeEndpoint.summaryUz}
                    </p>
                  </div>

                  {activeEndpoint.requestBody && (
                    <div className="rounded-xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.03] p-3">
                      <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--muted)] mb-1.5">
                        Request JSON Body
                      </p>
                      <pre className="m-0 font-mono text-[11.5px] text-[var(--ink)] overflow-x-auto">
                        {activeEndpoint.requestBody}
                      </pre>
                    </div>
                  )}

                  <div className="rounded-xl border border-[var(--hairline)] bg-[#0F1115] text-[#D8DEE9] p-3.5">
                    <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#FFB06A] mb-2">
                      Django Request → Middleware → ORM zanjiri (#
                      {endpointRunCount + 1})
                    </p>
                    <div className="space-y-1.5 font-mono text-[11.5px]">
                      {activeEndpoint.middlewareTrace
                        .slice(0, visibleTraceSteps)
                        .map((step, sIdx) => (
                          <motion.div
                            key={`${activeEndpoint.id}-${endpointRunCount}-${sIdx}`}
                            initial={{opacity: 0, x: -4}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.16}}
                            className="flex items-start gap-2"
                          >
                            <span className="text-[#9FE6B8]">✓</span>
                            <span>{step}</span>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-2xl border border-[var(--hairline)] bg-[#0F1115] text-[#E6E9EE] overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-white/10 text-[11px] font-mono">
                    <span className="text-[#9FE6B8] font-medium">
                      HTTP {activeEndpoint.statusText}
                    </span>
                    <div className="flex items-center gap-3 text-[#8B9098]">
                      <span>{activeEndpoint.sqlCount}</span>
                      <span>·</span>
                      <span className="text-[#FFB06A]">
                        {activeEndpoint.latencyMs} ms
                      </span>
                    </div>
                  </div>
                  <pre className="m-0 p-4 font-mono text-[12px] leading-[1.55] text-[#D8DEE9] overflow-x-auto">
                    {activeEndpoint.responseJson}
                  </pre>
                </div>
              </div>
            </div>

            <InteractiveTestArena
              scope="api"
              sectionId="api-test"
              heading="4-bo‘lim sinovi: DRF API Xavfsizlik va Validatsiya Testi"
              subtitle="Mass Assignment (fields='__all__'), IDOR himoyasi, JWT, CursorPagination va validatsiya tartibi bo‘yicha random sinovlar."
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* PAIMON 2.0 STUDIO 1: Universal 12-Step Lesson Engine                */}
        {/* =================================================================== */}
        {activeSection === 'lessons' && (
          <motion.section
            key="section-lessons"
            id="panel-lessons"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 paimon-enter-scope"
          >
            <LessonEngine
              completedLessons={academyState.completedLessons}
              onCompleteLesson={onCompleteLesson}
              onJumpToVisualLab={(labId) => {
                onSelectVisualLab(labId);
                onSelectView('visuals');
              }}
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* PAIMON 2.0 STUDIO 2: 5 Interactive Visual Learning Labs             */}
        {/* =================================================================== */}
        {activeSection === 'visuals' && (
          <motion.section
            key="section-visuals"
            id="panel-visuals"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 paimon-enter-scope"
          >
            <InteractiveVisualLabs
              key={activeVisualLab}
              initialLab={activeVisualLab}
            />
          </motion.section>
        )}

        {/* =================================================================== */}
              {/* PAIMON 2.0 STUDIO 3: 3-Column Guided Coding Workspace */}
        {/* =================================================================== */}
        {activeSection === 'workspace' && (
          <motion.section
            key="section-workspace"
            id="panel-workspace"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 paimon-enter-scope"
          >
            <GuidedCodingWorkspace
              solvedExercises={academyState.solvedExercises}
              onSolveExercise={onSolveExercise}
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* PAIMON 2.0 STUDIO 4: 6 Real Projects + Kanban Studio                */}
        {/* =================================================================== */}
        {activeSection === 'projects' && (
          <motion.section
            key="section-projects"
            id="panel-projects"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 paimon-enter-scope"
          >
            <ProjectStudioSection
              completedProjectTasks={academyState.completedProjectTasks}
              onCompleteProjectTask={onCompleteProjectTask}
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* PAIMON 2.0 STUDIO 5: Debugging, Code Review & Production Lab        */}
        {/* =================================================================== */}
        {activeSection === 'academy' && (
          <motion.section
            key="section-academy"
            id="panel-academy"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 paimon-enter-scope"
          >
            <AcademyLabsSection
              solvedBugs={academyState.solvedBugs}
              completedReviews={academyState.completedReviews}
              solvedIncidents={academyState.solvedIncidents}
              onSolveBug={onSolveBug}
              onCompleteReview={onCompleteReview}
              onSolveIncident={onSolveIncident}
            />
          </motion.section>
        )}

        {/* =================================================================== */}
        {/* PAIMON 2.0 STUDIO 6: Interactive Roadmap, Profile & 9 Achievements  */}
        {/* =================================================================== */}
        {activeSection === 'roadmap' && (
          <motion.section
            key="section-roadmap"
            id="panel-roadmap"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.28, ease: EASE}}
            className="paimon-enter-scope"
          >
            <RoadmapAndProfileSection
              academyState={academyState}
              completedModulesCount={completedIds.length}
              totalModulesCount={CURRICULUM_MODULES.length}
              onJumpToView={(target) => onSelectView(target)}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Quiet Paimon Footer (No cross-section jumping inside sections; use top navbar) */}
      <footer className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] py-10 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--muted)]">
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

        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => onSelectView('dashboard')}
            className="hover:text-[var(--ink)] cursor-pointer transition-colors"
          >
            Dashboard
          </button>
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
