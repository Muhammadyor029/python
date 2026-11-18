import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Bug,
  CheckCircle2,
  Code2,
  Compass,
  Flame,
  FolderGit2,
  Lock,
  SearchCheck,
  ServerCrash,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type {AcademyState} from '../data/academyApi';
import {ACHIEVEMENT_BADGES, LEARNING_TIERS, LearningTier} from '../data/roadmapProfile';
import {DEEP_LESSONS} from '../data/lessonsEngine';
import {WORKSPACE_EXERCISES} from '../data/workspaceExercises';
import {BACKEND_PROJECTS} from '../data/projectsStudio';
import {
  CODE_REVIEW_CASES,
  DEBUG_SCENARIOS,
  PRODUCTION_INCIDENTS,
} from '../data/debuggingAndReview';

interface RoadmapAndProfileSectionProps {
  academyState: AcademyState;
  completedModulesCount: number;
  totalModulesCount: number;
  onJumpToView: (
    view: LearningTier['targetSection'] | 'lessons' | 'roadmap'
  ) => void;
}

export function RoadmapAndProfileSection({
  academyState,
  completedModulesCount,
  totalModulesCount,
  onJumpToView,
}: RoadmapAndProfileSectionProps) {
  const totalProjectTasks = BACKEND_PROJECTS.reduce(
    (sum, p) => sum + p.tasks.length,
    0
  );

  // Server-side XP is authoritative; module progress is tracked separately.
  const effectiveXp = academyState.xp;

  let currentTierIndex = 0;
  for (let i = 0; i < LEARNING_TIERS.length; i++) {
    if (effectiveXp >= LEARNING_TIERS[i].minXp) {
      currentTierIndex = i;
    }
  }
  const currentTier = LEARNING_TIERS[currentTierIndex];
  const nextTier = LEARNING_TIERS[currentTierIndex + 1] ?? null;

  const progressToNext = nextTier
    ? Math.min(
        100,
        Math.round(
          ((effectiveXp - currentTier.minXp) /
            Math.max(1, nextTier.minXp - currentTier.minXp)) *
            100
        )
      )
    : 100;

  const badgeStats = {
    xp: effectiveXp,
    lessonsCount: academyState.completedLessons.length,
    exercisesCount: academyState.solvedExercises.length,
    projectsCount: academyState.completedProjectTasks.length,
    bugsCount: academyState.solvedBugs.length,
    reviewsCount: academyState.completedReviews.length,
    incidentsCount: academyState.solvedIncidents.length,
    modulesCount: completedModulesCount,
  };

  const unlockedCount = ACHIEVEMENT_BADGES.filter((b) =>
    b.checkUnlocked(badgeStats)
  ).length;

  // Smart Prerequisite & Next-Step Engine based on real practice balance
  const smartSuggestion = (() => {
    if (
      academyState.completedLessons.length === 0 &&
      completedModulesCount === 0
    ) {
      return {
        title: '12-bosqichli Darslikdan boshlang',
        reason:
          'Siz hali birorta chuqur darsni yakunlamadingiz. Avval Python xotira modeli yoki Django Request Lifecycle darsini ko‘rib chiqing.',
        cta: 'Darslikni ochish',
        target: 'lessons' as const,
      };
    }
    if (academyState.solvedExercises.length === 0) {
      return {
        title: 'Python sandboxda kod yozish vaqti keldi',
        reason:
          'Nazariyani o‘qidingiz, endi Coding Workspace’da Decimal pul hisobi yoki xavfsiz kesh funksiyasini real server testlaridan o‘tkazing.',
        cta: 'Coding Workspace’ga o‘tish',
        target: 'workspace' as const,
      };
    }
    if (academyState.completedProjectTasks.length < 2) {
      return {
        title: 'Real Loyiha Kanban topshirig‘ini bajaring',
        reason:
          'Mustaqil muhandis bo‘lish uchun alohida mashqlardan real loyihaga o‘ting (CLI Contact Book yoki Django Blog).',
        cta: 'Loyiha Studiyasini ochish',
        target: 'projects' as const,
      };
    }
    if (
      academyState.solvedBugs.length === 0 ||
      academyState.completedReviews.length === 0
    ) {
      return {
        title: 'Xato ovlash va Code Review ko‘nikmasini oshiring',
        reason:
          'Kod yozish yaxshi ketmoqda, lekin haqiqiy jamoada PR tekshirish va stack trace o‘qish hal qiluvchi rol o‘ynaydi.',
        cta: 'Debug & Code Review Lab',
        target: 'academy' as const,
      };
    }
    return {
      title: `${currentTier.level} → ${nextTier ? nextTier.level : 'Architect'} bosqichi`,
      reason: currentTier.recommendedAction,
      cta: 'Tavsiya etilgan bo‘limga o‘tish',
      target: currentTier.targetSection,
    };
  })();

  const metricRows = [
    {
      label: '12-Bosqichli Chuqur Darslar',
      done: academyState.completedLessons.length,
      total: DEEP_LESSONS.length,
      icon: BookOpen,
      target: 'lessons' as const,
    },
    {
      label: 'Amaliy Kod Mashqlari (Python sandbox)',
      done: academyState.solvedExercises.length,
      total: WORKSPACE_EXERCISES.length,
      icon: Code2,
      target: 'workspace' as const,
    },
    {
      label: 'Real Loyihalar Kanban Vazifalari',
      done: academyState.completedProjectTasks.length,
      total: totalProjectTasks,
      icon: FolderGit2,
      target: 'projects' as const,
    },
    {
      label: 'Debugging Akademiyasi',
      done: academyState.solvedBugs.length,
      total: DEBUG_SCENARIOS.length,
      icon: Bug,
      target: 'academy' as const,
    },
    {
      label: 'Code Review (PR Tahlili)',
      done: academyState.completedReviews.length,
      total: CODE_REVIEW_CASES.length,
      icon: SearchCheck,
      target: 'academy' as const,
    },
    {
      label: 'Production Incident Simulyatsiyasi',
      done: academyState.solvedIncidents.length,
      total: PRODUCTION_INCIDENTS.length,
      icon: ServerCrash,
      target: 'academy' as const,
    },
  ];

  return (
    <div className="max-w-[1260px] mx-auto px-5 md:px-[6.5vw] pt-4 pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            INTERACTIVE ROADMAP &amp; PERSONAL LEARNING DASHBOARD
          </p>
          <h2
            className="mt-2.5 text-[clamp(26px,2.7vw,42px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Shaxsiy Muhandislik <em className="italic">Yo‘l Xaritasi</em> va
            Yutuqlar.
          </h2>
          <p className="mt-2 text-sm text-[var(--body)] max-w-2xl leading-relaxed">
            Bu yerda darajangiz shunchaki test belgilashga emas, real Python
            kodlari, loyiha vazifalari, debugging va Code Review amaliyotiga
            asoslanadi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="liquid-glass-pill px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono">
            <Flame className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-[var(--muted)]">Streak:</span>
            <span className="font-semibold text-[var(--ink)]">
              {academyState.streakDays} kun
            </span>
          </div>
          <div className="liquid-glass-pill px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono">
            <Trophy className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-[var(--muted)]">Jami XP:</span>
            <span className="font-semibold text-[var(--ink)] tabular-nums">
              {effectiveXp} XP
            </span>
          </div>
          <div className="liquid-glass-pill px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono">
            <Award className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-[var(--muted)]">Yutuqlar:</span>
            <span className="font-semibold text-[var(--ink)] tabular-nums">
              {unlockedCount} / {ACHIEVEMENT_BADGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Top Row: Current Level + Smart Prerequisite Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 liquid-glass rounded-[24px] p-5 md:p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
                JORIY MUHANDISLIK DARAJANGIZ
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                Asosiy modullar: {completedModulesCount}/{totalModulesCount}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <h3
                className="text-2xl md:text-3xl font-normal text-[var(--ink)]"
                style={{fontFamily: 'var(--serif)'}}
              >
                {currentTier.level}
              </h3>
              <span className="text-sm font-mono text-[var(--muted)]">
                — {currentTier.titleUz}
              </span>
            </div>
            <ul className="mt-4 space-y-1.5 m-0 p-0 list-none">
              {currentTier.outcomes.map((out) => (
                <li
                  key={out}
                  className="flex items-start gap-2 text-xs md:text-sm text-[var(--body)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-[var(--hairline)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--muted)]">
                {nextTier
                  ? `Keyingi daraja: ${nextTier.level} (${nextTier.minXp} XP)`
                  : 'Maksimal darajaga yetdingiz!'}
              </span>
              <span className="text-[var(--ink)] font-semibold tabular-nums">
                {progressToNext}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-black/[0.08] dark:bg-white/[0.1] overflow-hidden">
              <div
                className="h-full bg-[#FF5A1F] rounded-full transition-all duration-500"
                style={{width: `${progressToNext}%`}}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 liquid-glass rounded-[24px] p-5 md:p-6 flex flex-col justify-between gap-4 border border-[#FF5A1F]/30">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-[#FF5A1F]">
              <Compass className="w-4 h-4" />
              <span>AQLLI YO‘NALTIRUVCHI (PREREQUISITE CHECK)</span>
            </div>
            <h3
              className="mt-2.5 text-xl font-normal text-[var(--ink)]"
              style={{fontFamily: 'var(--serif)'}}
            >
              {smartSuggestion.title}
            </h3>
            <p className="mt-2 text-xs md:text-sm leading-relaxed text-[var(--body)]">
              {smartSuggestion.reason}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onJumpToView(smartSuggestion.target)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.3)] self-start"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{smartSuggestion.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Practice Breakdown Metrics */}
      <div className="liquid-glass rounded-[24px] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--hairline)]">
          <h3 className="text-sm font-mono uppercase tracking-[0.06em] text-[var(--ink)]">
            Amaliyot bo‘yicha batafsil ko‘rsatkichlar
          </h3>
          <span className="text-xs font-mono text-[var(--muted)]">
            Server bilan sinxronlangan holat
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metricRows.map((m) => {
            const Icon = m.icon;
            const pct = Math.round((m.done / Math.max(1, m.total)) * 100);
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => onJumpToView(m.target)}
                className="text-left p-4 rounded-2xl border border-[var(--hairline)] bg-black/[0.02] dark:bg-white/[0.025] hover:border-[#FF5A1F]/45 transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--ink)]">
                    <Icon className="w-4 h-4 text-[#FF5A1F]" />
                    <span>{m.label}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[var(--ink)] tabular-nums">
                    {m.done}/{m.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.1] overflow-hidden">
                  <div
                    className="h-full bg-[#FF5A1F] rounded-full transition-all duration-300"
                    style={{width: `${pct}%`}}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6-Tier Interactive Learning Roadmap */}
      <div className="space-y-4">
        <div>
          <p className="eyebrow">6 BOSQICHLI TO‘LIQ MUHANDISLIK XARITASI</p>
          <h3
            className="mt-1.5 text-xl md:text-2xl font-normal text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Absolute Beginner → Expert Roadmap
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_TIERS.map((tier, idx) => {
            const unlocked = effectiveXp >= tier.minXp;
            const isCurrent = idx === currentTierIndex;
            return (
              <div
                key={tier.id}
                className={`liquid-glass rounded-[22px] p-5 flex flex-col justify-between gap-4 border ${
                  isCurrent
                    ? 'border-[#FF5A1F]/70 shadow-[0_8px_28px_rgba(255,90,31,0.12)]'
                    : 'border-[var(--glass-border)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span
                      className={
                        unlocked ? 'text-[#FF5A1F] font-semibold' : 'text-[var(--muted)]'
                      }
                    >
                      BOSQICH 0{idx + 1} · {tier.minXp} XP
                    </span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF5A1F] text-white text-[10px]">
                        HOZIRGI
                      </span>
                    ) : unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[var(--muted)]" />
                    )}
                  </div>

                  <div>
                    <h4
                      className="text-lg font-medium text-[var(--ink)]"
                      style={{fontFamily: 'var(--serif)'}}
                    >
                      {tier.level}
                    </h4>
                    <p className="text-xs font-mono text-[var(--muted)]">
                      {tier.titleUz}
                    </p>
                  </div>

                  <ul className="space-y-1.5 m-0 p-0 list-none">
                    {tier.outcomes.map((o) => (
                      <li
                        key={o}
                        className="flex items-start gap-2 text-xs text-[var(--body)] leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onJumpToView(tier.targetSection)}
                  className="pt-3 border-t border-[var(--hairline)] flex items-center justify-between text-xs font-medium text-[#FF5A1F] hover:underline cursor-pointer"
                >
                  <span className="text-left">{tier.recommendedAction}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9 Achievement Badges */}
      <div className="space-y-4">
        <div>
          <p className="eyebrow">AMALIY YUTUQLAR (9 TA BADGE)</p>
          <h3
            className="mt-1.5 text-xl md:text-2xl font-normal text-[var(--ink)]"
            style={{fontFamily: 'var(--serif)'}}
          >
            Olingan va navbatdagi nishonlar
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = badge.checkUnlocked(badgeStats);
            return (
              <div
                key={badge.id}
                className={`rounded-[20px] p-4 border transition-all ${
                  unlocked
                    ? 'liquid-glass border-[#FF5A1F]/50'
                    : 'border-[var(--hairline)] bg-black/[0.015] dark:bg-white/[0.015] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        unlocked
                          ? 'bg-[#FF5A1F] text-white shadow-[0_4px_12px_rgba(255,90,31,0.3)]'
                          : 'bg-black/[0.06] dark:bg-white/[0.08] text-[var(--muted)]'
                      }`}
                    >
                      {unlocked ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--ink)]">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-[var(--muted)]">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 pt-2.5 border-t border-[var(--hairline)] text-[11px] font-mono text-[var(--body)]">
                  Shart: {badge.criteria}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
