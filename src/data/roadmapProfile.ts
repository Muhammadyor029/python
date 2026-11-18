export interface LearningTier {
  id: string;
  level:
    | 'Absolute Beginner'
    | 'Beginner'
    | 'Intermediate'
    | 'Upper Intermediate'
    | 'Advanced'
    | 'Expert';
  titleUz: string;
  minXp: number;
  outcomes: string[];
  recommendedAction: string;
  targetSection: 'hammasi' | 'python' | 'django' | 'api' | 'visuals' | 'workspace' | 'projects' | 'academy';
}

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  criteria: string;
  checkUnlocked: (stats: {
    xp: number;
    lessonsCount: number;
    exercisesCount: number;
    projectsCount: number;
    bugsCount: number;
    reviewsCount: number;
    incidentsCount: number;
    modulesCount: number;
  }) => boolean;
}

export const LEARNING_TIERS: LearningTier[] = [
  {
    id: 'tier-abs-beginner',
    level: 'Absolute Beginner',
    titleUz: '0-bosqich: Birinchi qadamlar',
    minXp: 0,
    outcomes: [
      'print("Salom, Dunyo!") va Python dasturini ishga tushirish',
      'int, float, Decimal, str, bool turlarini hayotiy misollar bilan farqlash',
    ],
    recommendedAction: '2. Python -> Jonli turlar qutisini sinab ko‘ring',
    targetSection: 'python',
  },
  {
    id: 'tier-beginner',
    level: 'Beginner',
    titleUz: 'Python Beginner',
    minXp: 75,
    outcomes: [
      'O‘zgaruvchilarni reference sifatida tushunish (`is` vs `==`)',
      'Shartlar, sikllar, funksiyalar va xavfsiz `list/dict` kodlari yozish',
      'Python sandbox da oddiy CLI dasturlar yaratish',
    ],
    recommendedAction: 'Coding Workspace da 1-masalani (Decimal) yeching',
    targetSection: 'workspace',
  },
  {
    id: 'tier-intermediate',
    level: 'Intermediate',
    titleUz: 'Django Junior',
    minXp: 200,
    outcomes: [
      'Django Request Lifecycle va Middleware zanjirini anglash',
      'Model, Migration, Admin, URLs, Views va CRUD yaratish',
      'Authentication va PostgreSQL asosiy SQL jadvallari bilan ishlash',
    ],
    recommendedAction: 'Django Visual Lab & Project 02 ni boshlang',
    targetSection: 'visuals',
  },
  {
    id: 'tier-upper-int',
    level: 'Upper Intermediate',
    titleUz: 'DRF Middle Engineer',
    minXp: 380,
    outcomes: [
      'Murakkab 3-bosqichli Serializer validatsiyasi yozish',
      'Custom Object Permissions va IDOR himoyasi o‘rnatish',
      'ORM QuerySet N+1 muammosini `select_related` / `prefetch_related` bilan yopish',
    ],
    recommendedAction: '4. API (DRF) va ORM Visual Lab (Real SQLite) ni bajaring',
    targetSection: 'api',
  },
  {
    id: 'tier-advanced',
    level: 'Advanced',
    titleUz: 'Senior Performance & Debug',
    minXp: 600,
    outcomes: [
      'PostgreSQL B-tree/GIN/BRIN indekslar va MVCC/VACUUM optimizatsiyasi',
      'Celery + Redis asinxron navbatlar va `transaction.on_commit`',
      'Murakkab stack trace debugging va Code Review o‘tkazish',
    ],
    recommendedAction: 'Debugging & Code Review Akademiyasida PR tekshiring',
    targetSection: 'academy',
  },
  {
    id: 'tier-expert',
    level: 'Expert',
    titleUz: 'Backend Systems Architect',
    minXp: 900,
    outcomes: [
      'Multi-tenant SaaS, RBAC, Audit Logging va API Versioning loyihalash',
      'Docker, Nginx, Gunicorn va Production slow-query incidentlarini hal qilish',
    ],
    recommendedAction: 'Project 06 SaaS & Production Incident Lab ni yakunlang',
    targetSection: 'projects',
  },
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'ach-first-py',
    title: 'First Python Program',
    subtitle: 'Birinchi haqiqiy Python kod muvaffaqiyati',
    criteria: 'Coding Workspace’da kamida 1 ta real Python testini o‘ting',
    checkUnlocked: (s) => s.exercisesCount >= 1,
  },
  {
    id: 'ach-py-core',
    title: 'Python Core Master',
    subtitle: 'Xotira, Decorator va ma’lumot turlari ustasi',
    criteria: 'Kamida 2 ta chuqur dars yoki 2 ta modulni yakunlang',
    checkUnlocked: (s) => s.lessonsCount >= 2 || s.modulesCount >= 2,
  },
  {
    id: 'ach-django-dev',
    title: 'Django Developer',
    subtitle: 'MVT, Request Lifecycle va ORM bilimdoni',
    criteria: 'Kamida 1 ta Loyiha Kanban vazifasini yakunlang',
    checkUnlocked: (s) => s.projectsCount >= 1,
  },
  {
    id: 'ach-api-eng',
    title: 'API Engineer',
    subtitle: 'Serializer, JWT va IDOR xavfsizlik muhandisi',
    criteria: 'Kamida 2 ta real kod mashqi va 1 ta Code Review bajaring',
    checkUnlocked: (s) => s.exercisesCount >= 2 && s.reviewsCount >= 1,
  },
  {
    id: 'ach-db-explorer',
    title: 'Database Explorer',
    subtitle: 'PostgreSQL Index, JOIN va N+1 optimizatori',
    criteria: 'ORM/PostgreSQL darsi yoki SQL mashqini yakunlang',
    checkUnlocked: (s) => s.lessonsCount >= 3 || s.exercisesCount >= 3,
  },
  {
    id: 'ach-debug-spec',
    title: 'Debugging Specialist',
    subtitle: 'Stack trace va Deadlock ovchisi',
    criteria: 'Debugging Akademiyasida kamida 1 ta xatoni tuzating',
    checkUnlocked: (s) => s.bugsCount >= 1,
  },
  {
    id: 'ach-docker-prac',
    title: 'Docker Practitioner',
    subtitle: 'Konteyner va Production deploy amaliyotchisi',
    criteria: 'Production Simulation Lab’da kamida 1 ta incidentni yeching',
    checkUnlocked: (s) => s.incidentsCount >= 1,
  },
  {
    id: 'ach-prod-ready',
    title: 'Production Ready',
    subtitle: 'Code Review + Debug + Amaliy kod uyg‘unligi',
    criteria: 'Jami kamida 250 XP to‘plang',
    checkUnlocked: (s) => s.xp >= 250,
  },
  {
    id: 'ach-architect',
    title: 'Backend Architect',
    subtitle: 'PAIMON 2.0 oliy muhandislik darajasi',
    criteria: 'Jami kamida 500 XP va 3 ta turli yo‘nalish yutug‘i',
    checkUnlocked: (s) =>
      s.xp >= 500 && s.lessonsCount >= 3 && s.projectsCount >= 2 && s.bugsCount >= 1,
  },
];
