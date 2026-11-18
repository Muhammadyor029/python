import React, {useEffect, useRef} from 'react';
import {motion} from 'motion/react';
import {BackendCardBody} from './BackendCard';
import {BACKEND_CARDS} from '../data/backendCards';

const PALETTE = [
  '#FF4A12',
  '#FF5A1F',
  '#FF6B2C',
  '#FF8A3D',
  '#FFB06A',
  '#FFD9B5',
  '#FFF3E6',
];

const CARD_PALETTES: readonly (readonly string[])[] = [
  ['#E5B278', '#C6854C', '#7A4F2D', '#2A1E17'],
  ['#FFE0C2', '#FF9A4A', '#F7C79A', '#2A1406'],
  ['#B89578', '#785B46', '#463328', '#2B1F18'],
  ['#E08A48', '#54708C', '#3A2823', '#1B1311'],
  ['#FF8F38', '#C84418', '#5E2212', '#140C08'],
  ['#E9ECF1', '#B7C4D8', '#46618E', '#121A2A'],
];

const EASE = [0.22, 1, 0.36, 1] as const;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  stretch: number;
  colorIdx: number;
  life: number;
  maxLife: number;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function hash3(a: number, b: number, c: number): number {
  let h =
    (Math.imul(a, 374761393) +
      Math.imul(b, 668265263) +
      Math.imul(c, 2147483647)) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

interface HeroDisintegrationStageProps {
  isDark: boolean;
  onScrollToDashboard: () => void;
}

export function HeroDisintegrationStage({
  isDark,
  onScrollToDashboard,
}: HeroDisintegrationStageProps) {
  const beltRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gapProbeRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const codeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeNumRef = useRef<HTMLSpanElement | null>(null);
  const badgePctRef = useRef<HTMLSpanElement | null>(null);

  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const beltEl = beltRef.current;
    const canvasEl = canvasRef.current;
    const gapProbeEl = gapProbeRef.current;
    if (!beltEl || !canvasEl || !gapProbeEl) return;

    const ctx = canvasEl.getContext('2d', {alpha: true});
    if (!ctx) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = mql.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };
    mql.addEventListener('change', onMotionChange);

    let cw = 0;
    let ch = 0;
    let gap = 0;
    let Lx = window.innerWidth / 2;
    let dpr = 1;
    let beltW = 0;
    let beltH = 0;
    let off = 0;
    let initialized = false;

    const measure = () => {
      const firstCard = cardRefs.current[0];
      if (!firstCard) return;
      const cardRect = firstCard.getBoundingClientRect();
      cw = cardRect.width;
      ch = cardRect.height;
      gap = gapProbeEl.getBoundingClientRect().width;
      Lx = window.innerWidth / 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const beltRect = beltEl.getBoundingClientRect();
      beltW = beltRect.width;
      beltH = beltRect.height;
      canvasEl.width = Math.max(1, Math.round(beltW * dpr));
      canvasEl.height = Math.max(1, Math.round(beltH * dpr));

      if (!initialized && cw > 0) {
        off = window.innerWidth / 2 - 0.56 * cw;
        initialized = true;
      }
    };

    measure();
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(beltEl);
    }

    let vel = reduced ? 0 : -0.075 * window.innerWidth;
    let hover = 0;
    let isHovered = false;
    let dragging = false;
    let dragPendingDx = 0;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let activePointerId: number | null = null;

    let lastCrossIdx = -1;
    let shownVal = 0;
    let beamIntensity = 0;
    const sparks: Spark[] = [];

    const prevCutState = new Int8Array(BACKEND_CARDS.length).fill(-1);

    const orangeBuckets: number[][] = PALETTE.map(() => []);
    const bgBiteBucket: number[] = [];
    const cardBuckets: number[][] = [0, 1, 2, 3].map(() => []);

    const onPointerEnter = () => {
      isHovered = true;
    };
    const onPointerLeave = () => {
      isHovered = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragging = true;
      dragPendingDx = 0;
      activePointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastPointerTime = performance.now();
      beltEl.classList.add('dragging');
      beltEl.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointerId) return;
      const now = performance.now();
      const dx = e.clientX - lastPointerX;
      const dtMs = Math.max(8, now - lastPointerTime);
      dragPendingDx += dx;
      const instVel = (dx / dtMs) * 1000;
      vel = instVel * 0.45 + vel * 0.55;
      lastPointerX = e.clientX;
      lastPointerTime = now;
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointerId) return;
      dragging = false;
      activePointerId = null;
      beltEl.classList.remove('dragging');
      if (beltEl.hasPointerCapture(e.pointerId)) {
        beltEl.releasePointerCapture(e.pointerId);
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        vel += -e.deltaX * 5.2;
      }
    };

    beltEl.addEventListener('pointerenter', onPointerEnter);
    beltEl.addEventListener('pointerleave', onPointerLeave);
    beltEl.addEventListener('pointerdown', onPointerDown);
    beltEl.addEventListener('pointermove', onPointerMove);
    beltEl.addEventListener('pointerup', endDrag);
    beltEl.addEventListener('pointercancel', endDrag);
    beltEl.addEventListener('wheel', onWheel, {passive: false});

    let rafId = 0;
    let lastTime = performance.now();

    const drawFx = (
      xs: number[],
      cuts: number[],
      dt: number,
      tSec: number
    ) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, beltW, beltH);

      for (let c = 0; c < PALETTE.length; c++) {
        orangeBuckets[c].length = 0;
      }
      bgBiteBucket.length = 0;

      const cardY = 70;
      const speedFactor = Math.min(1.6, Math.abs(vel) / 140);
      const R = cw * (0.3 + 0.06 * speedFactor);
      const rows = Math.ceil(ch / 3);
      const twinklePhase = Math.floor(tSec * 9) + 97;
      const bgColor = isDarkRef.current ? '#0D0F13' : '#EEF0F2';
      let anyCrossing = false;
      let crossingCardIdx = -1;

      for (let i = 0; i < BACKEND_CARDS.length; i++) {
        const x = xs[i];
        const cut = cuts[i];
        if (cut <= 0 || x + cw <= Lx) continue;
        anyCrossing = true;
        crossingCardIdx = i;

        for (let m = 0; m < 4; m++) {
          cardBuckets[m].length = 0;
        }

        const hazeW = Math.min(175, x + cw - Lx);
        if (hazeW > 0) {
          const grad = ctx.createLinearGradient(Lx, 0, Lx + 175, 0);
          grad.addColorStop(0, 'rgba(255,96,40,0.46)');
          grad.addColorStop(0.35, 'rgba(255,112,52,0.18)');
          grad.addColorStop(1, 'rgba(255,96,40,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(Lx, cardY, hazeW, ch);
        }

        const afterW = Math.min(54, cut);
        if (afterW > 2) {
          const afterGrad = ctx.createLinearGradient(Lx - afterW, 0, Lx, 0);
          afterGrad.addColorStop(0, 'rgba(255,90,31,0)');
          afterGrad.addColorStop(1, 'rgba(255,90,31,0.15)');
          ctx.fillStyle = afterGrad;
          ctx.fillRect(Lx - afterW, cardY, afterW, ch);
        }

        const startGx = Math.max(0, Math.floor((cut - 18) / 3));
        const endGx = Math.min(
          Math.ceil(cw / 3),
          Math.ceil((cut + R) / 3)
        );

        for (let gx = startGx; gx <= endGx; gx++) {
          const sx = x + gx * 3;
          const d = sx - Lx;

          if (d < -48 || d > R) continue;

          if (d < 0) {
            const leftRatio = 1 + d / 48;
            const leftProb = leftRatio * leftRatio * 0.28;
            for (let row = 0; row < rows; row++) {
              if (hash3(gx, row, i + 211) >= leftProb) continue;
              if (!reduced && hash3(gx, row, twinklePhase + 17) < 0.28)
                continue;
              const h2 = hash3(row, gx, i + 89);
              const colorIdx =
                d > -10
                  ? Math.min(6, 4 + Math.floor(h2 * 3))
                  : Math.min(4, Math.floor(h2 * 5));
              const jx = reduced
                ? 0
                : (hash3(gx + 5, row, i + 13) - 0.5) * 2.2;
              const jy = reduced
                ? 0
                : (hash3(gx, row + 7, i + 29) - 0.5) * 1.6;
              const streakW = 2.0 + leftRatio * 4.2 * h2;
              const streakH = 1.0 + h2 * 0.9;
              orangeBuckets[colorIdx].push(
                sx + jx - streakW * 0.5,
                cardY + row * 3 + jy,
                streakW,
                streakH
              );
            }
            continue;
          }

          const p = Math.pow(1 - d / R, 1.68);

          for (let row = -5; row <= rows + 5; row++) {
            const rowWave =
              d < 28
                ? (hash3(0, row, i + 73) - 0.5) * 18 +
                  Math.sin(row * 0.35 + i) * 4
                : 0;
            const dEff = d + rowWave;

            if (row >= 1 && row < rows - 1 && d >= 5 && d < 24) {
              const biteProb = Math.pow(1 - d / 24, 1.9) * 0.55;
              if (hash3(gx, row, i + 137) < biteProb) {
                const bh = 1.8 + hash3(row, gx, i + 151) * 2.2;
                bgBiteBucket.push(sx, cardY + row * 3, 2.8, bh);
              }
            }

            let prob: number;
            if (row < 0) {
              prob = p * 0.17 * (1 + row / 5);
            } else if (row >= rows) {
              prob = p * 0.17 * (1 - (row - rows) / 5);
            } else {
              prob = p * 0.94;
            }
            if (prob <= 0) continue;
            if (hash3(gx, row, i) >= prob) continue;
            if (!reduced && hash3(gx, row, twinklePhase) < 0.2) continue;

            const h2 = hash3(row, gx, i + 31);
            const jx = reduced
              ? 0
              : (hash3(gx + 11, row, i + 7) - 0.5) * 1.8;
            const jy = reduced
              ? 0
              : (hash3(gx, row + 13, i + 19) - 0.5) * 1.8;

            if (
              row >= 0 &&
              row < rows &&
              dEff >= 8 &&
              dEff < 30 &&
              hash3(gx + 3, row, i + 193) < 0.48
            ) {
              const matIdx = Math.floor(hash3(row, gx + 7, i + 59) * 4);
              const driftX = reduced
                ? 0
                : -((30 - dEff) / 22) * (1.5 + h2 * 3.5);
              const sz = 1.5 + h2 * 2.1;
              cardBuckets[matIdx].push(
                sx + jx + driftX,
                cardY + row * 3 + jy,
                sz,
                sz
              );
              continue;
            }

            const colorIdx =
              dEff < 11
                ? Math.min(6, 4 + Math.floor(h2 * 3))
                : Math.min(6, Math.floor(h2 * h2 * 7));
            const sz = 1.1 + h2 * 1.8;
            orangeBuckets[colorIdx].push(sx + jx, cardY + row * 3 + jy, sz, sz);
          }
        }

        const matPalette = CARD_PALETTES[i];
        for (let m = 0; m < 4; m++) {
          const mList = cardBuckets[m];
          if (mList.length === 0) continue;
          ctx.fillStyle = matPalette[m];
          for (let k = 0; k < mList.length; k += 4) {
            ctx.fillRect(mList[k], mList[k + 1], mList[k + 2], mList[k + 3]);
          }
        }
      }

      const targetIntensity = anyCrossing ? 1 : 0.25;
      beamIntensity += (targetIntensity - beamIntensity) * Math.min(1, dt * 12);

      if (bgBiteBucket.length > 0) {
        ctx.fillStyle = bgColor;
        for (let k = 0; k < bgBiteBucket.length; k += 4) {
          ctx.fillRect(
            bgBiteBucket[k],
            bgBiteBucket[k + 1],
            bgBiteBucket[k + 2],
            bgBiteBucket[k + 3]
          );
        }
      }

      for (let c = 0; c < PALETTE.length; c++) {
        const list = orangeBuckets[c];
        if (list.length === 0) continue;
        ctx.fillStyle = PALETTE[c];
        for (let k = 0; k < list.length; k += 4) {
          ctx.fillRect(list[k], list[k + 1], list[k + 2], list[k + 3]);
        }
      }

      if (anyCrossing && crossingCardIdx !== -1) {
        ctx.save();
        ctx.globalAlpha = 0.72 * beamIntensity;
        const coreGrad = ctx.createLinearGradient(0, cardY - 6, 0, cardY + ch + 6);
        coreGrad.addColorStop(0, 'rgba(255,245,232,0)');
        coreGrad.addColorStop(0.06, 'rgba(255,245,232,0.95)');
        coreGrad.addColorStop(0.94, 'rgba(255,245,232,0.95)');
        coreGrad.addColorStop(1, 'rgba(255,245,232,0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(Lx - 0.75, cardY - 6, 1.5, ch + 12);

        if (!reduced) {
          const flareSeed = Math.floor(tSec * 24);
          ctx.fillStyle = '#FFE5CC';
          for (let f = 0; f < 5; f++) {
            const fy =
              cardY + 8 + hash3(f, flareSeed, crossingCardIdx) * (ch - 16);
            const fw = 8 + hash3(flareSeed, f, 71) * 26;
            const fxOffset = (hash3(f, 33, flareSeed) - 0.35) * fw;
            ctx.globalAlpha = 0.25 + hash3(f, flareSeed, 19) * 0.4;
            ctx.fillRect(Lx - fxOffset, fy, fw, 1);
          }
        }
        ctx.restore();
      }

      if (!reduced && anyCrossing) {
        const spawnCount = vel > 40 ? 2 : 4;
        for (let s = 0; s < spawnCount; s++) {
          if (Math.random() < 0.75) {
            const maxLife = 0.35 + Math.random() * 0.9;
            const baseVx =
              vel > 35
                ? 45 + Math.random() * 65 + vel * 0.35
                : -45 + Math.random() * 65 + vel * 0.55;
            sparks.push({
              x: Lx + (Math.random() - 0.25) * 26,
              y: cardY - 8 + Math.random() * (ch + 16),
              vx: baseVx,
              vy: (Math.random() - 0.5) * 52,
              size: 0.9 + Math.random() * 1.7,
              stretch: 1 + Math.random() * 1.8,
              colorIdx: Math.floor(Math.random() * PALETTE.length),
              life: maxLife,
              maxLife,
            });
          }
        }
      }

      for (let idx = sparks.length - 1; idx >= 0; idx--) {
        const sp = sparks[idx];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy *= 1 - Math.min(0.5, dt * 1.5);
        sp.life -= dt;
        if (sp.life <= 0) {
          sparks.splice(idx, 1);
          continue;
        }
        const ratio = sp.life / sp.maxLife;
        ctx.globalAlpha = Math.min(1, ratio * ratio * 1.85);
        ctx.fillStyle = PALETTE[sp.colorIdx];
        const w = sp.size * (1 + (1 - ratio) * sp.stretch * 0.5);
        ctx.fillRect(sp.x, sp.y, w, sp.size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (cw === 0 || ch === 0) measure();

      if (dragging && dragPendingDx !== 0) {
        off += dragPendingDx;
        dragPendingDx = 0;
      }

      const auto = reduced ? 0 : -0.075 * window.innerWidth;
      if (isHovered) {
        hover = Math.min(1, hover + 3.6 * dt);
      } else {
        hover = Math.max(0, hover - 3.6 * dt);
      }

      const targetVel = auto * (1 - 0.65 * hover);
      if (!dragging) {
        vel += (targetVel - vel) * (1 - Math.exp(-2.6 * dt));
        off += vel * dt;
      }

      if (cw > 0 && ch > 0) {
        const span = cw + gap;
        const period = span * BACKEND_CARDS.length;
        const xs: number[] = [];
        const cuts: number[] = [];
        let crossingIdx = -1;

        for (let i = 0; i < BACKEND_CARDS.length; i++) {
          const x = mod(off + i * span + span, period) - span;
          const cut = Math.max(0, Math.min(cw, Lx - x));
          xs.push(x);
          cuts.push(cut);

          if (cut > 0 && cut < cw) {
            crossingIdx = i;
          }

          const cardEl = cardRefs.current[i];
          const codeEl = codeRefs.current[i];
          const state = cut <= 0 ? 0 : cut >= cw ? 2 : 1;

          if (cardEl) {
            cardEl.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            if (state === 1) {
              const cPx = cut.toFixed(2);
              const cEndPx = (cut + 28).toFixed(2);
              cardEl.style.clipPath = `inset(0 0 0 ${cPx}px round 0 1.6vw 1.6vw 0)`;
              const mask = `linear-gradient(90deg, transparent ${cPx}px, #000 ${cEndPx}px)`;
              cardEl.style.maskImage = mask;
              cardEl.style.webkitMaskImage = mask;
            } else if (prevCutState[i] !== state) {
              if (state === 0) {
                cardEl.style.clipPath = 'none';
                cardEl.style.maskImage = 'none';
                cardEl.style.webkitMaskImage = 'none';
              } else {
                cardEl.style.clipPath = `inset(0 0 0 ${cw.toFixed(2)}px)`;
                cardEl.style.maskImage = 'none';
                cardEl.style.webkitMaskImage = 'none';
              }
            }
          }

          if (codeEl) {
            codeEl.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            if (state === 1) {
              codeEl.style.visibility = 'visible';
              codeEl.style.clipPath = `inset(0 ${(cw - cut).toFixed(2)}px 0 0)`;
            } else if (prevCutState[i] !== state) {
              if (state === 0) {
                codeEl.style.visibility = 'hidden';
                codeEl.style.clipPath = 'none';
              } else {
                codeEl.style.visibility = 'visible';
                codeEl.style.clipPath = 'inset(0 0px 0 0)';
              }
            }
          }

          prevCutState[i] = state;
        }

        if (crossingIdx !== -1) {
          const card = BACKEND_CARDS[crossingIdx];
          const progress = cuts[crossingIdx] / cw;
          const target = Math.round(
            card.metricStart + (card.metricEnd - card.metricStart) * progress
          );

          if (crossingIdx !== lastCrossIdx) {
            lastCrossIdx = crossingIdx;
            shownVal = target;
            if (badgePctRef.current) {
              badgePctRef.current.textContent = card.moduleTag;
            }
          } else {
            shownVal += (target - shownVal) * (1 - Math.exp(-16 * dt));
          }

          if (badgeNumRef.current) {
            badgeNumRef.current.textContent = `${Math.round(shownVal).toLocaleString('en-US')} ${card.metricUnit}`;
          }
        }

        drawFx(xs, cuts, dt, now / 1000);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      mql.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', measure);
      beltEl.removeEventListener('pointerenter', onPointerEnter);
      beltEl.removeEventListener('pointerleave', onPointerLeave);
      beltEl.removeEventListener('pointerdown', onPointerDown);
      beltEl.removeEventListener('pointermove', onPointerMove);
      beltEl.removeEventListener('pointerup', endDrag);
      beltEl.removeEventListener('pointercancel', endDrag);
      beltEl.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <main id="top" className="stage">
      <motion.section
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, ease: EASE}}
        className="hero"
      >
        <div>
          <p className="eyebrow">
            PAIMON BACKEND AKADEMIYA · 0 DAN PRODUCTIONGACHA
          </p>
          <h1 className="headline">
            Kod ortidagi tizim.
            <br />
            <em>0 dan haqiqiy backendgacha.</em>
          </h1>
        </div>
        <div>
          <p className="hero-copy">
            print(&quot;Salom, Dunyo!&quot;) dan tortib Python 150, PostgreSQL
            90, Django 120 va DRF API 80 mavzularigacha — har bir bo‘lim
            hayotiy misollar, jonli simulyator va random amaliy testlar bilan.
          </p>
          <button
            type="button"
            className="hero-btn"
            onClick={onScrollToDashboard}
          >
            Bo‘limlarni ko‘rish ↓
          </button>
        </div>
      </motion.section>

      {/* Counter badge */}
      <div className="badge" aria-live="polite">
        <span className="badge-lbl">Backend dars oqimi</span>
        <div className="badge-pill">
          <span ref={badgeNumRef} className="badge-num">
            88 qator kod
          </span>
          <span ref={badgePctRef} className="badge-pct">
            1-modul · Python
          </span>
        </div>
      </div>

      {/* Scanner line */}
      <div className="scan" aria-hidden="true">
        <i />
        <b />
      </div>

      {/* Belt */}
      <div
        ref={beltRef}
        className="belt"
        aria-label="Backend tushunchalaridan haqiqiy Python va Django kodiga o'tuvchi interaktiv tasma"
      >
        <div ref={gapProbeRef} className="gap-probe" aria-hidden="true" />

        <div className="codes" aria-hidden="true">
          {BACKEND_CARDS.map((card, i) => (
            <div
              key={`code-${card.id}`}
              ref={(el) => {
                codeRefs.current[i] = el;
              }}
              className="code"
            >
              <div className="code-html">{card.code}</div>
              <div className="code-meta">
                {`# fayl: ${card.fileUrl}\n# bosqich: ${card.moduleTag}\n# 0 dan productiongacha`}
              </div>
            </div>
          ))}
        </div>

        <div className="cards">
          {BACKEND_CARDS.map((card, i) => (
            <div
              key={`card-${card.id}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`card card-${card.id}`}
            >
              <BackendCardBody id={card.id} />
            </div>
          ))}
        </div>

        <canvas ref={canvasRef} className="fx" aria-hidden="true" />
      </div>
    </main>
  );
}
