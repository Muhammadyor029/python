import React, {useEffect, useState} from 'react';
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Container,
  FileSearch,
  Play,
  Server,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import {
  CODE_REVIEW_CASES,
  DEBUG_SCENARIOS,
  PRODUCTION_INCIDENTS,
} from '../data/debuggingAndReview';
import {executeRealPython, PythonExecResult} from '../data/academyApi';

type AcademyTab = 'debugging' | 'code-review' | 'production';

interface AcademyLabsSectionProps {
  solvedBugs: string[];
  completedReviews: string[];
  solvedIncidents: string[];
  onSolveBug: (id: string) => void;
  onCompleteReview: (id: string) => void;
  onSolveIncident: (id: string) => void;
}

export function AcademyLabsSection({
  solvedBugs,
  completedReviews,
  solvedIncidents,
  onSolveBug,
  onCompleteReview,
  onSolveIncident,
}: AcademyLabsSectionProps) {
  const [tab, setTab] = useState<AcademyTab>('debugging');

  // 1. Debugging state
  const [bugIdx, setBugIdx] = useState(0);
  const scenario = DEBUG_SCENARIOS[bugIdx] ?? DEBUG_SCENARIOS[0];
  const [diagChoice, setDiagChoice] = useState<number | null>(null);
  const [fixCode, setFixCode] = useState(scenario.practiceTask.brokenCode);
  const [fixResult, setFixResult] = useState<PythonExecResult | null>(null);
  const [testingFix, setTestingFix] = useState(false);

  // 2. Code Review state
  const [crIdx, setCrIdx] = useState(0);
  const crCase = CODE_REVIEW_CASES[crIdx] ?? CODE_REVIEW_CASES[0];
  const [foundIssues, setFoundIssues] = useState<string[]>([]);
  const [crSubmitted, setCrSubmitted] = useState(false);

  // 3. Production & Incident Lab state
  const [incIdx, setIncIdx] = useState(0);
  const incident = PRODUCTION_INCIDENTS[incIdx] ?? PRODUCTION_INCIDENTS[0];
  const [revealedSteps, setRevealedSteps] = useState<string[]>([]);
  const [incFixIdx, setIncFixIdx] = useState<number | null>(null);
  const [prodSubTab, setProdSubTab] = useState<'incident' | 'docker' | 'server'>('incident');

  useEffect(() => {
    setDiagChoice(null);
    setFixCode(scenario.practiceTask.brokenCode);
    setFixResult(null);
    setTestingFix(false);
  }, [scenario]);

  useEffect(() => {
    setFoundIssues([]);
    setCrSubmitted(false);
  }, [crCase]);

  useEffect(() => {
    setRevealedSteps([]);
    setIncFixIdx(null);
  }, [incident]);

  const handleTestDebugFix = async () => {
    setTestingFix(true);
    const res = await executeRealPython(fixCode, scenario.practiceTask.testCode);
    setFixResult(res);
    setTestingFix(false);
    if (res.testPassed) {
      onSolveBug(scenario.id);
    }
  };

  const isDiagnosisCorrect =
    diagChoice !== null && scenario.diagnosticChoices[diagChoice]?.isCorrect;

  return (
    <div className="space-y-6">
      {/* Top Header + 3 Specialized Academy Tabs */}
      <div className="liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
              PAIMON 2.0 · MUHANDISLIK AKADEMIYALARI
            </p>
            <h2
              className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              Debugging, <em className="italic">Code Review</em> va Production Lab
            </h2>
            <p className="mt-1 text-xs md:text-sm text-[var(--body)] max-w-2xl">
              Tayyor javobni ko‘rishdan oldin stack trace orqali xatoni toping,
              PR kodidagi xavfsizlik/N+1 muammolarini aniqlang va sekinlashgan
              serverni tiklang.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['debugging', `Debugging (${solvedBugs.length}/${DEBUG_SCENARIOS.length})`, Bug],
                ['code-review', `Code Review (${completedReviews.length}/${CODE_REVIEW_CASES.length})`, FileSearch],
                ['production', `Production Lab (${solvedIncidents.length}/${PRODUCTION_INCIDENTS.length})`, Server],
              ] as const
            ).map(([k, lbl, Icon]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
                  tab === k
                    ? 'bg-[#FF5A1F] text-white shadow-[0_4px_14px_rgba(255,90,31,0.3)]'
                    : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lbl}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 1. REAL-WORLD DEBUGGING ACADEMY                                   */}
        {/* ================================================================= */}
        {tab === 'debugging' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {DEBUG_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setBugIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer inline-flex items-center gap-1.5 ${
                    idx === bugIdx
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  <span>{sc.domain}:</span>
                  <span>{sc.errorName}</span>
                  {solvedBugs.includes(sc.id) && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                  <p className="text-xs font-mono text-[#FF5A1F]">
                    {scenario.domain} · REAL SENARIY
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--ink)]">
                    {scenario.title}
                  </h3>
                  <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] leading-relaxed">
                    {scenario.realisticScenario}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#0F1115] border border-white/10 p-4 font-mono text-xs space-y-2">
                  <div className="text-red-400 font-semibold">
                    {scenario.errorMessage}
                  </div>
                  <pre className="m-0 text-[11px] text-[#D8DEE9] overflow-x-auto leading-relaxed">
                    {scenario.stackTrace}
                  </pre>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-mono text-[var(--muted)]">
                    1-qadam: Avval o‘zingiz diagnostika qiling (Root Cause nima?):
                  </p>
                  {scenario.diagnosticChoices.map((ch, idx) => {
                    const chosen = diagChoice === idx;
                    return (
                      <button
                        key={ch.label}
                        type="button"
                        onClick={() => setDiagChoice(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          diagChoice === null
                            ? 'border-[var(--hairline)] hover:border-[#FF5A1F] text-[var(--ink)]'
                            : ch.isCorrect
                              ? 'border-emerald-500 bg-emerald-500/15 text-[var(--ink)]'
                              : chosen
                                ? 'border-red-500 bg-red-500/15 text-[var(--ink)]'
                                : 'border-[var(--hairline)] text-[var(--muted)]'
                        }`}
                      >
                        {ch.label}
                      </button>
                    );
                  })}
                  {diagChoice !== null && (
                    <p className="text-xs text-[var(--body)] leading-relaxed">
                      {scenario.diagnosticChoices[diagChoice]?.hintFeedback}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side: Deep Root Cause (revealed after diagnosis) + Practice Fix */}
              <div className="lg:col-span-6 space-y-4">
                {diagChoice === null ? (
                  <div className="p-6 rounded-2xl border border-dashed border-[var(--hairline)] text-center text-xs text-[var(--muted)]">
                    Root Cause, Investigation va Prevention tavsiyalari avval
                    chap tomondan tashxis tanlaganingizdan keyin ochiladi.
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-2.5 text-xs">
                    <div>
                      <strong className="text-[#FF5A1F] font-mono">
                        ROOT CAUSE:
                      </strong>
                      <p className="text-[var(--body)] mt-0.5 leading-relaxed">
                        {scenario.rootCause}
                      </p>
                    </div>
                    <div>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                        ENG YAXSHI YECHIM:
                      </strong>
                      <p className="text-[var(--ink)] mt-0.5">
                        {scenario.bestSolution}
                      </p>
                    </div>
                    <div>
                      <strong className="text-[var(--muted)] font-mono">
                        OLDINI OLISH (PREVENTION):
                      </strong>
                      <p className="text-[var(--body)] mt-0.5">
                        {scenario.prevention}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl border border-[var(--hairline)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#FF5A1F]">
                      2-qadam: Buzilgan kodni tuzating (Python sandbox)
                    </span>
                    <button
                      type="button"
                      onClick={() => setFixCode(scenario.practiceTask.fixedCode)}
                      className="text-[var(--muted)] hover:text-[#FF5A1F] cursor-pointer"
                    >
                      To‘g‘ri yechimni qo‘yish
                    </button>
                  </div>
                  <textarea
                    value={fixCode}
                    onChange={(e) => setFixCode(e.target.value)}
                    rows={8}
                    spellCheck={false}
                    className="w-full p-3 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs border border-white/15 outline-none focus:border-[#FF5A1F]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={testingFix}
                      onClick={() => void handleTestDebugFix()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer disabled:opacity-60"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {testingFix
                          ? 'Tekshirilmoqda...'
                          : 'Tuzatishni tekshirish (+40 XP)'}
                      </span>
                    </button>
                    {fixResult && (
                      <span
                        className={`text-xs font-mono ${
                          fixResult.testPassed
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      >
                        {fixResult.testMessage || fixResult.stderr}
                      </span>
                    )}
                  </div>
                  {isDiagnosisCorrect && fixResult?.testPassed && (
                    <p className="text-xs text-emerald-500 font-mono">
                      Diagnostika va kod tuzatish 100% muvaffaqiyatli!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. CODE REVIEW ACADEMY                                            */}
        {/* ================================================================= */}
        {tab === 'code-review' && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {CODE_REVIEW_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCrIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    idx === crIdx
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 space-y-3">
                <p className="text-xs text-[var(--body)]">{crCase.prSummary}</p>
                <pre className="m-0 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed overflow-x-auto border border-white/10">
                  {crCase.badCode}
                </pre>
              </div>

              <div className="lg:col-span-6 space-y-3">
                <p className="text-xs font-mono text-[#FF5A1F]">
                  Ushbu PR’dagi barcha muammolarni belgilang:
                </p>
                <div className="space-y-2">
                  {crCase.expectedIssues.map((iss) => {
                    const checked = foundIssues.includes(iss.id);
                    return (
                      <button
                        key={iss.id}
                        type="button"
                        onClick={() =>
                          setFoundIssues((prev) =>
                            prev.includes(iss.id)
                              ? prev.filter((x) => x !== iss.id)
                              : [...prev, iss.id]
                          )
                        }
                        className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                          checked
                            ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[var(--ink)]'
                            : 'border-[var(--hairline)] text-[var(--body)]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-[#FF5A1F]">{iss.category}</span>
                          <span>{checked ? 'Belgilandi ✓' : 'Tanlash'}</span>
                        </div>
                        <div className="font-medium text-[var(--ink)]">
                          {iss.label}
                        </div>
                        {crSubmitted && (
                          <div className="text-[var(--body)] pt-1">
                            Sabab: {iss.reason}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCrSubmitted(true);
                    if (foundIssues.length === crCase.expectedIssues.length) {
                      onCompleteReview(crCase.id);
                    }
                  }}
                  className="px-5 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer"
                >
                  Reviewni tasdiqlash &amp; Toza kodni ko‘rish (+40 XP)
                </button>

                {crSubmitted && (
                  <div className="space-y-2 pt-2">
                    <p
                      className={`text-xs font-mono ${
                        foundIssues.length === crCase.expectedIssues.length
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {foundIssues.length === crCase.expectedIssues.length
                        ? `Barcha ${crCase.expectedIssues.length} ta muammo to‘g‘ri topildi (+40 XP)!`
                        : `Siz ${foundIssues.length}/${crCase.expectedIssues.length} ta muammoni belgiladingiz — XP olish uchun barcha muammolarni toping:`}
                    </p>
                    <p className="text-xs font-mono text-emerald-500">
                      Senior Refactoring (Toza Production Kodi):
                    </p>
                    <pre className="m-0 p-4 rounded-2xl bg-[#0F1115] text-[#9FE6B8] font-mono text-xs leading-relaxed overflow-x-auto border border-emerald-500/30">
                      {crCase.cleanCode}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. PRODUCTION SIMULATION LAB (INCIDENT + DOCKER + SERVER)         */}
        {/* ================================================================= */}
        {tab === 'production' && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['incident', 'Live Incident Simulation', ShieldAlert],
                  ['docker', 'Docker & Compose Lab', Container],
                  ['server', 'Nginx, Gunicorn & Health Checks', Activity],
                ] as const
              ).map(([k, lbl, Icon]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setProdSubTab(k)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer inline-flex items-center gap-1.5 ${
                    prodSubTab === k
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lbl}</span>
                </button>
              ))}
            </div>

            {prodSubTab === 'incident' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {PRODUCTION_INCIDENTS.map((inc, idx) => (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => setIncIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                        idx === incIdx
                          ? 'bg-[#FF5A1F] text-white'
                          : 'liquid-glass-pill text-[var(--body)]'
                      }`}
                    >
                      {inc.severity}: {inc.title}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-6 space-y-3">
                    <div className="p-4 rounded-2xl border border-red-500/35 bg-red-500/10 text-xs space-y-1.5">
                      <div className="font-mono text-red-500 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{incident.severity} ALERT</span>
                      </div>
                      <p className="text-[var(--ink)] font-medium text-sm">
                        {incident.symptom}
                      </p>
                    </div>

                    <p className="text-xs font-mono text-[var(--muted)]">
                      1-qadam: Server diagnostika buyruqlarini ishga tushiring:
                    </p>
                    {incident.steps.map((st) => {
                      const shown = revealedSteps.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          className="p-3.5 rounded-xl bg-[#0F1115] border border-white/10 font-mono text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[#FFB06A]">
                              $ {st.command}
                            </span>
                            {!shown && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedSteps((prev) => [...prev, st.id])
                                }
                                className="px-2.5 py-1 rounded bg-[#FF5A1F] text-white text-[11px] cursor-pointer"
                              >
                                Tekshirish
                              </button>
                            )}
                          </div>
                          {shown && (
                            <>
                              <div className="text-red-300">{st.output}</div>
                              <div className="text-[#9FE6B8] font-sans text-xs">
                                Topilgan iz: {st.clue}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <p className="text-xs font-mono text-[var(--muted)]">
                      2-qadam: To‘g‘ri production yechimini qo‘llang:
                    </p>
                    {incident.fixOptions.map((opt, idx) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setIncFixIdx(idx);
                          if (opt.isCorrect) onSolveIncident(incident.id);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border text-xs leading-relaxed cursor-pointer transition-all ${
                          incFixIdx === idx
                            ? opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-500/15 text-[var(--ink)]'
                              : 'border-red-500 bg-red-500/15 text-[var(--ink)]'
                            : 'border-[var(--hairline)] hover:border-[#FF5A1F] text-[var(--ink)]'
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                        {incFixIdx === idx && (
                          <div className="mt-2 font-mono text-[11px]">
                            Natijaviy javob vaqti: {opt.resultingMs} ms —{' '}
                            {opt.explanation}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {prodSubTab === 'docker' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono border border-white/10 space-y-2">
                  <div className="text-[#FFB06A]">Multi-stage Production Dockerfile</div>
                  <pre className="m-0 text-[11.5px] leading-relaxed overflow-x-auto">{`FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.12-slim
RUN useradd -m appuser
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
USER appuser
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]`}</pre>
                </div>
                <div className="p-4 rounded-2xl border border-[var(--hairline)] space-y-2 text-[var(--body)] leading-relaxed">
                  <p>
                    <strong className="text-[var(--ink)]">Volumes:</strong>{' '}
                    PostgreSQL ma’lumotlari (`pgdata:/var/lib/postgresql/data`)
                    konteyner o‘chirilganda yo‘qolmasligi uchun Named Volume shart.
                  </p>
                  <p>
                    <strong className="text-[var(--ink)]">Networks:</strong>{' '}
                    `django_web`, `postgres` va `redis` bitta ichki bridge tarmoqda
                    servis nomi bilan gaplashadi; faqat `nginx` 80/443 portni ochadi!
                  </p>
                </div>
              </div>
            )}

            {prodSubTab === 'server' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {[
                  {
                    t: 'Port Conflict & Process Control',
                    d: 'Bir portda 2 ta server tursa `Address already in use (Errno 98)` chiqadi. Systemd / Docker restart policy jarayonni avtomatik ko‘taradi.',
                  },
                  {
                    t: 'Static & Media Files',
                    d: 'DEBUG=False da Django statik fayllarni bermaydi! `python manage.py collectstatic` barcha CSS/JS ni `Nginx` yoki `WhiteNoise` ga yig‘adi.',
                  },
                  {
                    t: 'Health Checks (/healthz)',
                    d: 'Load Balancer konteyner tirikligini tekshirish uchun DB `SELECT 1` + Redis `PING` qaytaruvchi `/healthz` endpointini chaqiradi.',
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-1.5"
                  >
                    <div className="font-mono font-semibold text-[#FF5A1F] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{c.t}</span>
                    </div>
                    <p className="text-[var(--body)] leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
