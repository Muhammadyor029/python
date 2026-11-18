import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {BookOpen, Check, Code2, Layers, Lightbulb} from 'lucide-react';
import {AtlasDomainId, SYLLABUS_ATLAS} from '../data/syllabusAtlas';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SyllabusAtlasSection() {
  const [activeDomainId, setActiveDomainId] = useState<AtlasDomainId>('python');
  const [expandedChapter, setExpandedChapter] = useState<string>('#01–25');
  const [masteredRanges, setMasteredRanges] = useState<string[]>([]);

  const domain =
    SYLLABUS_ATLAS.find((d) => d.id === activeDomainId) ?? SYLLABUS_ATLAS[0];

  const handleSelectDomain = (id: AtlasDomainId) => {
    setActiveDomainId(id);
    const target = SYLLABUS_ATLAS.find((d) => d.id === id);
    if (target?.chapters[0]) {
      setExpandedChapter(target.chapters[0].range);
    }
  };

  const toggleMastered = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredRanges((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="mt-10 liquid-glass rounded-[24px] p-5 md:p-8 border border-[var(--glass-border)]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
              16 BOB · 440 MAVZU YO‘NALISHI · BACKEND XARITASI
          </p>
          <h3
            className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Python (150), PostgreSQL (90), Django (120) va DRF (80) —{' '}
            <em className="italic">yagona tartibli atlas</em>
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] max-w-2xl">
            Yuborilgan barcha qo‘llanmalardagi har bir mavzu 0-darajadan
            Ekspertgacha tizimli boblarga ajratildi. Istalgan sohani ochib,
            hayotiy o‘xshatish va kod namunasini o‘qing.
          </p>
        </div>

        <div className="liquid-glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 self-start text-xs font-mono text-[var(--ink)]">
          <BookOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span className="tabular-nums">
            {masteredRanges.length} / 16 bob o‘rganildi
          </span>
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {SYLLABUS_ATLAS.map((d) => {
          const active = d.id === activeDomainId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelectDomain(d.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium cursor-pointer transition-all whitespace-nowrap ${
                active
                  ? 'bg-[#FF5A1F] text-white shadow-[0_4px_14px_rgba(255,90,31,0.3)]'
                  : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
              }`}
            >
              {d.badge}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={domain.id}
          initial={{opacity: 0, y: 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -6}}
          transition={{duration: 0.22, ease: EASE}}
          className="mt-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h4 className="text-base md:text-lg font-medium text-[var(--ink)]">
                {domain.title}
              </h4>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {domain.subtitle}
              </p>
            </div>
            <span className="text-xs font-mono text-[#FF5A1F] shrink-0">
              Jami {domain.totalQuestions} ta savol-mavzu
            </span>
          </div>

          <div className="space-y-3">
            {domain.chapters.map((ch) => {
              const key = `${domain.id}:${ch.range}`;
              const isOpen = expandedChapter === ch.range;
              const isMastered = masteredRanges.includes(key);

              return (
                <div
                  key={key}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? 'border-[#FF5A1F]/45 bg-black/[0.025] dark:bg-white/[0.03]'
                      : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.015]'
                  }`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setExpandedChapter(isOpen ? '' : ch.range)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedChapter(isOpen ? '' : ch.range);
                      }
                    }}
                    className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-[#FF5A1F] font-semibold">
                          {ch.range}
                        </span>
                        <span className="text-[var(--muted)]">·</span>
                        <span className="text-[var(--muted)]">{ch.level}</span>
                      </div>
                      <h5 className="text-sm md:text-base font-medium text-[var(--ink)]">
                        {ch.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => toggleMastered(key, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono cursor-pointer transition-colors ${
                          isMastered
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/35'
                            : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{isMastered ? 'O‘rganildi' : 'Belgilash'}</span>
                      </button>
                      <span className="text-xs font-mono text-[var(--muted)]">
                        {isOpen ? 'Yopish −' : 'Ochish +'}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.22, ease: EASE}}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-5 pb-5 pt-3 border-t border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                          <div className="lg:col-span-6 space-y-3">
                            <p className="text-xs md:text-[13px] leading-relaxed text-[var(--body)]">
                              {ch.summary}
                            </p>

                            <div className="p-3 rounded-xl bg-[#FF5A1F]/[0.07] border border-[#FF5A1F]/20 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                              <p className="text-xs text-[var(--ink)] leading-relaxed">
                                <strong>Hayotiy tasavvur: </strong>
                                {ch.analogy}
                              </p>
                            </div>

                            <ul className="space-y-1.5 m-0 p-0 list-none">
                              {ch.keyTakeaways.map((pt) => (
                                <li
                                  key={pt}
                                  className="flex items-start gap-2 text-xs text-[var(--body)] leading-relaxed"
                                >
                                  <Layers className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="lg:col-span-6 rounded-xl bg-[#0F1115] border border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 border-b border-white/10 flex items-center gap-2 text-[11px] font-mono text-[#8B9098]">
                              <Code2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                              <span>Amaliy kod namunasi ({ch.range})</span>
                            </div>
                            <pre className="m-0 p-3.5 font-mono text-[11.5px] leading-[1.6] text-[#D8DEE9] overflow-x-auto">
                              {ch.codeSnippet}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
