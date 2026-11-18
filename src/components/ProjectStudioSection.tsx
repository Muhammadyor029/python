import React, {useEffect, useState} from 'react';
import {
  CheckCircle2,
  Database,
  FolderTree,
  Kanban,
  Lightbulb,
  Play,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import {
  BACKEND_PROJECTS,
  KanbanColumn,
  ProjectKanbanTask,
} from '../data/projectsStudio';
import {executeRealPython, PythonExecResult} from '../data/academyApi';

interface ProjectStudioSectionProps {
  completedProjectTasks: string[];
  onCompleteProjectTask: (taskId: string) => void;
}

const KANBAN_COLS: KanbanColumn[] = [
  'Backlog',
  'To Do',
  'In Progress',
  'Testing',
  'Completed',
];

export function ProjectStudioSection({
  completedProjectTasks,
  onCompleteProjectTask,
}: ProjectStudioSectionProps) {
  const [selectedProjIdx, setSelectedProjIdx] = useState(0);
  const project = BACKEND_PROJECTS[selectedProjIdx] ?? BACKEND_PROJECTS[0];

  const [taskColumns, setTaskColumns] = useState<Record<string, KanbanColumn>>(
    {}
  );
  const [activeTask, setActiveTask] = useState<ProjectKanbanTask>(
    project.tasks[0]
  );
  const [taskCode, setTaskCode] = useState(project.tasks[0].starterSnippet);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [verifyRes, setVerifyRes] = useState<PythonExecResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const first = project.tasks[0];
    setActiveTask(first);
    setTaskCode(first.starterSnippet);
    setShowHint(false);
    setShowSolution(false);
    setSolutionRevealed(false);
    setVerifyRes(null);
  }, [project]);

  const getColumn = (task: ProjectKanbanTask): KanbanColumn => {
    if (completedProjectTasks.includes(task.id)) return 'Completed';
    return taskColumns[task.id] ?? task.defaultColumn;
  };

  const handleMoveColumn = (taskId: string, col: KanbanColumn) => {
    setTaskColumns((prev) => ({...prev, [taskId]: col}));
  };

  const handleVerifyTask = async () => {
    setVerifying(true);
    handleMoveColumn(activeTask.id, 'Testing');
    const res = await executeRealPython(taskCode, activeTask.testCode);
    setVerifyRes(res);
    setVerifying(false);
    if (res.testPassed) {
      handleMoveColumn(activeTask.id, 'Completed');
      if (!solutionRevealed) {
        onCompleteProjectTask(activeTask.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <div className="liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
              PAIMON 2.0 · REAL PROJECT-BASED LEARNING &amp; KANBAN STUDIO
            </p>
            <h2
              className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              6 ta haqiqiy backend loyiha — <em className="italic">CLI dan SaaS gacha</em>
            </h2>
            <p className="mt-1 text-xs md:text-sm text-[var(--body)] max-w-2xl">
              Loyiha talablarini o‘qing, ER diagramma va fayl tuzilmasini
              o‘rganing, Kanban taxtasida vazifalarni olib mustaqil kod yozing
              va avtomatik tekshiruvdan o‘tkazing.
            </p>
          </div>
          <span className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-[var(--ink)] self-start">
            Bajarilgan vazifalar: {completedProjectTasks.length} /{' '}
            {BACKEND_PROJECTS.reduce((sum, p) => sum + p.tasks.length, 0)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BACKEND_PROJECTS.map((proj, idx) => {
            const active = idx === selectedProjIdx;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProjIdx(idx)}
                className={`text-left p-4 rounded-2xl border cursor-pointer transition-all ${
                  active
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/[0.08]'
                    : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.02] hover:border-[var(--muted)]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#FF5A1F] font-semibold">
                    {proj.number}
                  </span>
                  <span className="text-[var(--muted)]">{proj.level}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {proj.title}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {proj.stack.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.06] text-[10px] font-mono text-[var(--body)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Project Blueprint: Brief, Architecture, ER Diagram, Folder Structure */}
      <div className="liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <p className="text-xs font-mono text-[#FF5A1F]">
                {project.number} · {project.level}
              </p>
              <h3
                className="mt-1 text-2xl font-normal text-[var(--ink)]"
                style={{fontFamily: 'var(--serif)'}}
              >
                {project.title}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-[var(--body)] leading-relaxed">
                {project.brief}
              </p>
            </div>

            <div>
              <p className="text-xs font-mono text-[var(--muted)] mb-1.5">
                Biznes Talablar:
              </p>
              <ul className="space-y-1.5 m-0 p-0 list-none text-xs text-[var(--body)]">
                {project.businessRequirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] text-xs">
              <strong className="text-[#FF5A1F] font-mono block mb-1">
                Arxitektura Oqimi:
              </strong>
              <span className="font-mono text-[var(--ink)]">
                {project.architecture}
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-mono text-[#FF5A1F] inline-flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Database ER Diagrammasi</span>
            </p>
            {project.erEntities.map((ent) => (
              <div
                key={ent.table}
                className="p-3.5 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs border border-white/10 space-y-1.5"
              >
                <div className="text-[#FFB06A] font-semibold">{ent.table}</div>
                <div className="text-[11px] text-[#9FE6B8]">
                  {ent.columns.join(' · ')}
                </div>
                <div className="text-[11px] text-[#8B9098]">
                  {ent.relations.join(' | ')}
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02] text-xs">
              <p className="font-mono text-[var(--muted)] mb-1">Roadmap:</p>
              <div className="flex flex-wrap gap-1.5">
                {project.roadmapSteps.map((st) => (
                  <span
                    key={st}
                    className="px-2 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[11px]"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs font-mono text-[#FF5A1F] inline-flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Papka Tuzilmasi</span>
            </p>
            <pre className="m-0 p-3.5 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-[11.5px] leading-relaxed overflow-x-auto border border-white/10">
              {project.folderStructure}
            </pre>
          </div>
        </div>

        {/* Interactive Kanban Board */}
        <div className="pt-5 border-t border-[var(--hairline)] space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-[0.07em] text-[#FF5A1F] inline-flex items-center gap-1.5">
              <Kanban className="w-4 h-4" />
              <span>Loyiha Kanban Doskasi</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {KANBAN_COLS.map((col) => {
              const colTasks = project.tasks.filter(
                (t) => getColumn(t) === col
              );
              return (
                <div
                  key={col}
                  className="p-3 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02] space-y-2.5 min-h-[120px]"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold text-[var(--ink)]">
                      {col}
                    </span>
                    <span className="text-[var(--muted)]">
                      {colTasks.length}
                    </span>
                  </div>
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveTask(t);
                        setTaskCode(t.starterSnippet);
                        setShowHint(false);
                        setShowSolution(false);
                        setSolutionRevealed(false);
                        setVerifyRes(null);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveTask(t);
                          setTaskCode(t.starterSnippet);
                          setShowHint(false);
                          setShowSolution(false);
                          setVerifyRes(null);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        activeTask.id === t.id
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/10'
                          : 'border-[var(--hairline)] bg-[var(--bg)]'
                      }`}
                    >
                      <div className="font-medium text-[var(--ink)]">
                        {t.title}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
                        <span>{t.difficulty}</span>
                        {col !== 'Completed' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = Math.min(
                                KANBAN_COLS.length - 1,
                                KANBAN_COLS.indexOf(col) + 1
                              );
                              handleMoveColumn(t.id, KANBAN_COLS[nextIdx]);
                            }}
                            className="text-[#FF5A1F] hover:underline cursor-pointer"
                          >
                            Keyingi →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Kanban Task Implementation & Automated Verification */}
        {activeTask && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 border-t border-[var(--hairline)]">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-mono text-[#FF5A1F]">
                FAOL TOPSHIRIQ · MUSTAQIL BAJARING
              </p>
              <h4 className="text-lg font-medium text-[var(--ink)]">
                {activeTask.title}
              </h4>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                {activeTask.description}
              </p>

              <div className="space-y-1.5 text-xs">
                <p className="font-mono text-[var(--muted)]">
                  Qabul qilish mezonlari (Acceptance Criteria):
                </p>
                {activeTask.acceptanceCriteria.map((ac) => (
                  <div key={ac} className="flex items-start gap-2 text-[var(--body)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                    <span>{ac}</span>
                  </div>
                ))}
              </div>

              {showHint && (
                <div className="p-3 rounded-xl border border-amber-500/35 bg-amber-500/10 text-xs text-[var(--ink)]">
                  <strong>Hint: </strong>
                  {activeTask.hint}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--ink)] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hint</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSolution(true);
                    setSolutionRevealed(true);
                    setTaskCode(activeTask.solutionSnippet);
                  }}
                  className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--body)] cursor-pointer"
                >
                  Namunaviy yechim {showSolution ? '✓' : ''}
                </button>
              </div>
              {solutionRevealed && (
                <p className="text-[10px] font-mono text-amber-500">
                  Namunaviy yechim ko‘rildi — bu vazifa uchun XP berilmaydi.
                </p>
              )}
            </div>

            <div className="lg:col-span-7 space-y-3">
              <textarea
                value={taskCode}
                onChange={(e) => setTaskCode(e.target.value)}
                rows={9}
                spellCheck={false}
                className="w-full p-3.5 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed border border-white/15 outline-none focus:border-[#FF5A1F]"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => void handleVerifyTask()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {verifying
                      ? 'Avtomatik tekshirilmoqda...'
                      : solutionRevealed
                        ? 'Tekshirish (XP berilmaydi)'
                        : 'Tekshirish & Completed ga o‘tkazish (+50 XP)'}
                  </span>
                </button>
                {verifyRes && (
                  <span
                    className={`text-xs font-mono flex items-center gap-1.5 ${
                      verifyRes.testPassed ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>
                      {verifyRes.testMessage || verifyRes.stderr || 'Tekshirildi'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Code Review & Final Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--hairline)] text-xs">
          <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
            <p className="font-mono font-semibold text-[#FF5A1F] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Code Review Tekshiruv Ro‘yxati</span>
            </p>
            {project.codeReviewChecklist.map((c) => (
              <p key={c} className="text-[var(--body)]">
                • {c}
              </p>
            ))}
          </div>
          <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
            <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Yakuniy Baholash (Final Evaluation)</span>
            </p>
            {project.finalEvaluationCriteria.map((c) => (
              <p key={c} className="text-[var(--body)]">
                • {c}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
