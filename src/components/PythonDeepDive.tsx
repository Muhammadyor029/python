import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Cpu, GitBranch, Layers, MemoryStick, Play} from 'lucide-react';

type DeepLabId = 'memory' | 'generator' | 'decorator' | 'concurrency';

const EASE = [0.22, 1, 0.36, 1] as const;

export function PythonDeepDive() {
  const [activeTab, setActiveTab] = useState<DeepLabId>('memory');

  // 1. Memory & Copy state
  const [copyMode, setCopyMode] = useState<'alias' | 'shallow' | 'deepcopy'>(
    'shallow'
  );
  const [innerMutated, setInnerMutated] = useState(false);

  // 2. Generator vs List RAM state
  const [genMode, setGenMode] = useState<'list' | 'generator'>('generator');
  const [yieldStep, setYieldStep] = useState(1);

  // 3. Concurrency (GIL) visualizer
  const [workload, setWorkload] = useState<'io' | 'cpu'>('io');

  return (
    <div className="mt-8 liquid-glass rounded-[24px] p-5 md:p-8 border border-[var(--glass-border)]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-[var(--hairline)]">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
            PYTHON CHUQURLASHTIRILGAN LABORATORIYA · 26–150-MAVZULAR
          </p>
          <h3
            className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-0.02em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Xotira (<code className="font-mono text-[0.82em]">is</code> /{' '}
            <code className="font-mono text-[0.82em]">deepcopy</code>),{' '}
            <em className="italic">Generatorlar</em>, Dekoratorlar va GIL
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-[var(--body)] max-w-2xl">
            Python’ni oddiy sintaksisdan haqiqiy Senior muhandis darajasiga olib
            chiqadigan 4 ta asosiy mexanizmni jonli tugmalar bilan ko‘ring.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ['memory', 'is vs == & Copy', MemoryStick],
              ['generator', 'yield Generator', Layers],
              ['decorator', '@decorator & with', GitBranch],
              ['concurrency', 'GIL & Asyncio', Cpu],
            ] as const
          ).map(([id, label, Icon]) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
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
        {activeTab === 'memory' && (
          <motion.div
            key="memory"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025]">
                <p className="text-[11px] font-mono uppercase tracking-[0.07em] text-[#FF5A1F] mb-1">
                  Hayotiy tasavvur
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-[var(--body)]">
                  <strong>Alias (b = a)</strong> — bitta xonaga ikkinchi kalit
                  berish. <strong>Shallow copy</strong> — yangi koridor ochish,
                  lekin ichidagi mebel (ichki ro‘yxat) hanuz umumiy!{' '}
                  <strong>Deep copy</strong> — mebelgacha noldan nusxalash.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['alias', 'b = a (Alias)'],
                    ['shallow', 'b = copy.copy(a)'],
                    ['deepcopy', 'b = copy.deepcopy(a)'],
                  ] as const
                ).map(([m, lbl]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setCopyMode(m);
                      setInnerMutated(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                      copyMode === m
                        ? 'bg-[var(--ink)] text-[var(--bg)]'
                        : 'liquid-glass-pill text-[var(--body)]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setInnerMutated((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-mono cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.3)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>
                  {innerMutated
                    ? 'Asliga qaytarish'
                    : 'b[0].append(99) bajarish'}
                </span>
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-2 border border-white/10">
                <div className="text-[11px] text-[#8B9098]">
                  Asl obyekt: a (id: 0x10A0)
                </div>
                <div className="text-sm font-semibold text-white">
                  a ={' '}
                  {innerMutated && copyMode !== 'deepcopy'
                    ? '[[1, 2, 99], [3, 4]]'
                    : '[[1, 2], [3, 4]]'}
                </div>
                <div className="text-[11px] text-[#FFB06A]">
                  {copyMode === 'deepcopy' && innerMutated
                    ? 'Asl ro‘yxat himoyalandi!'
                    : innerMutated
                      ? 'DIQQAT: a ham o‘zgardi!'
                      : 'Kutilmoqda...'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-2 border border-white/10">
                <div className="text-[11px] text-[#8B9098]">
                  Nusxa: b ({copyMode === 'alias' ? 'id: 0x10A0' : 'id: 0x9F20'})
                </div>
                <div className="text-sm font-semibold text-[#9FE6B8]">
                  b = {innerMutated ? '[[1, 2, 99], [3, 4]]' : '[[1, 2], [3, 4]]'}
                </div>
                <div className="text-[11px] text-[#D8DEE9]">
                  a is b →{' '}
                  <strong className="text-[#FF5A1F]">
                    {copyMode === 'alias' ? 'True' : 'False'}
                  </strong>{' '}
                  | a[0] is b[0] →{' '}
                  <strong className="text-[#FF5A1F]">
                    {copyMode === 'deepcopy' ? 'False' : 'True'}
                  </strong>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'generator' && (
          <motion.div
            key="generator"
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
                  onClick={() => setGenMode('generator')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    genMode === 'generator'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  (x**2 for x in range(1M)) · O(1) RAM
                </button>
                <button
                  type="button"
                  onClick={() => setGenMode('list')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    genMode === 'list'
                      ? 'bg-red-600 text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  [x**2 for x in range(1M)] · 84 MB RAM
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                <strong>Hayotiy misol:</strong> List — 1 million litr suvni
                uyingizga birdaniga hovuz qilib olib kelish. Generator (
                <code className="font-mono text-[#FF5A1F]">yield</code>) —
                kranni ochib, har chaqiruvda (<code className="font-mono">next()</code>) faqat 1 piyola suv olish!
              </p>
              {genMode === 'generator' && (
                <button
                  type="button"
                  onClick={() => setYieldStep((s) => (s >= 5 ? 1 : s + 1))}
                  className="px-4 py-2 rounded-full bg-[#FF5A1F] text-white text-xs font-mono cursor-pointer"
                >
                  next(oqim) chaqirish → Hozirgi qadam: #{yieldStep}
                </button>
              )}
            </div>

            <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-3 border border-white/10">
              <div className="flex items-center justify-between">
                <span>RAM Xotira yuklamasi (1,000,000 element):</span>
                <span
                  className={
                    genMode === 'generator' ? 'text-[#9FE6B8]' : 'text-red-400'
                  }
                >
                  {genMode === 'generator' ? '208 Bayt (O(1))' : '84,487,280 Bayt (~84 MB)'}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  animate={{width: genMode === 'generator' ? '3%' : '94%'}}
                  transition={{duration: 0.4, ease: EASE}}
                  className={`h-full rounded-full ${
                    genMode === 'generator' ? 'bg-[#9FE6B8]' : 'bg-red-500'
                  }`}
                />
              </div>
              <pre className="m-0 pt-2 text-[11.5px] leading-relaxed text-[#D8DEE9] overflow-x-auto">
                {genMode === 'generator'
                  ? `def kvadratlar():\n    for i in range(1, 1_000_001):\n        yield i * i  # Paused at yield!\n\noqim = kvadratlar()\nnext(oqim)  # -> ${yieldStep * yieldStep} (faqat 1 ta hisoblandi)`
                  : `# Barcha 1,000,000 element birdaniga RAM'ga yoziladi!\nkatta_list = [i * i for i in range(1, 1_000_001)]\n# Serverda bir vaqtda 50 ta so'rov kelsa -> OOM Killer!`}
              </pre>
            </div>
          </motion.div>
        )}

        {activeTab === 'decorator' && (
          <motion.div
            key="decorator"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.22, ease: EASE}}
            className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                <strong>Dekorator</strong> — funksiyani asl kodini o‘zgartirmay
                uni vaqt o‘lchash, keshlash yoki ruxsat tekshirish bilan o‘rab
                oluvchi funksiya (masalan Django’da{' '}
                <code className="font-mono text-[#FF5A1F]">@login_required</code>).
              </p>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                <strong>Context Manager (with)</strong> — resursni (fayl, DB
                ulanish, Lock) kirishda ochib (<code className="font-mono">__enter__</code>), hatto xatolik chiqsa ham chiqishda kafolatli yopadi (<code className="font-mono">__exit__</code>).
              </p>
            </div>
            <div className="lg:col-span-7">
              <pre className="m-0 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs leading-relaxed overflow-x-auto border border-white/10">{`from functools import wraps
import time

def vaqt_olcha(func):
    @wraps(func)  # Asl __name__ va __doc__ ni saqlab qoladi!
    def wrapper(*args, **kwargs):
        boshlanish = time.perf_counter()
        natija = func(*args, **kwargs)
        print(f"{func.__name__}: {(time.perf_counter()-boshlanish)*1000:.2f} ms")
        return natija
    return wrapper

@vaqt_olcha
def hisobot_yoz():
    with open("hisobot.txt", "w") as f:  # __exit__ faylni albatta yopadi
        f.write("Paimon Backend tayyor!")`}</pre>
            </div>
          </motion.div>
        )}

        {activeTab === 'concurrency' && (
          <motion.div
            key="concurrency"
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
                  onClick={() => setWorkload('io')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    workload === 'io'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  I/O-bound (API / DB kutish)
                </button>
                <button
                  type="button"
                  onClick={() => setWorkload('cpu')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer ${
                    workload === 'cpu'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'liquid-glass-pill text-[var(--body)]'
                  }`}
                >
                  CPU-bound (Video / ML hisob)
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--body)] leading-relaxed">
                <strong>CPython GIL</strong> bir jarayon ichida bir vaqtda
                faqat 1 ta thread Python baytkodini bajarishiga ruxsat beradi.{' '}
                {workload === 'io'
                  ? 'Tarmoq/DB kutayotganda GIL bo‘shatiladi → Asyncio yoki Threading a’lo darajada ishlaydi!'
                  : 'Matematik hisob-kitobda GIL bo‘shatilmaydi → Faqat Multiprocessing (ko‘p yadroli alohida jarayonlar) tezlashtiradi!'}
              </p>
            </div>

            <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F1115] text-[#D8DEE9] font-mono text-xs space-y-3 border border-white/10">
              <div className="text-[#FFB06A]">
                {workload === 'io'
                  ? 'Tavsiya: asyncio.gather() / Uvicorn (ASGI) / ThreadPoolExecutor'
                  : 'Tavsiya: ProcessPoolExecutor / Celery multi-process workers'}
              </div>
              <pre className="m-0 text-[11.5px] leading-relaxed overflow-x-auto">{workload === 'io'
                ? `# 100 ta tashqi API so'rovi (har biri 1s kutadi):
# Sinxron for: 100 soniya | Asyncio: ~1 soniya!
async def barcha_tolovlarni_tekshir(ids):
    return await asyncio.gather(*(api_check(i) for i in ids))`
                : `# 4 yadroli CPU da og'ir hisob (GIL ni chetlab o'tish):
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor(max_workers=4) as pool:
    natijalar = list(pool.map(ogir_shifrlash, fayllar))`}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
