import React, {useEffect, useState} from 'react';
import {
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  Terminal,
  XCircle,
  Eye,
} from 'lucide-react';
import {WORKSPACE_EXERCISES} from '../data/workspaceExercises';
import {executeRealPython, PythonExecResult} from '../data/academyApi';

interface GuidedCodingWorkspaceProps {
  solvedExercises: string[];
  onSolveExercise: (id: string) => void;
}

export function GuidedCodingWorkspace({
  solvedExercises,
  onSolveExercise,
}: GuidedCodingWorkspaceProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const exercise = WORKSPACE_EXERCISES[selectedIdx] ?? WORKSPACE_EXERCISES[0];

  const [code, setCode] = useState(exercise.starterCode);
  const [hintStep, setHintStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<PythonExecResult | null>(null);

  useEffect(() => {
    setCode(exercise.starterCode);
    setHintStep(0);
    setShowSolution(false);
    setSolutionRevealed(false);
    setResult(null);
  }, [exercise.id, exercise.starterCode]);

  const handleRun = async (withTests: boolean) => {
    setRunning(true);
    const res = await executeRealPython(
      code,
      withTests ? exercise.testCode : undefined
    );
    setResult(res);
    setRunning(false);
    if (withTests && res.testPassed && !solutionRevealed) {
      onSolveExercise(exercise.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.slice(0, start) + '    ' + code.slice(end);
      setCode(updated);
      window.requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const lineCount = Math.max(12, code.split('\n').length);

  return (
    <div className="liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)] space-y-5">
      {/* Header + Task Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
            PAIMON 2.0 · GUIDED CODING WORKSPACE (PYTHON &amp; SQLITE SANDBOX)
          </p>
          <h2
            className="mt-1 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Kodni o‘zingiz yozing, <em className="italic">real serverda</em> tekshiring
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {WORKSPACE_EXERCISES.map((ex, idx) => {
            const active = idx === selectedIdx;
            const solved = solvedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-[#FF5A1F] text-white'
                    : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                <span>#{idx + 1}</span>
                <span>{ex.track}</span>
                {solved && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      active ? 'text-white' : 'text-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column IDE Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT: Task Description, Requirements, Hints, Expected Behavior */}
        <div className="lg:col-span-4 p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-[#FF5A1F] font-semibold">
                {exercise.track}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {exercise.executionMode}
              </span>
            </div>

            <h3 className="text-base font-semibold text-[var(--ink)]">
              {exercise.title}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--body)]">
              {exercise.description}
            </p>

            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--muted)] mb-1.5">
                Talablar (Requirements):
              </p>
              <ul className="space-y-1.5 m-0 p-0 list-none text-xs text-[var(--body)]">
                {exercise.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.02] text-xs">
              <span className="font-mono text-[#FF5A1F] font-medium block mb-0.5">
                Kutilgan natija:
              </span>
              <span className="text-[var(--body)] font-mono text-[11px]">
                {exercise.expectedBehavior}
              </span>
            </div>

            {hintStep > 0 && (
              <div className="p-3 rounded-xl border border-amber-500/35 bg-amber-500/10 text-xs space-y-1.5">
                <p className="font-mono text-amber-600 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Maslahatlar:</span>
                </p>
                {exercise.hints.slice(0, hintStep).map((h) => (
                  <p key={h} className="text-[var(--ink)] leading-relaxed">
                    {h}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Code Editor with Line Numbers & Tab Auto-Indent */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1115] border border-white/10 overflow-hidden flex flex-col">
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-[#8B9098]">
            <span className="inline-flex items-center gap-1.5 text-[#D8DEE9]">
              <Code2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>workspace.py</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] hover:text-white cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#9FE6B8]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Nusxalandi' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode(exercise.starterCode);
                  setResult(null);
                  setShowSolution(false);
                }}
                className="inline-flex items-center gap-1 text-[11px] hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-[300px] font-mono text-xs leading-[1.6]">
            <div
              aria-hidden="true"
              className="py-3 px-2.5 select-none text-right text-[#525965] border-r border-white/10 bg-black/25"
            >
              {Array.from({length: lineCount}, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full p-3 bg-transparent text-[#E6E9EE] outline-none resize-none leading-[1.6] font-mono text-xs"
            />
          </div>
        </div>

        {/* RIGHT: Output, Test Results, Errors, Explanation */}
        <div className="lg:col-span-3 rounded-2xl bg-[#0F1115] border border-white/10 p-4 font-mono text-xs flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-[#8B9098]">
              <span className="inline-flex items-center gap-1.5 text-white">
                <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Natija &amp; Testlar</span>
              </span>
              {result && (
                <span className="text-[#FFB06A]">{result.elapsedMs} ms</span>
              )}
            </div>

            {!result ? (
              <p className="text-[#8B9098] py-6 leading-relaxed">
                Avval kodni o‘zgartiring. So‘ng pastdagi <strong>Run</strong>{' '}
                (chiqishni ko‘rish) yoki <strong>Submit</strong> (avtomatik
                testlardan o‘tkazish) tugmasini bosing.
              </p>
            ) : (
              <div className="space-y-3">
                {result.testPassed !== null && result.testPassed !== undefined && (
                  <div
                    className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                      result.testPassed
                        ? 'border-emerald-500/50 bg-emerald-500/15 text-[#9FE6B8]'
                        : 'border-red-500/50 bg-red-500/15 text-red-300'
                    }`}
                  >
                    {result.testPassed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{result.testMessage}</span>
                  </div>
                )}

                {result.stdout && (
                  <div>
                    <div className="text-[10px] text-[#8B9098] mb-1">STDOUT:</div>
                    <pre className="m-0 text-[#9FE6B8] whitespace-pre-wrap break-words">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {result.stderr && (
                  <div>
                    <div className="text-[10px] text-red-400 mb-1">ERROR:</div>
                    <pre className="m-0 text-red-300 whitespace-pre-wrap break-words">
                      {result.stderr}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {showSolution && (
              <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-[#D8DEE9] space-y-1.5">
                <div className="text-[11px] text-[#FFB06A]">
                  Izoh &amp; Yechim:
                </div>
                <p className="font-sans text-xs leading-relaxed text-[#E6E9EE]">
                  {exercise.explanation}
                </p>
                <p className="font-mono text-[10px] leading-relaxed text-[#FFB06A]">
                  Namunaviy yechim ko‘rildi — bu urinishda XP berilmaydi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={running}
            onClick={() => void handleRun(false)}
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Run</span>
          </button>

          <button
            type="button"
            disabled={running}
            onClick={() => void handleRun(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {running
                ? 'Tekshirilmoqda...'
                : solutionRevealed
                  ? 'Submit (XP berilmaydi)'
                  : 'Submit (Test +45 XP)'}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setHintStep((h) => Math.min(exercise.hints.length, h + 1))
            }
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Show Hint ({hintStep}/{exercise.hints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowSolution(true);
              setSolutionRevealed(true);
              setCode(exercise.solutionCode);
            }}
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Check Solution</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCode(exercise.starterCode);
              setResult(null);
              setShowSolution(false);
            }}
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
