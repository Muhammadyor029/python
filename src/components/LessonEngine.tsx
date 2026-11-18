import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Eye,
  FlaskConical,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Terminal,
} from 'lucide-react';
import {DEEP_LESSONS, DeepLesson, LessonDomain} from '../data/lessonsEngine';
import {executeRealPython, PythonExecResult} from '../data/academyApi';

interface LessonEngineProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
  onJumpToVisualLab?: (visualLabId: DeepLesson['visualLabId']) => void;
  initialDomain?: LessonDomain | 'all';
}

const EASE = [0.22, 1, 0.36, 1] as const;

const DOMAIN_TABS: {id: LessonDomain | 'all'; label: string}[] = [
  {id: 'all', label: 'Barcha Darslar'},
  {id: 'python', label: 'Python Core'},
  {id: 'django', label: 'Django'},
  {id: 'orm', label: 'Django ORM'},
  {id: 'api', label: 'DRF API'},
  {id: 'postgres', label: 'PostgreSQL'},
];

export function LessonEngine({
  completedLessons,
  onCompleteLesson,
  onJumpToVisualLab,
  initialDomain = 'all',
}: LessonEngineProps) {
  const [domainFilter, setDomainFilter] = useState<LessonDomain | 'all'>(
    initialDomain
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    DEEP_LESSONS[0].id
  );
  const [codeLevelIdx, setCodeLevelIdx] = useState<number>(0);

  // Live Experiment Editor state
  const [expCode, setExpCode] = useState<string>(
    DEEP_LESSONS[0].experiment.starterCode
  );
  const [expResult, setExpResult] = useState<PythonExecResult | null>(null);
  const [expRunning, setExpRunning] = useState(false);

  // Knowledge Check state
  const [checkIdx, setCheckIdx] = useState<number | null>(null);

  const filteredLessons =
    domainFilter === 'all'
      ? DEEP_LESSONS
      : DEEP_LESSONS.filter((l) => l.domain === domainFilter);

  const lesson =
    filteredLessons.find((l) => l.id === selectedLessonId) ??
    filteredLessons[0] ??
    DEEP_LESSONS[0];

  useEffect(() => {
    setCodeLevelIdx(0);
    setExpCode(lesson.experiment.starterCode);
    setExpResult(null);
    setCheckIdx(null);
  }, [lesson.id, lesson.experiment.starterCode]);

  const handleRunExperiment = async () => {
    setExpRunning(true);
    const res = await executeRealPython(expCode);
    setExpResult(res);
    setExpRunning(false);
  };

  const activeExample =
    lesson.codeExamples[codeLevelIdx] ?? lesson.codeExamples[0];
  const isCompleted = completedLessons.includes(lesson.id);

  return (
    <div className="space-y-6">
      {/* Header + Domain Filter */}
      <div className="liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-[var(--hairline)]">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
              PAIMON 2.0 · 12-BOSQICHLI CHUQUR LESSON ENGINE
            </p>
            <h2
              className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              Har bir mavzu — <em className="italic">to‘liq muhandislik darsligi</em>
            </h2>
            <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] max-w-2xl">
              Muammo → Hayotiy analogiya → Ichki mexanizm → Vizualizatsiya → 5
              darajali kod → Python sandbox eksperimenti → Xatolar → Loyiha
              integratsiyasi.
            </p>
          </div>

          <div className="liquid-glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 self-start text-xs font-mono text-[var(--ink)]">
            <BookOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span className="tabular-nums">
              {completedLessons.length} / {DEEP_LESSONS.length} chuqur dars yakunlandi
            </span>
          </div>
        </div>

        {/* Domain Filter Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {DOMAIN_TABS.map((t) => {
            const active = domainFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setDomainFilter(t.id);
                  const first =
                    t.id === 'all'
                      ? DEEP_LESSONS[0]
                      : DEEP_LESSONS.find((l) => l.domain === t.id);
                  if (first) setSelectedLessonId(first.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#FF5A1F] text-white'
                    : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Lesson Selector Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLessons.map((item) => {
            const active = item.id === lesson.id;
            const done = completedLessons.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedLessonId(item.id)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  active
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/[0.08] shadow-[0_6px_18px_rgba(255,90,31,0.14)]'
                    : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.02] hover:border-[var(--muted)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-[#FF5A1F] uppercase">{item.domain}</span>
                  <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                    {done && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span>{item.difficulty}</span>
                  </span>
                </div>
                <div className="mt-1.5 text-sm font-medium text-[var(--ink)] leading-snug">
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active 12-Step Deep Lesson View */}
      <AnimatePresence mode="wait">
        <motion.article
          key={lesson.id}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          transition={{duration: 0.25, ease: EASE}}
          className="liquid-glass rounded-[24px] p-5 md:p-8 border border-[var(--glass-border)] space-y-8"
        >
          {/* Title & Official Docs Badge */}
          <div className="pb-5 border-b border-[var(--hairline)] flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] font-medium">
                  {lesson.difficulty}
                </span>
                <span className="text-[var(--muted)]">
                  Manba: {lesson.sourceReference}
                </span>
              </div>
              <h3
                className="mt-2.5 text-2xl md:text-4xl font-normal tracking-[-0.025em] text-[var(--ink)]"
                style={{fontFamily: 'var(--serif)'}}
              >
                {lesson.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--body)]">
                {lesson.subtitle}
              </p>
            </div>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>O‘zlashtirilgan</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onCompleteLesson(lesson.id)}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer shrink-0"
              >
                Darsni yakunlash (+30 XP)
              </button>
            )}
          </div>

          {/* 01. Introduction & 02. Real World Analogy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F]">
                01. Introduction — Muammo va Mohiyat
              </p>
              <p className="text-sm text-[var(--body)] leading-relaxed">
                <strong className="text-[var(--ink)]">Mavzu nima?</strong>{' '}
                {lesson.intro.whatIsIt}
              </p>
              <p className="text-sm text-[var(--body)] leading-relaxed">
                <strong className="text-[var(--ink)]">Nima uchun mavjud?</strong>{' '}
                {lesson.intro.whyExists}
              </p>
              <p className="text-sm text-[var(--body)] leading-relaxed">
                <strong className="text-[var(--ink)]">Hal qiladigan muammo:</strong>{' '}
                {lesson.intro.problemSolved}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[var(--muted)]">Oldingi bilimlar:</span>
                {lesson.intro.prerequisites.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] text-[var(--ink)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/[0.06] space-y-3 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>02. Real World Analogy</span>
                </p>
                <h4 className="mt-2 text-lg font-medium text-[var(--ink)]">
                  {lesson.analogy.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--body)]">
                  {lesson.analogy.story}
                </p>
              </div>
              <div className="pt-3 border-t border-[#FF5A1F]/20 text-xs text-[var(--muted)]">
                <strong className="text-[var(--ink)]">Qayerda ishlatiladi:</strong>{' '}
                {lesson.intro.whereUsed}
              </div>
            </div>
          </div>

          {/* 03. Deep Explanation */}
          <div className="p-5 md:p-6 rounded-2xl border border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.02] space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F]">
              03. Deep Explanation — Ichki Mexanizm va Arxitektura
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[var(--body)] leading-relaxed">
              <div>
                <p className="font-semibold text-[var(--ink)] mb-1">
                  Ichki mexanizmi
                </p>
                <p>{lesson.deepExplanation.internalMechanism}</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--ink)] mb-1">
                  Ishlash prinsipi
                </p>
                <p>{lesson.deepExplanation.workingPrinciple}</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--ink)] mb-1">
                  Arxitekturadagi o‘rni
                </p>
                <p>{lesson.deepExplanation.architectureRole}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-[var(--hairline)] text-xs leading-relaxed">
              <div>
                <p className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-1.5">
                  Afzalliklari
                </p>
                <ul className="space-y-1 m-0 pl-4 text-[var(--body)]">
                  {lesson.deepExplanation.pros.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-amber-600 dark:text-amber-400 font-semibold mb-1.5">
                  Kamchiliklari
                </p>
                <ul className="space-y-1 m-0 pl-4 text-[var(--body)]">
                  {lesson.deepExplanation.cons.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-red-500 font-semibold mb-1.5">
                  Cheklovlari
                </p>
                <ul className="space-y-1 m-0 pl-4 text-[var(--body)]">
                  {lesson.deepExplanation.limitations.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    Qachon ishlatiladi:{' '}
                  </span>
                  <span className="text-[var(--body)]">
                    {lesson.deepExplanation.whenToUse}
                  </span>
                </div>
                <div>
                  <span className="font-mono font-semibold text-red-500">
                    Qachon ishlatilmaydi:{' '}
                  </span>
                  <span className="text-[var(--body)]">
                    {lesson.deepExplanation.whenNotToUse}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 04. Animated Visualization Callout */}
          <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono text-[#FF5A1F]">
                  04. ANIMATED VISUALIZATION
                </p>
                <p className="text-sm text-[var(--ink)] mt-0.5">
                  {lesson.visualizationHint}
                </p>
              </div>
            </div>
            {onJumpToVisualLab && (
              <button
                type="button"
                onClick={() => onJumpToVisualLab(lesson.visualLabId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span>Vizual Labni ochish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 05. Code Examples (5 Levels + Line-by-line notes) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>05. Code Examples — Basic dan Real Projectgacha</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lesson.codeExamples.map((ex, idx) => (
                  <button
                    key={ex.level}
                    type="button"
                    onClick={() => setCodeLevelIdx(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                      idx === codeLevelIdx
                        ? 'bg-[#FF5A1F] text-white'
                        : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {ex.level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7 rounded-2xl bg-[#0F1115] border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-[#FFB06A]">
                  <span>
                    {activeExample.level} · {activeExample.title}
                  </span>
                </div>
                <pre className="m-0 p-4 text-xs leading-relaxed font-mono text-[#D8DEE9] overflow-x-auto">
                  {activeExample.code
                    .split('\n')
                    .map((line, idx) => `${String(idx + 1).padStart(2, ' ')} | ${line}`)
                    .join('\n')}
                </pre>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-2.5">
                <p className="text-xs font-mono text-[var(--muted)]">
                  Qatorma-qator muhandislik izohi:
                </p>
                {activeExample.lineNotes.map((ln, idx) => (
                  <div
                    key={`${ln.line}-${idx}`}
                    className="p-2.5 rounded-xl border border-[var(--hairline)] text-xs text-[var(--body)] leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-[#FF5A1F]/15 text-[#FF5A1F] font-mono font-semibold shrink-0">
                      L{ln.line}
                    </span>
                    <span>{ln.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 06. Live Interactive Experiment */}
          <div className="p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4" />
                  <span>06. Live Experiment — Kodni o‘zgartirib sinab ko‘ring</span>
                </p>
                <p className="mt-1 text-sm text-[var(--ink)]">
                  {lesson.experiment.prompt}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                {lesson.experiment.note}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-2.5">
                <textarea
                  value={expCode}
                  onChange={(e) => setExpCode(e.target.value)}
                  rows={9}
                  spellCheck={false}
                  className="w-full p-3.5 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed border border-white/15 outline-none focus:border-[#FF5A1F]"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={expRunning}
                    onClick={handleRunExperiment}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer hover:brightness-105 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {expRunning ? 'Bajarilmoqda...' : 'Sandboxda ishlatish'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExpCode(lesson.experiment.starterCode);
                      setExpResult(null);
                    }}
                    className="liquid-glass-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-[var(--body)] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Asliga qaytarish</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl bg-[#0F1115] border border-white/10 p-4 font-mono text-xs flex flex-col justify-between min-h-[210px]">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-[#8B9098]">
                    <span className="inline-flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>Terminal Natijasi</span>
                    </span>
                    {expResult && (
                      <span className="text-[#9FE6B8]">
                        {expResult.elapsedMs} ms · {expResult.executionMode}
                      </span>
                    )}
                  </div>
                  {expResult ? (
                    <div className="space-y-2">
                      {expResult.stdout && (
                        <pre className="m-0 text-[#9FE6B8] whitespace-pre-wrap">
                          {expResult.stdout}
                        </pre>
                      )}
                      {expResult.stderr && (
                        <pre className="m-0 text-red-400 whitespace-pre-wrap">
                          {expResult.stderr}
                        </pre>
                      )}
                      {!expResult.stdout && !expResult.stderr && (
                        <span className="text-[#8B9098]">
                          (Chiqish bo‘sh — print() qo‘shing)
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#8B9098] py-8 text-center">
                      Kodni tahrirlang va &quot;Sandboxda ishlatish&quot; tugmasini bosing.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 07. Common Mistakes & 08. Practical Tasks & 09. Real Project */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-red-500 inline-flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>07. Common Mistakes</span>
              </p>
              {lesson.commonMistakes.map((m) => (
                <div
                  key={m.mistake}
                  className="p-3 rounded-xl border border-[var(--hairline)] text-xs space-y-1"
                >
                  <code className="text-red-500 font-mono block">{m.mistake}</code>
                  <p className="text-[var(--body)]">{m.whyWrong}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Yechim: {m.fix}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>08. Practical Tasks</span>
              </p>
              <ul className="space-y-2.5 m-0 p-0 list-none text-xs text-[var(--body)] leading-relaxed">
                {lesson.practicalTasks.map((t, i) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="font-mono text-[#FF5A1F] font-semibold">
                      #{i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>09. Real Project Integration</span>
              </p>
              <p className="text-xs font-semibold text-[var(--ink)]">
                {lesson.realProjectIntegration.project}
              </p>
              <p className="text-xs text-[var(--body)] leading-relaxed">
                {lesson.realProjectIntegration.explanation}
              </p>
              <pre className="m-0 p-2.5 rounded-xl bg-[#0F1115] text-[#9FE6B8] font-mono text-[11px] overflow-x-auto">
                {lesson.realProjectIntegration.snippet}
              </pre>
            </div>
          </div>

          {/* 10. Knowledge Check, 11. Summary, 12. Next Step */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 border-t border-[var(--hairline)]">
            <div className="lg:col-span-6 p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F]">
                10. Knowledge Check
              </p>
              <p className="text-sm font-medium text-[var(--ink)]">
                {lesson.knowledgeCheck.question}
              </p>
              <div className="space-y-2">
                {lesson.knowledgeCheck.options.map((opt, idx) => {
                  const chosen = checkIdx === idx;
                  const right = idx === lesson.knowledgeCheck.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setCheckIdx(idx);
                        if (right) onCompleteLesson(lesson.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        checkIdx === null
                          ? 'border-[var(--hairline)] hover:border-[#FF5A1F] text-[var(--ink)]'
                          : right
                            ? 'border-emerald-500 bg-emerald-500/15 text-[var(--ink)]'
                            : chosen
                              ? 'border-red-500 bg-red-500/15 text-[var(--ink)]'
                              : 'border-[var(--hairline)] text-[var(--muted)]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checkIdx !== null && (
                <p className="text-xs text-[var(--body)] leading-relaxed">
                  {lesson.knowledgeCheck.explanation}
                </p>
              )}
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-2.5">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F]">
                11. Summary
              </p>
              <ul className="space-y-2 m-0 p-0 list-none text-xs text-[var(--body)] leading-relaxed">
                {lesson.summary.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl border border-[#FF5A1F]/25 bg-[#FF5A1F]/[0.05] space-y-2.5">
              <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>12. Next Step</span>
              </p>
              <p className="text-sm font-medium text-[var(--ink)]">
                {lesson.nextStep.nextTopicTitle}
              </p>
              <p className="text-xs text-[var(--body)] leading-relaxed">
                {lesson.nextStep.preparationTip}
              </p>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
