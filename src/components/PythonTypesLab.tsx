import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  AlertTriangle,
  Box,
  Check,
  Copy,
  Lock,
  Minus,
  Plus,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {PYTHON_TYPES, PythonTypeLesson} from '../data/pythonTypes';

const EASE = [0.22, 1, 0.36, 1] as const;

export function PythonTypesLab() {
  const [selectedId, setSelectedId] = useState<PythonTypeLesson['id']>('int');
  const [copied, setCopied] = useState(false);

  // Interactive sandbox states for memorable hands-on learning
  const [intVal, setIntVal] = useState<number>(20);
  const [strInput, setStrInput] = useState<string>('Amir');
  const [boolActive, setBoolActive] = useState<boolean>(true);
  const [listItems, setListItems] = useState<string[]>([
    'non',
    'choy',
    'shakar',
  ]);
  const [tupleLockedShake, setTupleLockedShake] = useState(false);
  const [dictKey, setDictKey] = useState<'ism' | 'daraja' | 'telefon'>('ism');
  const [setItems, setSetItems] = useState<string[]>([
    'python',
    'django',
    'redis',
  ]);
  const [setAttemptNote, setSetAttemptNote] = useState<string>(
    'Bir xil element qo‘shib ko‘ring — dublikat o‘tib ketmaydi!'
  );
  const [noneMode, setNoneMode] = useState<'none' | 'zero' | 'empty'>('none');

  const active =
    PYTHON_TYPES.find((t) => t.id === selectedId) ?? PYTHON_TYPES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.sampleCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleTrySetAdd = (tag: string) => {
    if (setItems.includes(tag)) {
      setSetAttemptNote(
        `"${tag}" allaqachon to‘plamda bor — set dublikatni avtomatik rad etdi!`
      );
    } else {
      setSetItems((prev) => [...prev, tag]);
      setSetAttemptNote(`"${tag}" yangi unikal element sifatida qo‘shildi.`);
    }
  };

  const dictData: Record<string, string> = {
    ism: '"Dilshod"',
    daraja: '"Junior Backend"',
  };

  return (
    <motion.section
      id="turlar"
      initial={{opacity: 0, y: 14}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, ease: EASE}}
      className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-5 pb-14"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="eyebrow">0-BOSQICH · ENG ODDIY TURLARDAN BOSHLAYMIZ</p>
          <h2
            className="mt-3 text-[clamp(28px,2.85vw,45px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Hatto oddiy{' '}
            <code className="font-mono text-[0.84em] text-[#FF5A1F]">int</code>{' '}
            va <em className="italic">barcha ma’lumot turlari</em> yodda
            qoladigan qilib.
          </h2>
          <p className="mt-2.5 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
            Dasturlashga birinchi marta kirgan odam ham darhol tushunishi uchun
            har bir turni hayotiy narsaga o‘xshatdik. Pastdagi istalgan turni
            tanlang va tugmalar bilan o‘ynab sinab ko‘ring.
          </p>
        </div>

        <div className="liquid-glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 self-start text-xs font-mono text-[var(--body)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>10 ta asosiy tur · Jonli laboratoriya</span>
        </div>
      </div>

      {/* Type selector pills */}
      <div className="mt-7 flex flex-wrap gap-2">
        {PYTHON_TYPES.map((t) => {
          const isSel = t.id === selectedId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`relative px-3.5 py-2 rounded-full text-xs font-mono font-medium cursor-pointer transition-colors whitespace-nowrap ${
                isSel
                  ? 'text-white'
                  : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
              }`}
            >
              {isSel && (
                <motion.span
                  layoutId="python-type-pill"
                  transition={{type: 'spring', stiffness: 430, damping: 34}}
                  className="absolute inset-0 rounded-full bg-[#FF5A1F] shadow-[0_4px_14px_rgba(255,90,31,0.35)]"
                />
              )}
              <span className="relative z-10">{t.keyword}</span>
            </button>
          );
        })}
      </div>

      {/* Active Type Liquid Glass Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          transition={{duration: 0.25, ease: EASE}}
          className="mt-6 liquid-glass rounded-[24px] p-5 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start"
        >
          {/* Left column: Analogy + Golden Rule + Backend usage */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] font-medium">
                {active.category}
              </span>
              <span className="text-[var(--muted)]">{active.typeOutput}</span>
            </div>

            <h3
              className="text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              <code className="font-mono text-[0.82em] text-[#FF5A1F] mr-2">
                {active.keyword}
              </code>
              — {active.titleUz}
            </h3>

            {/* Visual Analogy Card */}
            <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.025] dark:bg-white/[0.03]">
              <p className="text-[11px] font-mono uppercase tracking-[0.07em] text-[#FF5A1F] mb-1.5">
                Hayotiy o‘xshatish: {active.analogyTitle}
              </p>
              <p className="text-sm leading-[1.65] text-[var(--body)]">
                {active.analogyDesc}
              </p>
            </div>

            {/* Golden Memory Rule */}
            <div className="p-4 rounded-2xl border border-[#FF5A1F]/25 bg-[#FF5A1F]/[0.06]">
              <p className="text-[11px] font-mono uppercase tracking-[0.07em] text-[#FF5A1F] mb-1">
                Yodda saqlash qoidasi
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-[var(--ink)] font-medium">
                {active.goldenRule}
              </p>
            </div>

            <div className="text-xs text-[var(--muted)] pt-1">
              <span className="font-mono uppercase tracking-[0.05em] text-[var(--ink)]">
                Django / PostgreSQL’da qayerda ishlatiladi:{' '}
              </span>
              <span>{active.backendUse}</span>
            </div>
          </div>

          {/* Right column: Interactive Visual Playground + Code Sample */}
          <div className="lg:col-span-7 space-y-5">
            {/* Interactive Toy / Animation Box */}
            <div className="p-5 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--hairline)]">
                <span className="text-[11px] font-mono uppercase tracking-[0.07em] text-[var(--muted)] inline-flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Jonli tasavvur qutisi ({active.keyword})</span>
                </span>
                <span className="text-[11px] font-mono text-[#FF5A1F]">
                  Bosib sinab ko‘ring
                </span>
              </div>

              {active.id === 'int' && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIntVal((v) => v - 1)}
                      className="w-9 h-9 rounded-full liquid-glass-pill inline-flex items-center justify-center cursor-pointer text-[var(--ink)]"
                      aria-label="1 ayrish"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <motion.div
                      key={intVal}
                      initial={{scale: 0.9, opacity: 0.6}}
                      animate={{scale: 1, opacity: 1}}
                      className="px-5 py-2.5 rounded-xl bg-[#0F1115] text-white font-mono text-xl font-semibold tabular-nums border border-white/10"
                    >
                      {intVal}
                    </motion.div>
                    <button
                      type="button"
                      onClick={() => setIntVal((v) => v + 1)}
                      className="w-9 h-9 rounded-full bg-[#FF5A1F] text-white inline-flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(255,90,31,0.35)]"
                      aria-label="1 qo‘shish"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-[var(--body)]">
                    <div>
                      yosh = <strong className="text-[#FF5A1F]">{intVal}</strong>
                    </div>
                    <div>
                      type(yosh) →{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">
                        &lt;class &apos;int&apos;&gt;
                      </span>
                    </div>
                    <div>
                      SQL turi: <span className="text-[var(--ink)]">BIGINT</span>
                    </div>
                  </div>
                </div>
              )}

              {(active.id === 'float' || active.id === 'decimal') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>float (ikkilik xotira)</span>
                    </div>
                    <div className="mt-2 font-mono text-xs text-[var(--body)]">
                      0.1 + 0.2 =
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold text-amber-600 dark:text-amber-300">
                      0.30000000000000004
                    </div>
                    <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                      Harorat va masofa uchun zo‘r, lekin pulda tiyin adashadi!
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-500/35 bg-emerald-500/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Decimal (Bank aniqligi)</span>
                    </div>
                    <div className="mt-2 font-mono text-xs text-[var(--body)]">
                      Decimal(&quot;0.10&quot;) + Decimal(&quot;0.20&quot;) =
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      0.30
                    </div>
                    <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                      Django’da har doim narx va balans uchun DecimalField!
                    </p>
                  </div>
                </div>
              )}

              {active.id === 'str' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-mono text-[var(--muted)]">
                      ism =
                    </label>
                    <input
                      type="text"
                      value={strInput}
                      maxLength={14}
                      placeholder="Ism yozing..."
                      onChange={(e) => setStrInput(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--hairline)] bg-[var(--bg)] text-sm font-mono text-[var(--ink)] outline-none focus:border-[#FF5A1F]"
                    />
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      len(ism) = {strInput.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                    {strInput.length === 0 ? (
                      <span className="text-xs font-mono text-[var(--muted)] self-center">
                        &quot;&quot; (bo‘sh satr, len = 0 — False)
                      </span>
                    ) : (
                      strInput.split('').map((ch, idx) => (
                        <div
                          key={`${idx}-${ch}`}
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--hairline)] bg-black/[0.03] dark:bg-white/[0.04] text-center font-mono"
                        >
                          <div className="text-sm font-semibold text-[var(--ink)]">
                            {ch === ' ' ? '␣' : ch}
                          </div>
                          <div className="text-[10px] text-[#FF5A1F]">
                            [{idx}]
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="font-mono text-xs text-[var(--body)] flex flex-wrap gap-4">
                    <span>
                      ism.upper() →{' '}
                      <strong className="text-[var(--ink)]">
                        &quot;{strInput.toUpperCase()}&quot;
                      </strong>
                    </span>
                    <span>
                      ism[::-1] →{' '}
                      <strong className="text-[#FF5A1F]">
                        &quot;{strInput.split('').reverse().join('')}&quot;
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {active.id === 'bool' && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setBoolActive((b) => !b)}
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-mono font-medium cursor-pointer transition-all ${
                      boolActive
                        ? 'bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]'
                        : 'liquid-glass-pill text-[var(--body)]'
                    }`}
                  >
                    {boolActive ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    <span>tolangan = {boolActive ? 'True' : 'False'}</span>
                  </button>
                  <div className="font-mono text-xs text-[var(--body)]">
                    if tolangan:{' '}
                    <strong
                      className={
                        boolActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-500'
                      }
                    >
                      {boolActive
                        ? '"Darslar ochildi!"'
                        : '"Avval obuna faollashtiring"'}
                    </strong>
                  </div>
                </div>
              )}

              {active.id === 'list' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {listItems.map((item, idx) => (
                      <motion.span
                        key={`${item}-${idx}`}
                        layout
                        className="px-3 py-1 rounded-lg bg-[#FF5A1F]/12 border border-[#FF5A1F]/30 font-mono text-xs text-[var(--ink)]"
                      >
                        [{idx}] &quot;{item}&quot;
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setListItems((prev) =>
                          prev.length < 6 ? [...prev, 'asal'] : prev
                        )
                      }
                      className="px-3 py-1.5 rounded-full bg-[#FF5A1F] text-white text-xs font-mono cursor-pointer"
                    >
                      .append(&quot;asal&quot;)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setListItems((prev) =>
                          prev.length > 1 ? prev.slice(0, -1) : prev
                        )
                      }
                      className="px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-mono text-[var(--ink)] cursor-pointer"
                    >
                      .pop()
                    </button>
                  </div>
                </div>
              )}

              {active.id === 'tuple' && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <motion.div
                    animate={
                      tupleLockedShake ? {x: [-5, 5, -4, 4, 0]} : {x: 0}
                    }
                    transition={{duration: 0.35}}
                    className="px-4 py-2.5 rounded-xl border border-[var(--hairline)] bg-[#0F1115] text-white font-mono text-xs inline-flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#FFB06A]" />
                    <span>toshkent = (41.2995, 69.2401)</span>
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => {
                      setTupleLockedShake(true);
                      setTimeout(() => setTupleLockedShake(false), 450);
                    }}
                    className="px-3.5 py-2 rounded-full liquid-glass-pill text-xs font-mono text-[var(--ink)] cursor-pointer"
                  >
                    toshkent[0] = 99 (Sinab ko‘rish)
                  </button>
                  {tupleLockedShake && (
                    <p className="w-full text-xs font-mono text-red-500">
                      TypeError: &apos;tuple&apos; object does not support item
                      assignment — muhrlangan!
                    </p>
                  )}
                </div>
              )}

              {active.id === 'dict' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(['ism', 'daraja', 'telefon'] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setDictKey(k)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                          dictKey === k
                            ? 'bg-[#FF5A1F] text-white'
                            : 'liquid-glass-pill text-[var(--body)]'
                        }`}
                      >
                        talaba.get(&quot;{k}&quot;, &quot;Yo‘q&quot;)
                      </button>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] text-white font-mono text-xs">
                    Natija:{' '}
                    <span className="text-[#9FE6B8]">
                      {dictData[dictKey] ??
                        '"Yo‘q" (KeyError bermadi, chunki .get() ishlatdik!)'}
                    </span>
                  </div>
                </div>
              )}

              {active.id === 'set' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {setItems.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-mono text-xs text-emerald-700 dark:text-emerald-300"
                      >
                        &quot;{tag}&quot;
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['python', 'celery', 'docker'].map((candidate) => (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => handleTrySetAdd(candidate)}
                        className="px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-mono text-[var(--ink)] cursor-pointer"
                      >
                        teglar.add(&quot;{candidate}&quot;)
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-[var(--muted)]">
                    {setAttemptNote}
                  </p>
                </div>
              )}

              {active.id === 'none' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['none', 'chegirma = None'],
                        ['zero', 'chegirma = 0'],
                        ['empty', 'chegirma = ""'],
                      ] as const
                    ).map(([m, label]) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setNoneMode(m)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                          noneMode === m
                            ? 'bg-[#FF5A1F] text-white'
                            : 'liquid-glass-pill text-[var(--body)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F1115] text-xs font-mono text-[#D4D8DF]">
                    {noneMode === 'none'
                      ? 'chegirma is None -> True! (Stul bo‘sh, SQL: IS NULL)'
                      : noneMode === 'zero'
                        ? '0 is None -> False! 0 bu aniq raqam, None emas.'
                        : '"" is None -> False! Bo‘sh matn ham baribir str obyekti.'}
                  </div>
                </div>
              )}
            </div>

            {/* Code Box */}
            <div className="rounded-2xl border border-[var(--hairline)] bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--hairline)]">
                <span className="text-xs font-mono text-[var(--muted)]">
                  tur_{active.id}.py
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="liquid-glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-[var(--ink)] cursor-pointer"
                >
                  {copied ? (
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
              </div>
              <pre className="m-0 p-4 overflow-x-auto text-[12.5px] leading-[1.6] font-mono text-[var(--ink)]">
                {active.sampleCode}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
