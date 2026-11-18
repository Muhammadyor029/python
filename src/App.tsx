import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AnimatePresence, MotionConfig, motion} from 'motion/react';
import {
  BookOpen,
  ChevronDown,
  Compass,
  Cpu,
  FolderGit2,
  Moon,
  ShieldAlert,
  Sun,
  Terminal,
} from 'lucide-react';
import {CurriculumSections} from './components/CurriculumSections';
import {ActiveView, DashboardOverview} from './components/DashboardOverview';
import {HeroDisintegrationStage} from './components/HeroDisintegrationStage';
import type {VisualLabKey} from './components/InteractiveVisualLabs';
import {CURRICULUM_MODULES} from './data/curriculum';
import {
  AcademyProgressCategory,
  AcademyState,
  fetchServerAcademyState,
  loadLocalAcademyState,
  postServerProgress,
  saveLocalAcademyState,
} from './data/academyApi';

interface ModalInfo {
  title: string;
  body: string;
  actionLabel: string;
  targetView: ActiveView;
}

const MODAL_CONTENT: Record<string, ModalInfo> = {
  Start: {
    title: 'PAIMON 2.0 — Interaktiv Backend Engineering Akademiyasi',
    body: 'Sizga oldindan hech qanday tajriba shart emas. 12-bosqichli Chuqur Darslik, 5 ta Visual Lab, Python & SQLite Sandbox IDE, 6 ta Real Loyiha (Kanban bilan), Debugging, Code Review hamda Production Incident laboratoriyalari orqali mustaqil backend muhandisiga aylaning.',
    actionLabel: '12-Bosqichli Darslikni ochish',
    targetView: 'lessons',
  },
  SignIn: {
    title: 'Paimon o‘quvchi kabineti',
    body: 'O‘zlashtirgan darslaringiz, Python IDE yechimlaringiz, loyiha vazifalaringiz, XP ballaringiz va yutuqlaringiz brauzer va server sessiyasida sinxron saqlanadi.',
    actionLabel: 'Shaxsiy Roadmap & Profilga o‘tish',
    targetView: 'roadmap',
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const STUDIO_MENU_ITEMS: {
  view: ActiveView;
  label: string;
  sub: string;
  icon: React.ComponentType<{className?: string}>;
}[] = [
  {
    view: 'lessons',
    label: '12-Bosqichli Darslik',
    sub: '5 kod darajasi + Python tajriba',
    icon: BookOpen,
  },
  {
    view: 'visuals',
    label: 'Visual Lablar (5 ta)',
    sub: 'Stack/Heap, ORM SQLite, B-Tree',
    icon: Cpu,
  },
  {
    view: 'workspace',
    label: 'Guided Coding Workspace',
    sub: '3-ustunli Python sandbox IDE',
    icon: Terminal,
  },
  {
    view: 'projects',
    label: '6 ta Real Loyiha + Kanban',
    sub: 'CLI dan Multi-Tenant SaaS gacha',
    icon: FolderGit2,
  },
  {
    view: 'academy',
    label: 'Debug · Code Review · Prod',
    sub: 'Stack trace, PR tahlil, Docker',
    icon: ShieldAlert,
  },
  {
    view: 'roadmap',
    label: 'Roadmap & Shaxsiy Profil',
    sub: '6 daraja, XP va 9 ta yutuq',
    icon: Compass,
  },
];

const STUDIO_VIEWS: ActiveView[] = STUDIO_MENU_ITEMS.map((m) => m.view);

function parseViewFromHash(): ActiveView {
  if (typeof window === 'undefined') return 'dashboard';
  const h = window.location.hash.replace('#', '');
  if (
    h === 'hammasi' ||
    h === 'python' ||
    h === 'django' ||
    h === 'api' ||
    h === 'lessons' ||
    h === 'visuals' ||
    h === 'workspace' ||
    h === 'projects' ||
    h === 'academy' ||
    h === 'roadmap'
  ) {
    return h;
  }
  return 'dashboard';
}

export default function App() {
  const scrollTimerRef = useRef<number | null>(null);
  const studioMenuRef = useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<ActiveView>(parseViewFromHash);
  const [activeVisualLab, setActiveVisualLab] =
    useState<VisualLabKey>('python-visual');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [studioMenuOpen, setStudioMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [academyState, setAcademyState] = useState<AcademyState>(() =>
    loadLocalAcademyState()
  );

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved =
        localStorage.getItem('paimon-theme') ||
        localStorage.getItem('distill-theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore storage access issues
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('paimon-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage access issues
    }
  }, [isDark]);

  // Close studio dropdown on outside click or Escape
  useEffect(() => {
    if (!studioMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        studioMenuRef.current &&
        !studioMenuRef.current.contains(e.target as Node)
      ) {
        setStudioMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStudioMenuOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [studioMenuOpen]);

  // Sync academy progress with backend state store on mount
  useEffect(() => {
    let active = true;
    fetchServerAcademyState().then((serverState) => {
      if (!active || !serverState) return;
      saveLocalAcademyState(serverState);
      setAcademyState(serverState);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearInterval(scrollTimerRef.current);
      }
    };
  }, []);

  const recordAcademyProgress = useCallback(
    (category: AcademyProgressCategory, id: string, xpDelta = 25) => {
      setAcademyState((prev) => {
        const already = prev[category].includes(id);
        if (already) return prev;
        const next: AcademyState = {
          ...prev,
          [category]: [...prev[category], id],
          xp: prev.xp + xpDelta,
          lastActiveDate: new Date().toISOString().slice(0, 10),
        };
        saveLocalAcademyState(next);
        return next;
      });

      void postServerProgress(category, id, xpDelta).then((serverUpdated) => {
        if (!serverUpdated) return;
        saveLocalAcademyState(serverUpdated);
        setAcademyState(serverUpdated);
      });
    },
    []
  );

  const handleMarkModuleCompleted = useCallback(
    (id: string) => {
      recordAcademyProgress('completedModules', id, 20);
    },
    [recordAcademyProgress]
  );

  const handleSelectView = useCallback(
    (view: ActiveView, scrollTargetId?: string) => {
      setActiveModal(null);
      setStudioMenuOpen(false);
      setActiveView(view);
      if (scrollTimerRef.current) {
        window.clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }

      try {
        const nextHash = view === 'dashboard' ? '#dashboard' : `#${view}`;
        if (window.location.hash !== nextHash) {
          window.history.pushState(null, '', nextHash);
        }
      } catch {
        // ignore history error
      }

      if (scrollTargetId) {
        let attempts = 0;
        const tryScroll = () => {
          const target = document.getElementById(scrollTargetId);
          if (target) {
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
            if (scrollTimerRef.current) {
              window.clearInterval(scrollTimerRef.current);
              scrollTimerRef.current = null;
            }
            return true;
          }
          return false;
        };

        if (!tryScroll()) {
          scrollTimerRef.current = window.setInterval(() => {
            attempts += 1;
            if (tryScroll() || attempts >= 18) {
              if (scrollTimerRef.current) {
                window.clearInterval(scrollTimerRef.current);
                scrollTimerRef.current = null;
              }
            }
          }, 40);
        }
      } else {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    },
    []
  );

  useEffect(() => {
    const onHashOrPop = () => {
      setActiveView(parseViewFromHash());
      setStudioMenuOpen(false);
    };
    window.addEventListener('hashchange', onHashOrPop);
    window.addEventListener('popstate', onHashOrPop);
    return () => {
      window.removeEventListener('hashchange', onHashOrPop);
      window.removeEventListener('popstate', onHashOrPop);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentModal = activeModal ? MODAL_CONTENT[activeModal] : null;

  const activeTestTarget =
    activeView === 'python' || activeView === 'django' || activeView === 'api'
      ? {view: activeView, id: `${activeView}-test`}
      : {view: 'hammasi' as ActiveView, id: 'hammasi-test'};

  const isStudioActive = STUDIO_VIEWS.includes(activeView);

  return (
    <MotionConfig reducedMotion="user">
      <div>
        {/* Sticky Liquid Glass Nav */}
        <header
          className={`nav ${
            scrolled || activeView !== 'dashboard' ? 'nav-scrolled' : ''
          }`}
        >
          <a
            href="#dashboard"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              handleSelectView('dashboard');
            }}
          >
            {/* Genshin Impact Paimon inspired Star-Crown & Halo Emblem */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="32"
                cy="16"
                rx="17"
                ry="5.5"
                transform="rotate(-8 32 16)"
                stroke="#FF5A1F"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="70 11"
              />
              <path
                d="M32 22C33.8 31 37 34.2 46 36C37 37.8 33.8 41 32 50C30.2 41 27 37.8 18 36C27 34.2 30.2 31 32 22Z"
                fill="currentColor"
              />
              <circle cx="32" cy="36" r="3" fill="#FF5A1F" />
              <path
                d="M15 47C19.5 44.5 23.5 46 26 49.5"
                stroke="#FF5A1F"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M49 47C44.5 44.5 40.5 46 38 49.5"
                stroke="#FF5A1F"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
            <span>Paimon</span>
          </a>

          <nav className="nav-links" aria-label="Asosiy menyu">
            {(
              [
                ['dashboard', 'Dashboard'],
                ['hammasi', '1. Barcha Mavzular'],
                ['python', '2. Python'],
                ['django', '3. Django & SQL'],
                ['api', '4. API (DRF)'],
              ] as const
            ).map(([viewKey, label]) => (
              <button
                key={viewKey}
                type="button"
                className={`nav-link ${
                  activeView === viewKey ? 'nav-link-active' : ''
                }`}
                onClick={() => handleSelectView(viewKey)}
              >
                <span>{label}</span>
              </button>
            ))}

            {/* 2.0 Studiyalar Dropdown in Navbar */}
            <div ref={studioMenuRef} className="nav-studio-wrap">
              <button
                type="button"
                aria-expanded={studioMenuOpen}
                aria-haspopup="menu"
                className={`nav-link ${isStudioActive ? 'nav-link-active' : ''}`}
                onClick={() => setStudioMenuOpen((o) => !o)}
              >
                <span>2.0 Studiyalar</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    studioMenuOpen ? 'rotate-180 text-[#FF5A1F]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {studioMenuOpen && (
                  <motion.div
                    initial={{opacity: 0, y: 8, scale: 0.96}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 6, scale: 0.96}}
                    transition={{duration: 0.2, ease: EASE}}
                    role="menu"
                    className="nav-studio-menu"
                  >
                    {STUDIO_MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = activeView === item.view;
                      return (
                        <button
                          key={item.view}
                          type="button"
                          role="menuitem"
                          onClick={() => handleSelectView(item.view)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 cursor-pointer transition-colors ${
                            active
                              ? 'bg-[#FF5A1F] text-white'
                              : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[var(--ink)]'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              active ? 'text-white' : 'text-[#FF5A1F]'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-medium leading-tight">
                              {item.label}
                            </div>
                            <div
                              className={`text-[10.5px] font-mono mt-0.5 ${
                                active ? 'text-white/85' : 'text-[var(--muted)]'
                              }`}
                            >
                              {item.sub}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle liquid-glass-pill"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={
                isDark ? 'Kunduzgi rejimga o‘tish' : 'Tungi rejimga o‘tish'
              }
              title={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span className="theme-toggle-text">Kunduzgi</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span className="theme-toggle-text">Tungi</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="nav-signin"
              onClick={() => handleSelectView('roadmap')}
            >
              Profil · {academyState.xp} XP
            </button>

            <button
              type="button"
              className="nav-trial liquid-glass-pill"
              onClick={() => handleSelectView('workspace')}
            >
              Python IDE
            </button>
            <button
              type="button"
              className="nav-demo"
              onClick={() =>
                handleSelectView(activeTestTarget.view, activeTestTarget.id)
              }
            >
              Random Testlar
            </button>
          </div>
        </header>

        {/* DASHBOARD vs FOCUSED SECTION VIEW */}
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <motion.div
              key="view-dashboard"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.25, ease: EASE}}
            >
              <HeroDisintegrationStage
                isDark={isDark}
                onScrollToDashboard={() => {
                  const el = document.getElementById('dashboard');
                  el?.scrollIntoView({behavior: 'smooth'});
                }}
              />

              <DashboardOverview
                onSelectView={handleSelectView}
                completedModuleCount={academyState.completedModules.length}
                totalModuleCount={CURRICULUM_MODULES.length}
                academyState={academyState}
                isDark={isDark}
                onToggleTheme={() => setIsDark((prev) => !prev)}
                onOpenModal={(key) => setActiveModal(key)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="view-section"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.22, ease: EASE}}
            >
              <CurriculumSections
                activeSection={activeView}
                onSelectView={handleSelectView}
                completedIds={academyState.completedModules}
                onMarkModuleCompleted={handleMarkModuleCompleted}
                academyState={academyState}
                onCompleteLesson={(id) =>
                  recordAcademyProgress('completedLessons', id, 30)
                }
                onSolveExercise={(id) =>
                  recordAcademyProgress('solvedExercises', id, 45)
                }
                onCompleteProjectTask={(id) =>
                  recordAcademyProgress('completedProjectTasks', id, 50)
                }
                onSolveBug={(id) => recordAcademyProgress('solvedBugs', id, 40)}
                onCompleteReview={(id) =>
                  recordAcademyProgress('completedReviews', id, 40)
                }
                onSolveIncident={(id) =>
                  recordAcademyProgress('solvedIncidents', id, 55)
                }
                activeVisualLab={activeVisualLab}
                onSelectVisualLab={setActiveVisualLab}
                isDark={isDark}
                onToggleTheme={() => setIsDark((prev) => !prev)}
                onOpenModal={(key) => setActiveModal(key)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liquid Glass Modal */}
        <AnimatePresence>
          {currentModal && (
            <motion.div
              key="modal-backdrop"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.22, ease: EASE}}
              className="modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                key="modal-card"
                initial={{opacity: 0, scale: 0.96, y: 10}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.96, y: 8}}
                transition={{duration: 0.26, ease: EASE}}
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2
                    id="modal-title"
                    className="text-xl font-medium tracking-tight text-[var(--ink)]"
                    style={{fontFamily: 'var(--serif)'}}
                  >
                    {currentModal.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Oynani yopish"
                    className="text-sm text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--body)]">
                  {currentModal.body}
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="liquid-glass-pill h-9 px-4 rounded-full text-xs font-medium text-[var(--body)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Yopish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView(currentModal.targetView)}
                    className="h-9 px-4 rounded-full text-xs font-medium text-white bg-[#FF5A1F] hover:brightness-105 cursor-pointer"
                  >
                    {currentModal.actionLabel}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
