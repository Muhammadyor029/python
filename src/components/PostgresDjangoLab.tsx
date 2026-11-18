import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {AlertTriangle, CheckCircle2, Database, Gauge, GitCommit} from 'lucide-react';

type LabTab = 'orm-n1' | 'pg-mvcc' | 'pg-index' | 'pg-null';

const EASE = [0.22, 1, 0.36, 1] as const;

export function PostgresDjangoLab() {
  const [tab, setTab] = useState<LabTab>('orm-n1');
  const [ormFixed, setOrmFixed] = useState(true);
  const [mvccStep, setMvccStep] = useState<'initial' | 'updated' | 'vacuum'>('updated');
  const [indexType, setIndexType] = useState<'btree' | 'gin' | 'brin'>('btree');
  const [nullMode, setNullMode] = useState<'trap' | 'safe'>('safe');

  return (
    <div className="mt-7 liquid-glass rounded-[24px] p-5 md:p-8 border border-[var(--glass-border)]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
            POSTGRESQL &amp; DJANGO ORM · VIZUAL LABORATORIYA
          </p>
          <h3
            className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Baza nega sekinlashadi va <em className="italic">Django ORM</em> uni
            qanday tezlashtiradi?
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] max-w-2xl">
            N+1 muammosi, PostgreSQL MVCC versiyalar mexanizmi, B-tree / GIN /
            BRIN indekslari va NULL tuzog‘ini jonli ko‘rsatkichlarda solishtiring.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ['orm-n1', 'ORM N+1 vs JOIN', Gauge],
              ['pg-mvcc', 'MVCC & VACUUM', GitCommit],
              ['pg-index', 'B-tree / GIN / BRIN', Database],
              ['pg-null', 'NULL Tuzog‘i', AlertTriangle],
            ] as const
          ).map(([id, label, Icon]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#FF5A1F] text-white shadow-[0_4px_14px_rgba(255,90,31,0.3)]'
                    : 'liquid-glass-pill text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'orm-n1' && (
          <motion.div
            key="orm-n1"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOrmFixed(false)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    !ormFixed
                      ? 'bg-red-600 text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  Yomon kod: N+1 (101 so‘rov)
                </button>
                <button
                  type="button"
                  onClick={() => setOrmFixed(true)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    ormFixed
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  To‘g‘ri kod: select_related (1 so‘rov)
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                <strong>Hayotiy misol:</strong> 100 ta buyurtmani olib, har
                birining mijozini ko‘rish uchun omborga 100 marta alohida
                qatnash (N+1) o‘rniga, bitta yuk mashinasida (
                <code className="font-mono text-[#FF5A1F]">select_related</code>{' '}
                SQL JOIN) hammasini birdan olib kelish!
              </p>
              <div className="p-3.5 rounded-xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] font-mono text-xs space-y-1">
                <div>
                  SQL So‘rovlar soni:{' '}
                  <strong
                    className={ormFixed ? 'text-emerald-500' : 'text-red-500'}
                  >
                    {ormFixed ? '1 ta SQL (INNER JOIN)' : '101 ta SQL (1 + 100)'}
                  </strong>
                </div>
                <div>
                  Simulyatsiya holati:{' '}
                  <strong className="text-[var(--ink)]">
                    {ormFixed ? 'tez (1 so‘rov)' : 'sekin (101 so‘rov)'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <pre className="m-0 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed overflow-x-auto border border-white/10">
                {ormFixed
                  ? `# ✅ Bitta SQL JOIN so'rovi bilan barcha mijozlar ham keladi:\nbuyurtmalar = Buyurtma.objects.select_related("mijoz")[:100]\nfor b in buyurtmalar:\n    print(b.id, b.mijoz.ism)  # Qo'shimcha SQL YO'Q!`
                  : `# ❌ N+1 MUAMMOSI: Har bir sikl aylanishida bazaga yangi SELECT!\nbuyurtmalar = Buyurtma.objects.all()[:100]  # 1-so'rov\nfor b in buyurtmalar:\n    print(b.id, b.mijoz.ism)  # +100 ta yashirin SELECT!`}
              </pre>
            </div>
          </motion.div>
        )}

        {tab === 'pg-mvcc' && (
          <motion.div
            key="pg-mvcc"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['initial', '1. Boshlang‘ich (INSERT)'],
                    ['updated', '2. Yangilash (UPDATE)'],
                    ['vacuum', '3. AUTOVACUUM tozalashi'],
                  ] as const
                ).map(([s, lbl]) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setMvccStep(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                      mvccStep === s
                        ? 'bg-[#FF5A1F] text-white'
                        : 'liquid-glass-pill text-[var(--body)]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                PostgreSQL’da <strong>MVCC</strong> UPDATE paytida eski qatorni
                ustidan o‘chirmaydi — eski versiyaga <code>xmax</code> qo‘yib,
                yangi tuple yozadi. Natijada parallel <code>SELECT</code>{' '}
                hech qachon bloklanmaydi! Keyin <code>VACUUM</code> o‘lik
                qatorlarni bo‘shatadi.
              </p>
            </div>

            <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-2.5 border border-white/10">
              <div className="text-[#FFB06A]">
                PostgreSQL Heap Sahifasi (users jadvali):
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  mvccStep === 'initial'
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-[#9FE6B8]'
                    : mvccStep === 'updated'
                      ? 'border-red-500/40 bg-red-500/10 text-red-300 line-through'
                      : 'border-white/10 bg-white/[0.03] text-[#8B9098]'
                }`}
              >
                {mvccStep === 'vacuum'
                  ? '[Bo‘shatilgan joy — VACUUM yangi INSERT lar uchun tayyorladi]'
                  : 'Tuple v1 (xmin=101, xmax=' +
                    (mvccStep === 'updated' ? '105 DEAD' : '∞') +
                    ') → balans: 100,000'}
              </div>
              {mvccStep !== 'initial' && (
                <div className="p-2.5 rounded-lg border border-emerald-500/50 bg-emerald-500/15 text-[#9FE6B8]">
                  Tuple v2 (xmin=105, xmax=∞ LIVE) → balans: 150,000
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'pg-index' && (
          <motion.div
            key="pg-index"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['btree', 'B-tree (Default)'],
                    ['gin', 'GIN (JSONB / Matn)'],
                    ['brin', 'BRIN (Milliard log)'],
                  ] as const
                ).map(([k, lbl]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setIndexType(k)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                      indexType === k
                        ? 'bg-[#FF5A1F] text-white'
                        : 'liquid-glass-pill text-[var(--body)]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                {indexType === 'btree' &&
                  'B-tree (95% holatlar): =, <, >, BETWEEN, ORDER BY va "abc%" qidiruvlari uchun muvozanatli daraxt (O(log N)).'}
                {indexType === 'gin' &&
                  'GIN (Inverted Index): JSONB ichidagi kalitlar (@>), massivlar va "%so‘z%" (pg_trgm) qidiruvlari uchun.'}
                {indexType === 'brin' &&
                  'BRIN (Block Range Index): vaqt bo‘yicha ketma-ket yoziladigan katta log jadvallarida B-tree indeksiga qaraganda ancha kam joy egallaydi.'}
              </p>
            </div>
            <div className="lg:col-span-7">
              <pre className="m-0 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed overflow-x-auto border border-white/10">
                {indexType === 'btree'
                  ? `CREATE INDEX CONCURRENTLY idx_orders_user_date\nON orders (user_id, created_at DESC);\n-- EXPLAIN ANALYZE: Index Scan using idx_orders_user_date`
                  : indexType === 'gin'
                    ? `CREATE INDEX idx_modul_keywords_gin\nON courses_modul USING GIN (kalit_sozlar jsonb_path_ops);\n-- WHERE kalit_sozlar @> '["celery"]' -> GIN indeks ishlatiladi`
                    : `CREATE INDEX idx_audit_created_brin\nON audit_logs USING BRIN (created_at);\n-- Katta log jadvalida B-tree'ga qaraganda ancha kam joy egallaydi`}
              </pre>
            </div>
          </motion.div>
        )}

        {tab === 'pg-null' && (
          <motion.div
            key="pg-null"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setNullMode('trap')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    nullMode === 'trap'
                      ? 'bg-red-600 text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  Xato: WHERE status != &apos;cancelled&apos;
                </button>
                <button
                  type="button"
                  onClick={() => setNullMode('safe')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    nullMode === 'safe'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  To‘g‘ri: IS DISTINCT FROM
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                SQL da <code>NULL</code> = &quot;noma’lum&quot;. Shuning uchun{' '}
                <code>NULL != &apos;cancelled&apos;</code> natijasi TRUE emas,
                balki <code>UNKNOWN</code> bo‘ladi va qator yo‘qoladi!
              </p>
            </div>
            <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-2 border border-white/10">
              <div className="flex items-center gap-2">
                {nullMode === 'safe' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span>
                  {nullMode === 'safe'
                    ? 'Qator #3 (status=NULL) SAQLANIB QOLDI!'
                    : 'Qator #3 (status=NULL) YASHIRINCHA TUSHIB QOLDI!'}
                </span>
              </div>
              <pre className="m-0 pt-2 text-[11.5px] overflow-x-auto">
                {nullMode === 'safe'
                  ? `SELECT id, status FROM orders\nWHERE status IS DISTINCT FROM 'cancelled';\n-- Natija: 'paid', 'new', va NULL ham chiqadi!`
                  : `SELECT id, status FROM orders\nWHERE status != 'cancelled';\n-- Natija: faqat 'paid' va 'new' (NULL qatorlar yo'qoldi!)`}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
