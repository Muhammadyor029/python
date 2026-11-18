import React, {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Search,
} from 'lucide-react';
import {
  INTERVIEW_BANK,
  InterviewLevel,
  InterviewTopic,
} from '../data/interviewBank';

const EASE = [0.22, 1, 0.36, 1] as const;

export function InterviewBankSection() {
  const [topicFilter, setTopicFilter] = useState<'Barchasi' | InterviewTopic>(
    'Barchasi'
  );
  const [levelFilter, setLevelFilter] = useState<'Barchasi' | InterviewLevel>(
    'Barchasi'
  );
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['py-is-eq', 'dj-n-plus-1']);
  const [memorizedIds, setMemorizedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTERVIEW_BANK.filter((item) => {
      if (topicFilter !== 'Barchasi' && item.topic !== topicFilter) return false;
      if (levelFilter !== 'Barchasi' && item.level !== levelFilter) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.memoryHook.toLowerCase().includes(q)
      );
    });
  }, [topicFilter, levelFilter, query]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMemorized = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemorizedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.section
      id="intervyu-baza"
      initial={{opacity: 0, y: 18}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.08}}
      transition={{duration: 0.6, ease: EASE}}
      className="relative max-w-[1260px] mx-auto px-5 md:px-[6.5vw] py-16 border-t border-[var(--hairline)]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="eyebrow">
            PYTHON (150) + POSTGRESQL (90) + DJANGO/DRF (200) · SARALANGAN BAZA
          </p>
          <h2
            className="mt-3 text-[clamp(28px,2.8vw,44px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Suhbat va amaliyotda <em className="italic">eng ko‘p tushadigan</em>{' '}
            savollar — yodda qolish qoidasi bilan.
          </h2>
          <p className="mt-2.5 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
            Junior, Middle va Senior darajasidagi eng muhim qoidalar bitta
            joyda jamlangan. Har bir kartani ochib o‘qing va o‘zlashtirganingizni
            belgilab boring.
          </p>
        </div>

        <div className="liquid-glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2.5 self-start text-xs font-mono">
          <BookOpenCheck className="w-4 h-4 text-[#FF5A1F]" />
          <span className="text-[var(--ink)] font-medium tabular-nums">
            {memorizedIds.length} / {INTERVIEW_BANK.length} yodlandi
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mt-7 liquid-glass rounded-[20px] p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['Barchasi', 'Python', 'PostgreSQL', 'Django', 'DRF'] as const).map(
            (topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setTopicFilter(topic)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  topicFilter === topic
                    ? 'bg-[#FF5A1F] text-white'
                    : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                {topic}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {(['Barchasi', 'Junior', 'Middle', 'Senior'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono cursor-pointer transition-colors ${
                  levelFilter === lvl
                    ? 'bg-[var(--ink)] text-[var(--bg)]'
                    : 'border border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masalan: MVCC, JWT, yield, NULL..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[#FF5A1F]"
            />
          </div>
        </div>
      </div>

      {/* Flashcards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isOpen = openIds.includes(item.id);
          const isMemorized = memorizedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleOpen(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleOpen(item.id);
                }
              }}
              className={`liquid-glass rounded-[20px] p-5 cursor-pointer transition-all border ${
                isMemorized
                  ? 'border-emerald-500/40'
                  : 'border-[var(--glass-border)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#FF5A1F] font-medium">
                      {item.topic}
                    </span>
                    <span className="text-[var(--muted)]">·</span>
                    <span className="text-[var(--muted)]">{item.level}</span>
                  </div>
                  <h3 className="text-sm md:text-[15px] font-medium text-[var(--ink)] leading-snug">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => toggleMemorized(item.id, e)}
                    aria-label="Yodlandi deb belgilash"
                    title={isMemorized ? 'Yodlangan' : 'Yodladim deb belgilash'}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isMemorized
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--muted)] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
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
                    <div className="pt-4 mt-4 border-t border-[var(--hairline)] space-y-3">
                      <p className="text-xs md:text-[13px] leading-relaxed text-[var(--body)]">
                        {item.answer}
                      </p>

                      <div className="p-3 rounded-xl bg-[#FF5A1F]/[0.07] border border-[#FF5A1F]/20 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--ink)] leading-relaxed">
                          <span className="font-semibold">
                            Yodda qolish qoidasi:{' '}
                          </span>
                          {item.memoryHook}
                        </p>
                      </div>

                      {item.code && (
                        <pre className="m-0 p-3 rounded-xl bg-[#0F1115] text-[#D8DEE9] font-mono text-[11.5px] leading-relaxed overflow-x-auto">
                          {item.code}
                        </pre>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 liquid-glass rounded-[20px] p-8 text-center text-sm text-[var(--muted)]">
          Qidiruv bo‘yicha savol topilmadi. Filtrni tozalab qayta urinib ko‘ring.
        </div>
      )}
    </motion.section>
  );
}
