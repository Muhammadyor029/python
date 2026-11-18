import React, {useCallback, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Bug,
  CheckCircle2,
  ListOrdered,
  RotateCcw,
  Shuffle,
  Terminal,
  Wrench,
  XCircle,
} from 'lucide-react';
import {
  BUG_HUNTER_CHALLENGES,
  BugHunterChallenge,
  ChallengeScope,
  RANDOM_QUIZ_BANK,
  RandomQuizQuestion,
  SEQUENCE_CHALLENGES,
  SequenceChallenge,
  shuffleArray,
} from '../data/challenges';

type ArenaMode = 'quiz' | 'bug' | 'sequence';

interface ShuffledQuizItem {
  raw: RandomQuizQuestion;
  shuffledOptions: {text: string; isCorrect: boolean}[];
}

interface ShuffledBugItem {
  raw: BugHunterChallenge;
  shuffledChoices: BugHunterChallenge['fixChoices'];
}

interface ShuffledSeqItem {
  raw: SequenceChallenge;
  shuffledSteps: string[];
}

interface InteractiveTestArenaProps {
  scope: ChallengeScope;
  sectionId?: string;
  heading: string;
  subtitle: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function InteractiveTestArena({
  scope,
  sectionId,
  heading,
  subtitle,
}: InteractiveTestArenaProps) {
  const [mode, setMode] = useState<ArenaMode>('quiz');
  const [roundSeed, setRoundSeed] = useState(0);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0);

  // Bug Hunter state
  const [bugIdx, setBugIdx] = useState(0);
  const [clickedLine, setClickedLine] = useState<number | null>(null);
  const [selectedFixIdx, setSelectedFixIdx] = useState<number | null>(null);

  // Sequence Builder state
  const [seqIdx, setSeqIdx] = useState(0);
  const [pickedSteps, setPickedSteps] = useState<string[]>([]);
  const [seqChecked, setSeqChecked] = useState(false);

  const quizRound: ShuffledQuizItem[] = useMemo(() => {
    const pool =
      scope === 'hammasi'
        ? RANDOM_QUIZ_BANK
        : RANDOM_QUIZ_BANK.filter((q) => q.scope === scope);
    const chosen = shuffleArray(pool).slice(0, Math.min(5, pool.length));
    return chosen.map((q) => ({
      raw: q,
      shuffledOptions: shuffleArray(
        q.options.map((text, idx) => ({
          text,
          isCorrect: idx === q.correctIndex,
        }))
      ),
    }));
    // roundSeed deliberately forces fresh Fisher-Yates shuffle
  }, [scope, roundSeed]);

  const bugRound: ShuffledBugItem[] = useMemo(() => {
    const pool =
      scope === 'hammasi'
        ? BUG_HUNTER_CHALLENGES
        : BUG_HUNTER_CHALLENGES.filter((b) => b.scope === scope);
    return shuffleArray(pool).map((b) => ({
      raw: b,
      shuffledChoices: shuffleArray(b.fixChoices),
    }));
  }, [scope, roundSeed]);

  const seqRound: ShuffledSeqItem[] = useMemo(() => {
    const pool =
      scope === 'hammasi'
        ? SEQUENCE_CHALLENGES
        : SEQUENCE_CHALLENGES.filter((s) => s.scope === scope);
    return shuffleArray(pool).map((s) => ({
      raw: s,
      shuffledSteps: shuffleArray(s.stepsInOrder),
    }));
  }, [scope, roundSeed]);

  const regenerateRandomRound = useCallback(() => {
    setRoundSeed((s) => s + 1);
    setQuizIdx(0);
    setSelectedOptIdx(null);
    setQuizCorrectCount(0);
    setQuizAnsweredCount(0);
    setBugIdx(0);
    setClickedLine(null);
    setSelectedFixIdx(null);
    setSeqIdx(0);
    setPickedSteps([]);
    setSeqChecked(false);
  }, []);

  const currentQuiz = quizRound[quizIdx % quizRound.length];
  const currentBug = bugRound[bugIdx % bugRound.length];
  const currentSeq = seqRound[seqIdx % seqRound.length];

  const handleChooseQuiz = (idx: number) => {
    if (selectedOptIdx !== null || !currentQuiz) return;
    setSelectedOptIdx(idx);
    setQuizAnsweredCount((c) => c + 1);
    if (currentQuiz.shuffledOptions[idx]?.isCorrect) {
      setQuizCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOptIdx(null);
    if (quizIdx + 1 < quizRound.length) {
      setQuizIdx((i) => i + 1);
    } else {
      // Auto reshuffle a fresh round!
      regenerateRandomRound();
    }
  };

  const handlePickStep = (step: string) => {
    if (seqChecked) return;
    if (pickedSteps.includes(step)) {
      setPickedSteps((prev) => prev.filter((s) => s !== step));
    } else {
      setPickedSteps((prev) => [...prev, step]);
    }
  };

  const isBugFixed =
    selectedFixIdx !== null &&
    currentBug?.shuffledChoices[selectedFixIdx]?.isCorrect;

  const isSeqAllPicked =
    currentSeq && pickedSteps.length === currentSeq.raw.stepsInOrder.length;
  const isSeqPerfect =
    seqChecked &&
    currentSeq &&
    pickedSteps.every((s, idx) => s === currentSeq.raw.stepsInOrder[idx]);

  return (
    <div
      id={sectionId}
      className="mt-10 liquid-glass rounded-[24px] p-5 md:p-7 border border-[var(--glass-border)]"
    >
      {/* Top Header + Mode Switcher + Reshuffle Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
            HAR DOIM RANDOM VARIANTLAR · AMALIY TEST MAYDONI
          </p>
          <h3
            className="mt-1 text-xl md:text-2xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            {heading}
          </h3>
          <p className="mt-1 text-xs md:text-sm text-[var(--body)]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <div className="liquid-glass-pill inline-flex flex-wrap max-w-full items-center p-1 rounded-full">
            {(
              [
                ['quiz', 'Random Test', Shuffle],
                ['bug', 'Saytdagi Xatoni Top', Bug],
                ['sequence', 'Tartibni Yig‘ish', ListOrdered],
              ] as const
            ).map(([key, label, Icon]) => {
              const active = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#FF5A1F] text-white shadow-[0_3px_10px_rgba(255,90,31,0.3)]'
                      : 'text-[var(--body)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={regenerateRandomRound}
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium text-[var(--ink)] hover:border-[#FF5A1F] cursor-pointer whitespace-nowrap"
            title="Savollar va variantlarni qayta aralashtirish"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Yangi random variant</span>
          </button>
        </div>
      </div>

      {/* MODE 1: RANDOM QUIZ (Shuffled Questions + Shuffled Options) */}
      <AnimatePresence mode="wait">
        {mode === 'quiz' && currentQuiz && (
          <motion.div
            key={`quiz-${currentQuiz.raw.id}-${roundSeed}`}
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--muted)]">
              <span>
                {currentQuiz.raw.topicTag} · Savol {quizIdx + 1} /{' '}
                {quizRound.length}
              </span>
              <span className="tabular-nums text-[var(--ink)]">
                Natija: <strong className="text-[#FF5A1F]">{quizCorrectCount}</strong>{' '}
                / {quizAnsweredCount} to‘g‘ri
              </span>
            </div>

            <p className="text-sm md:text-[15px] font-medium text-[var(--ink)] leading-relaxed">
              {currentQuiz.raw.prompt}
            </p>

            {currentQuiz.raw.codeContext && (
              <pre className="m-0 p-3.5 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs overflow-x-auto border border-white/10">
                {currentQuiz.raw.codeContext}
              </pre>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuiz.shuffledOptions.map((opt, idx) => {
                const chosen = selectedOptIdx === idx;
                const answered = selectedOptIdx !== null;
                let cls =
                  'border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] text-[var(--ink)] hover:border-[#FF5A1F]/60';
                if (answered) {
                  if (opt.isCorrect) {
                    cls =
                      'border-emerald-500 bg-emerald-500/15 text-[var(--ink)]';
                  } else if (chosen) {
                    cls = 'border-red-500 bg-red-500/15 text-[var(--ink)]';
                  } else {
                    cls = 'border-[var(--hairline)] opacity-60 text-[var(--muted)]';
                  }
                }
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={`${currentQuiz.raw.id}-opt-${idx}-${opt.text}`}
                    type="button"
                    onClick={() => handleChooseQuiz(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs md:text-[13px] leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${cls}`}
                  >
                    <span className="font-mono font-semibold text-[#FF5A1F] shrink-0">
                      {letter}.
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {answered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {answered && chosen && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOptIdx !== null && (
              <motion.div
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                className="p-4 rounded-xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs leading-relaxed text-[var(--body)]">
                    <strong className="text-[var(--ink)]">Izoh: </strong>
                    {currentQuiz.raw.explanation}
                  </p>
                  {quizIdx + 1 >= quizRound.length && (
                    <p className="text-xs font-mono text-[#FF5A1F]">
                      Raund yakunlandi: {quizCorrectCount} / {quizRound.length} ta to‘g‘ri! Yangi random savollar to‘plamini boshlang.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleNextQuiz}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shrink-0 self-start sm:self-center"
                >
                  <span>
                    {quizIdx + 1 < quizRound.length
                      ? 'Keyingi savol'
                      : 'Yangi random to‘plam'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* MODE 2: MINI-SITE BUG HUNTER (Interactive Traceback + Line Inspector + Random Fix Choices) */}
        {mode === 'bug' && currentBug && (
          <motion.div
            key={`bug-${currentBug.raw.id}-${roundSeed}`}
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          >
            {/* Left: Broken Mini-Site Terminal & Clickable Line-Numbered Code */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-mono text-[var(--ink)]">
                  Loyiha: <strong>{currentBug.raw.siteName}</strong> ·{' '}
                  <span className="text-[var(--muted)]">
                    {currentBug.raw.endpointOrFile}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full ${
                    isBugFixed
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }`}
                >
                  {isBugFixed ? '200 OK · TUZATILDI' : '500 · XATO BOR'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0F1115] border border-white/10 font-mono text-[11.5px]">
                <div className="flex items-center gap-1.5 text-[#FFB06A] mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Server xatosi (Traceback / Alert):</span>
                </div>
                <div
                  className={
                    isBugFixed ? 'text-[#9FE6B8]' : 'text-red-400'
                  }
                >
                  {isBugFixed
                    ? `$ curl -i ${currentBug.raw.endpointOrFile} -> HTTP 200 OK (Xato bartaraf etildi!)`
                    : currentBug.raw.symptomError}
                </div>
              </div>

              <div className="rounded-xl bg-[#0F1115] border border-white/10 overflow-hidden">
                <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8B9098]">
                  <span>1-qadam: Xato qatorni bosing</span>
                  <span>
                    {clickedLine === currentBug.raw.bugLineNumber
                      ? `${clickedLine}-qator topildi ✓`
                      : clickedLine !== null
                        ? `${clickedLine}-qator toza, yana qarang`
                        : 'Qator tanlang'}
                  </span>
                </div>
                <div className="p-2.5 font-mono text-xs space-y-1 overflow-x-auto">
                  {currentBug.raw.codeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isBugLine = lineNum === currentBug.raw.bugLineNumber;
                    const isClicked = clickedLine === lineNum;
                    return (
                      <button
                        key={lineNum}
                        type="button"
                        onClick={() => setClickedLine(lineNum)}
                        className={`w-full text-left px-2.5 py-1 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                          isClicked && isBugLine
                            ? 'bg-amber-500/20 text-[#FFD9B5]'
                            : isClicked
                              ? 'bg-white/10 text-white'
                              : isBugFixed && isBugLine
                                ? 'bg-emerald-500/15 text-[#9FE6B8]'
                                : 'text-[#D8DEE9] hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="text-[#6B7280] select-none w-4 shrink-0 text-right">
                          {lineNum}
                        </span>
                        <span className="whitespace-pre">
                          {isBugFixed && isBugLine
                            ? currentBug.raw.fixedLinePreview
                            : line || ' '}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Diagnosis & Randomized Production Fixes */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                <p className="text-xs font-mono text-[#FF5A1F] mb-1">
                  Vaziyat ({bugIdx + 1} / {bugRound.length})
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-[var(--body)]">
                  {currentBug.raw.scenario}
                </p>
              </div>

              <p className="text-xs font-mono text-[var(--muted)] inline-flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>2-qadam: Serverni tuzatish uchun to‘g‘ri yechimni tanlang (random tartib):</span>
              </p>

              <div className="space-y-2.5">
                {currentBug.shuffledChoices.map((choice, cIdx) => {
                  const chosen = selectedFixIdx === cIdx;
                  const answered = selectedFixIdx !== null;
                  let style =
                    'border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] text-[var(--ink)] hover:border-[#FF5A1F]';
                  if (answered) {
                    if (choice.isCorrect) {
                      style = 'border-emerald-500 bg-emerald-500/15 text-[var(--ink)]';
                    } else if (chosen) {
                      style = 'border-red-500 bg-red-500/15 text-[var(--ink)]';
                    }
                  }
                  return (
                    <button
                      key={`${currentBug.raw.id}-${roundSeed}-fix-${cIdx}`}
                      type="button"
                      onClick={() => setSelectedFixIdx(cIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all flex items-start gap-2.5 ${style}`}
                    >
                      <span className="font-mono text-[#FF5A1F] font-semibold">
                        #{cIdx + 1}
                      </span>
                      <span className="flex-1">{choice.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedFixIdx !== null && (
                <motion.div
                  initial={{opacity: 0, y: 4}}
                  animate={{opacity: 1, y: 0}}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isBugFixed
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-[var(--ink)]'
                      : 'border-amber-500/40 bg-amber-500/10 text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isBugFixed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span>
                      {currentBug.shuffledChoices[selectedFixIdx]?.feedback}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setClickedLine(null);
                      setSelectedFixIdx(null);
                      setBugIdx((i) => (i + 1) % bugRound.length);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#FF5A1F] text-white text-xs font-medium cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    Keyingi mini-sayt →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* MODE 3: SEQUENCE / ARCHITECTURE BUILDER */}
        {mode === 'sequence' && currentSeq && (
          <motion.div
            key={`seq-${currentSeq.raw.id}-${roundSeed}`}
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm md:text-base font-medium text-[var(--ink)]">
                  {currentSeq.raw.title}
                </h4>
                <p className="text-xs text-[var(--body)] mt-0.5">
                  {currentSeq.raw.description}
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                Topshiriq {seqIdx + 1} / {seqRound.length}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Shuffled pool */}
              <div className="p-4 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[var(--muted)]">
                  Aralash bosqichlar (Tartib bilan bosing)
                </p>
                {currentSeq.shuffledSteps.map((step) => {
                  const orderIdx = pickedSteps.indexOf(step);
                  const picked = orderIdx !== -1;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handlePickStep(step)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        picked
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/12 text-[var(--ink)]'
                          : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.02] text-[var(--body)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span>{step}</span>
                      {picked && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF5A1F] text-white text-[10px]">
                          #{orderIdx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Assembled pipeline */}
              <div className="p-4 rounded-xl border border-[var(--hairline)] bg-[#0F1115] text-[#D8DEE9] space-y-2.5 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#FFB06A] mb-2">
                    Siz yig‘gan arxitektura zanjiri
                  </p>
                  {pickedSteps.length === 0 ? (
                    <p className="text-xs font-mono text-[#8B9098] py-6 text-center">
                      Chap tomondan 1-bosqichni tanlab boshlang...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pickedSteps.map((step, idx) => {
                        const exactMatch =
                          currentSeq.raw.stepsInOrder[idx] === step;
                        return (
                          <div
                            key={step}
                            className={`p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between gap-2 ${
                              seqChecked
                                ? exactMatch
                                  ? 'border-emerald-500/60 bg-emerald-500/15 text-[#9FE6B8]'
                                  : 'border-red-500/60 bg-red-500/15 text-red-300'
                                : 'border-white/10 bg-white/[0.04]'
                            }`}
                          >
                            <span>
                              {idx + 1}. {step}
                            </span>
                            {seqChecked &&
                              (exactMatch ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPickedSteps([]);
                      setSeqChecked(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8B9098] hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tozalash</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!isSeqAllPicked}
                      onClick={() => setSeqChecked(true)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FF5A1F] text-white text-xs font-medium disabled:opacity-40 cursor-pointer"
                    >
                      Tartibni tekshirish
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPickedSteps([]);
                        setSeqChecked(false);
                        setSeqIdx((i) => (i + 1) % seqRound.length);
                      }}
                      className="px-3 py-1.5 rounded-full border border-white/20 text-white text-xs cursor-pointer hover:bg-white/10"
                    >
                      Keyingisi →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {seqChecked && (
              <motion.div
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isSeqPerfect
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-[var(--ink)]'
                    : 'border-amber-500/40 bg-amber-500/10 text-[var(--ink)]'
                }`}
              >
                <strong>
                  {isSeqPerfect
                    ? 'Ajoyib! Zanjir 100% to‘g‘ri yig‘ildi. '
                    : 'Ayrim bosqichlar o‘rni almashgan. '}
                </strong>
                {currentSeq.raw.explanation}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
