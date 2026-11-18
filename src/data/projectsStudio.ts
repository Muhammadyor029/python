export type KanbanColumn =
  | 'Backlog'
  | 'To Do'
  | 'In Progress'
  | 'Testing'
  | 'Completed';

export interface ProjectKanbanTask {
  id: string;
  title: string;
  defaultColumn: KanbanColumn;
  difficulty: 'Oson' | 'O‘rta' | 'Murakkab';
  description: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  hint: string;
  starterSnippet: string;
  testCode: string;
  solutionSnippet: string;
}

export interface ProjectEREntity {
  table: string;
  columns: string[];
  relations: string[];
}

export interface BackendProjectSpec {
  id: string;
  number: string;
  title: string;
  stack: string[];
  level: string;
  brief: string;
  businessRequirements: string[];
  architecture: string;
  erEntities: ProjectEREntity[];
  folderStructure: string;
  roadmapSteps: string[];
  tasks: ProjectKanbanTask[];
  codeReviewChecklist: string[];
  finalEvaluationCriteria: string[];
}

export const BACKEND_PROJECTS: BackendProjectSpec[] = [
  {
    id: 'proj-01-cli',
    number: 'PROJECT 01',
    title: 'Python CLI — Contact Management System',
    stack: ['Python 3.12', 'OOP', 'JSON', 'Exceptions', 'unittest'],
    level: 'Beginner',
    brief:
      'Terminal orqali ishlaydigan, kontaktlarni JSON faylida saqlaydigan, qidiradigan, telefon raqamini validatsiya qiladigan va unittest bilan tekshiriladigan to‘liq Python CLI ilovasi.',
    businessRequirements: [
      'Kontakt qo‘shish (ism, telefon +998..., email) va dublikat telefonni rad etish.',
      'Ism yoki telefon bo‘yicha tez qidirish hamda o‘chirish.',
      'Ma’lumotlarni `contacts.json` da saqlash va xato kiritilganda custom exception chiqarish.',
    ],
    architecture:
      'Modular CLI → Service Layer (`ContactBook`) → Validation (`validators.py`) → JSON Storage (`storage.py`).',
    erEntities: [
      {
        table: 'Contact (dataclass)',
        columns: ['id: str (UUID)', 'name: str', 'phone: str', 'email: str'],
        relations: ['ContactBook 1 ──< N Contact'],
      },
    ],
    folderStructure: `contact_cli/
├── main.py
├── models.py
├── services.py
├── validators.py
├── storage.py
└── tests/
    └── test_services.py`,
    roadmapSteps: [
      '1. Project Structure & Dataclass',
      '2. Telefon/Email Validators & Custom Exception',
      '3. ContactBook Service (CRUD + Search)',
      '4. JSON Storage (Serialization)',
      '5. CLI Menu & unittest Verification',
    ],
    tasks: [
      {
        id: 'p1-t1',
        title: 'Custom Exception & Telefon Validatsiyasi',
        defaultColumn: 'In Progress',
        difficulty: 'Oson',
        description:
          '`InvalidPhoneError` va +998 bilan boshlanuvchi 13 belgili telefon raqamini tekshiruvchi `validate_phone(phone)` yozing.',
        acceptanceCriteria: [
          'Noto‘g‘ri raqamda `InvalidPhoneError(ValueError)` ko‘tarilsin.',
          'To‘g‘ri raqam bo‘lsa bo‘shliqlarsiz formatlangan satr qaytsin.',
        ],
        dependencies: ['Project Structure'],
        hint: '`.replace(" ", "")` qilib `startswith("+998")` va `len == 13` hamda `[1:].isdigit()` ni tekshiring.',
        starterSnippet: `class InvalidPhoneError(ValueError):
    pass

def validate_phone(phone: str) -> str:
    clean = phone.replace(" ", "").strip()
    # TODO: +998901234567 formatini tekshiring
    return clean

print(validate_phone("+998 90 123 45 67"))`,
        testCode: `assert validate_phone("+998 90 123 45 67") == "+998901234567"
try:
    validate_phone("90123")
    assert False, "Xato raqamda InvalidPhoneError chiqishi kerak"
except InvalidPhoneError:
    pass`,
        solutionSnippet: `class InvalidPhoneError(ValueError):
    pass

def validate_phone(phone: str) -> str:
    clean = phone.replace(" ", "").strip()
    if not (clean.startswith("+998") and len(clean) == 13 and clean[1:].isdigit()):
        raise InvalidPhoneError(f"Noto'g'ri raqam: {phone}")
    return clean`,
      },
      {
        id: 'p1-t2',
        title: 'ContactBook CRUD & JSON Export/Import',
        defaultColumn: 'To Do',
        difficulty: 'O‘rta',
        description:
          '`ContactBook` klassida kontakt qo‘shish, ism bo‘yicha qidirish va JSON satrga aylantirish (`to_json`) metodlarini yarating.',
        acceptanceCriteria: [
          'Bir xil telefon raqamli kontakt qayta qo‘shilsa `ValueError` bersin.',
          '`search(query)` katta-kichik harfga qaramasdan topsin.',
        ],
        dependencies: ['p1-t1'],
        hint: '`self.contacts` lug‘atida telefon raqamini kalit qilib saqlash O(1) dublikat tekshiruvi beradi.',
        starterSnippet: `import json

class ContactBook:
    def __init__(self):
        self.items = {}

    def add(self, name: str, phone: str):
        # TODO: dublikat tekshiring va saqlang
        self.items[phone] = {"name": name, "phone": phone}

    def search(self, query: str) -> list[dict]:
        # TODO: case-insensitive qidiruv
        return []

    def to_json(self) -> str:
        return json.dumps(list(self.items.values()), ensure_ascii=False)`,
        testCode: `book = ContactBook()
book.add("Aziz", "+998901112233")
assert len(book.search("aziz")) == 1
try:
    book.add("Aziz 2", "+998901112233")
    assert False, "Dublikat telefon rad etilishi kerak"
except ValueError:
    pass`,
        solutionSnippet: `import json

class ContactBook:
    def __init__(self):
        self.items = {}

    def add(self, name: str, phone: str):
        if phone in self.items:
            raise ValueError("Bu telefon raqam allaqachon mavjud")
        self.items[phone] = {"name": name, "phone": phone}

    def search(self, query: str) -> list[dict]:
        q = query.lower()
        return [c for c in self.items.values() if q in c["name"].lower() or q in c["phone"]]

    def to_json(self) -> str:
        return json.dumps(list(self.items.values()), ensure_ascii=False)`,
      },
    ],
    codeReviewChecklist: [
      'Foydalanuvchi kiritishini biznes mantiqdan ajratilganmi?',
      'Custom exceptionlar aniq xabar beryaptimi?',
      'Unit testlar chekka holatlarni (dublikat, bo‘sh qidiruv) tekshiryaptimi?',
    ],
    finalEvaluationCriteria: [
      'CLI orqali kontakt CRUD va JSON saqlash uzluksiz ishlaydi.',
      'Barcha `unittest` testlari 100% yashil.',
    ],
  },
  {
    id: 'proj-02-django-blog',
    number: 'PROJECT 02',
    title: 'Django Blog Platform (MVT Full-Stack)',
    stack: ['Django 5.1', 'PostgreSQL', 'Templates', 'Forms', 'Auth'],
    level: 'Intermediate',
    brief:
      '13 bosqichli to‘liq Django Blog platformasi: loyiha yaratishdan tortib Custom Models, Admin, URLs, Views, Templates, Forms, Auth, CRUD, Search, Pagination va Testlargacha.',
    businessRequirements: [
      'Mualliflar post yaratishi, tahrirlashi (faqat o‘z postini!) va qoralamada saqlashi.',
      'O‘quvchilar sarlavha/teglar bo‘yicha qidirishi (`icontains`) va sahifalash (`Paginator`).',
      'Admin panelda postlarni qidirish, filtrlash va tezkor chop etish.',
    ],
    architecture:
      'Browser → URLs (`blog/urls.py`) → CBV/FBV Views (`LoginRequiredMixin`) → Django Forms → ORM (`Post`, `Category`) → Templates.',
    erEntities: [
      {
        table: 'Post',
        columns: ['id', 'title', 'slug (unique)', 'body', 'author_id (FK)', 'status', 'created_at'],
        relations: ['User 1 ──< N Post', 'Category 1 ──< N Post'],
      },
      {
        table: 'Comment',
        columns: ['id', 'post_id (FK)', 'author_id (FK)', 'text', 'created_at'],
        relations: ['Post 1 ──< N Comment'],
      },
    ],
    folderStructure: `paimon_blog/
├── manage.py
├── config/ (settings.py, urls.py)
└── blog/
    ├── models.py
    ├── admin.py
    ├── forms.py
    ├── views.py
    ├── urls.py
    ├── templates/blog/
    └── tests.py`,
    roadmapSteps: [
      '1. Project & App',
      '2. Models & Migrations',
      '3. Admin Customization',
      '4. URLs & Views',
      '5. Templates & Forms',
      '6. Auth & Permissions',
      '7. CRUD, Search & Pagination',
      '8. Automated Django Tests',
    ],
    tasks: [
      {
        id: 'p2-t1',
        title: 'Slug va Avtomatik Status Managerli Post Modeli Mantiqi',
        defaultColumn: 'In Progress',
        difficulty: 'O‘rta',
        description:
          'Post sarlavhasidan xavfsiz URL `slug` yasaydigan (`"Django 5 Dars!"` -> `"django-5-dars"`) va qidiruv/sahifalash (`paginate(items, page, per_page)`) mantiqini yozing.',
        acceptanceCriteria: [
          'Slug faqat kichik harf, raqam va tire (`-`) dan iborat bo‘lsin.',
          'Sahifalash to‘g‘ri slice hamda `total_pages` qaytarsin.',
        ],
        dependencies: ['Models'],
        hint: '`re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")` va `math.ceil(len / per_page)` ishlating.',
        starterSnippet: `import re, math

def make_slug(title: str) -> str:
    # TODO: URL-safe slug qaytaring
    return title.lower()

def paginate_posts(posts: list, page: int, per_page: int = 5) -> dict:
    total_pages = max(1, math.ceil(len(posts) / per_page))
    # TODO: start/end indekslarni hisoblang
    return {"items": posts, "page": page, "total_pages": total_pages}`,
        testCode: `assert make_slug("Django 5: Yangi Imkoniyatlar!") == "django-5-yangi-imkoniyatlar"
res = paginate_posts(list(range(12)), page=2, per_page=5)
assert res["items"] == [5, 6, 7, 8, 9] and res["total_pages"] == 3`,
        solutionSnippet: `import re, math

def make_slug(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

def paginate_posts(posts: list, page: int, per_page: int = 5) -> dict:
    total_pages = max(1, math.ceil(len(posts) / per_page))
    start = (page - 1) * per_page
    return {"items": posts[start:start + per_page], "page": page, "total_pages": total_pages}`,
      },
    ],
    codeReviewChecklist: [
      'Edit/Delete viewlarida `obj.author == request.user` (`UserPassesTestMixin`) tekshirilganmi?',
      'Post ro‘yxatida `select_related("author")` qo‘yilganmi?',
      'Formlarda `{% csrf_token %}` mavjudmi?',
    ],
    finalEvaluationCriteria: [
      '13 bosqichning barchasi: Auth, CRUD, Search, Pagination va TestCase to‘liq ishlaydi.',
    ],
  },
  {
    id: 'proj-03-drf-api',
    number: 'PROJECT 03',
    title: 'Professional Blog REST API (DRF + JWT + Swagger)',
    stack: ['DRF 3.15', 'SimpleJWT', 'django-filter', 'drf-spectacular'],
    level: 'Upper Intermediate',
    brief:
      'Custom User, JWT auth, murakkab Serializerlar, Permissions, Filtering, CursorPagination, Search, Pytest/APITestCase va Swagger hujjatli REST API.',
    businessRequirements: [
      'Email orqali ro‘yxatdan o‘tish va JWT Access/Refresh token olish.',
      'Muallif faqat o‘z maqolasini `PATCH`/`DELETE` qila olishi (`IsAuthorOrReadOnly`).',
      '`/api/schema/swagger-ui/` orqali avtomatik OpenAPI 3.0 hujjat.',
    ],
    architecture:
      'Client → JWT Auth → Permission & Throttling → ViewSet → Serializer → Optimized QuerySet → JSON Response.',
    erEntities: [
      {
        table: 'CustomUser (AbstractUser)',
        columns: ['id', 'email (unique)', 'role', 'bio'],
        relations: ['CustomUser 1 ──< N Article'],
      },
      {
        table: 'Article',
        columns: ['id', 'author_id (FK)', 'title', 'content', 'published_at'],
        relations: ['Article N ──< M Tag'],
      },
    ],
    folderStructure: `blog_api/
├── accounts/ (models.py, serializers.py, views.py)
├── articles/ (models.py, filters.py, permissions.py, serializers.py, views.py)
└── config/ (settings.py, urls.py)`,
    roadmapSteps: [
      '1. Custom User Model (AUTH_USER_MODEL)',
      '2. SimpleJWT Access/Refresh Auth',
      '3. Article Serializer & Nested Tags',
      '4. Object Permissions & Throttling',
      '5. FilterSet, Search, CursorPagination & Swagger',
    ],
    tasks: [
      {
        id: 'p3-t1',
        title: 'Object Permission va Rate Limiter Mantiqi',
        defaultColumn: 'In Progress',
        difficulty: 'O‘rta',
        description:
          '`has_object_permission(method, user_id, owner_id)` (GET hamma uchun, yozish faqat egasiga) va oddiy sliding-window rate limiter funksiyasini yozing.',
        acceptanceCriteria: [
          'SAFE_METHODS (`GET`, `HEAD`, `OPTIONS`) hamma uchun `True`.',
          '`PUT/PATCH/DELETE` faqat `user_id == owner_id` bo‘lganda `True`.',
        ],
        dependencies: ['Custom User', 'JWT'],
        hint: '`if method in ("GET", "HEAD", "OPTIONS"): return True`.',
        starterSnippet: `def has_object_permission(method: str, user_id: int, owner_id: int) -> bool:
    # TODO: SAFE_METHODS va egasini tekshiring
    return False`,
        testCode: `assert has_object_permission("GET", 99, 1) is True
assert has_object_permission("PATCH", 1, 1) is True
assert has_object_permission("DELETE", 99, 1) is False`,
        solutionSnippet: `def has_object_permission(method: str, user_id: int, owner_id: int) -> bool:
    if method in ("GET", "HEAD", "OPTIONS"):
        return True
    return user_id == owner_id`,
      },
    ],
    codeReviewChecklist: [
      '`AUTH_USER_MODEL` birinchi migratsiyadan oldin o‘rnatilganmi?',
      'Swagger sxemada barcha error javoblar (400, 401, 403) hujjatlanganmi?',
    ],
    finalEvaluationCriteria: [
      'Postman/Swagger orqali JWT login, CRUD, Filter va Pagination xatosiz ishlaydi.',
    ],
  },
  {
    id: 'proj-04-ecommerce',
    number: 'PROJECT 04',
    title: 'E-Commerce Backend (PostgreSQL + Redis + Celery)',
    stack: ['Django', 'PostgreSQL', 'Redis', 'Celery', 'Atomic Lock'],
    level: 'Advanced',
    brief:
      'Katalog, savat, buyurtma va qoldiqni poyga sharoitisiz (`select_for_update` + `transaction.atomic`) yechish, Redis kesh va Celery asinxron chek yuborish tizimi.',
    businessRequirements: [
      'Omborda 1 dona qolgan tovarni 2 ta mijoz bir soniyada bossa ham manfiy qoldiqqa tushmasin!',
      'Buyurtma yaratilgach (`transaction.on_commit`), Celery worker email va bildirishnoma yuborsin.',
    ],
    architecture:
      'DRF OrderAPI → `transaction.atomic()` → `SELECT ... FOR UPDATE` PostgreSQL → `on_commit` → Redis → Celery Workers.',
    erEntities: [
      {
        table: 'Product',
        columns: ['id', 'sku', 'price (Decimal)', 'stock (Check >= 0)'],
        relations: ['Category 1 ──< N Product'],
      },
      {
        table: 'Order / OrderItem',
        columns: ['id', 'user_id', 'total (Decimal)', 'status', 'idempotency_key'],
        relations: ['Order 1 ──< N OrderItem'],
      },
    ],
    folderStructure: `shop_backend/
├── catalog/ (models.py, cache.py)
├── cart/ (services.py)
├── orders/ (models.py, services.py, tasks.py, views.py)
└── docker-compose.yml`,
    roadmapSteps: [
      '1. Catalog & Decimal CheckConstraint',
      '2. Redis Cart Cache Service',
      '3. Atomic Checkout & select_for_update()',
      '4. Idempotent Payment Simulation',
      '5. Celery Async Notifications',
    ],
    tasks: [
      {
        id: 'p4-t1',
        title: 'Ombor Qoldig‘ini Atomar Kamaytirish (Concurrency Safe)',
        defaultColumn: 'In Progress',
        difficulty: 'Murakkab',
        description:
          '`place_order(stock_db, items_req)` funksiyasida avval barcha mahsulotlar qoldig‘ini tekshiring; agar bittasi ham yetmasa hech birini kamaytirmasdan rollback qilib xato bering!',
        acceptanceCriteria: [
          'All-or-nothing (ACID Atomicity): 2-mahsulot yetmasa, 1-mahsulot ham kamaymasin.',
        ],
        dependencies: ['Catalog', 'Order Models'],
        hint: 'Avval tekshiruv loopi o‘tkazing, hammasi yetsagina `stock_db` ni yangilang.',
        starterSnippet: `def place_order(stock_db: dict[str, int], items: dict[str, int]) -> dict[str, int]:
    # TODO: ACID atomicity: bittasi yetmasa ham hech biri kamaymasin!
    for sku, qty in items.items():
        if stock_db.get(sku, 0) < qty:
            raise ValueError(f"{sku} omborda yetarli emas")
    for sku, qty in items.items():
        stock_db[sku] -= qty
    return stock_db`,
        testCode: `db = {"iphone": 2, "airpods": 1}
try:
    place_order(db, {"iphone": 1, "airpods": 5})
    assert False
except ValueError:
    pass
assert db["iphone"] == 2, "Rollback buzildi! iphone kamayib qolmasligi kerak edi!"`,
        solutionSnippet: `def place_order(stock_db: dict[str, int], items: dict[str, int]) -> dict[str, int]:
    for sku, qty in items.items():
        if stock_db.get(sku, 0) < qty:
            raise ValueError(f"{sku} omborda yetarli emas")
    for sku, qty in items.items():
        stock_db[sku] -= qty
    return stock_db`,
      },
    ],
    codeReviewChecklist: [
      'Narx klient JSON’dan emas, bazadagi `Product.price` dan olinyaptimi?',
      '`Celery.delay()` `transaction.on_commit()` ichidami?',
    ],
    finalEvaluationCriteria: [
      'Concurrency testida manfiy stock yuzaga kelmaydi, Celery vazifalari fonda bajariladi.',
    ],
  },
  {
    id: 'proj-05-lms',
    number: 'PROJECT 05',
    title: 'Mini PAIMON LMS — Ta’lim Platformasi Backend',
    stack: ['Django', 'DRF', 'PostgreSQL', 'Sandbox Runner'],
    level: 'Advanced',
    brief:
      'O‘zingiz foydalanayotgan PAIMON platformasining kichik backend nusxasini quring: Kurslar → Modullar → Darslar → Amaliy Topsiriqlar → Submissionlar va Progress hisobi.',
    businessRequirements: [
      'Talabaning faqat test emas, Dars + Amaliy kod + Loyiha bosqichlari bo‘yicha umumiy XP va % progressini hisoblash.',
      'Oldingi mavzu yakunlanmaganda tizim tavsiya berishi.',
    ],
    architecture:
      'LMS API → Enrollment & Prerequisite Service → Submission Grader → Progress Aggregator (`annotate(Count)`).',
    erEntities: [
      {
        table: 'Course / Lesson',
        columns: ['id', 'slug', 'order_idx', 'prerequisite_id (self FK)'],
        relations: ['Course 1 ──< N Lesson'],
      },
      {
        table: 'Submission / Progress',
        columns: ['id', 'user_id', 'lesson_id', 'passed', 'xp_earned'],
        relations: ['User 1 ──< N Submission'],
      },
    ],
    folderStructure: `mini_paimon/
├── courses/ (models.py, services.py)
├── submissions/ (models.py, grader.py, views.py)
└── analytics/ (progress.py)`,
    roadmapSteps: [
      '1. Course & Self-Referential Prerequisites',
      '2. Submission & Grading Pipeline',
      '3. Weighted Multi-Factor Progress Calculator',
      '4. Achievement Unlocking Engine',
    ],
    tasks: [
      {
        id: 'p5-t1',
        title: 'Ko‘p Omilli Progress & Prerequisite Tavsiya Dvigateli',
        defaultColumn: 'In Progress',
        difficulty: 'O‘rta',
        description:
          'Dars (30%), Amaliy kod (40%) va Loyiha vazifalari (30%) ulushidan umumiy foiz hamda qiynalayotgan talabaga `prerequisite` qaytaradigan funksiya yozing.',
        acceptanceCriteria: [
          'Vaznli progress aniq 0..100 oraliqda hisoblansin.',
        ],
        dependencies: ['Course Models'],
        hint: '`round(lessons_pct * 0.3 + code_pct * 0.4 + proj_pct * 0.3)`.',
        starterSnippet: `def calc_weighted_progress(lessons_done: int, lessons_total: int, code_done: int, code_total: int, proj_done: int, proj_total: int) -> int:
    # TODO: 30% dars, 40% kod, 30% loyiha vaznida hisoblang
    return 0`,
        testCode: `assert calc_weighted_progress(10, 10, 5, 10, 0, 10) == 50
assert calc_weighted_progress(10, 10, 10, 10, 10, 10) == 100`,
        solutionSnippet: `def calc_weighted_progress(lessons_done: int, lessons_total: int, code_done: int, code_total: int, proj_done: int, proj_total: int) -> int:
    l = (lessons_done / lessons_total) * 100 if lessons_total else 0
    c = (code_done / code_total) * 100 if code_total else 0
    p = (proj_done / proj_total) * 100 if proj_total else 0
    return round(l * 0.3 + c * 0.4 + p * 0.3)`,
      },
    ],
    codeReviewChecklist: [
      'Progress hisobi har so‘rovda N+1 qilmasdan bitta aggregate so‘rovda olinyaptimi?',
    ],
    finalEvaluationCriteria: [
      'LMS kursi, topshiriq tekshiruvi va smart tavsiya tizimi to‘liq ishlaydi.',
    ],
  },
  {
    id: 'proj-06-saas',
    number: 'PROJECT 06',
    title: 'Advanced Multi-Tenant SaaS Backend (Docker & Production)',
    stack: ['Multi-Tenancy', 'RBAC', 'Audit Logs', 'Docker', 'Nginx', 'Redis'],
    level: 'Expert',
    brief:
      'Bir nechta kompaniyalar (`Organization/Tenant`) bitta platformada bir-birining ma’lumotini mutlaqo ko‘rmaydigan, RBAC, Audit Log, API Versioning (`/v1/`, `/v2/`), Caching va Docker Compose deployli SaaS arxitekturasi.',
    businessRequirements: [
      'Tenant izolyatsiyasi: X-Tenant-ID middleware + `TenantQuerySet` avtomatik filtri.',
      'Har bir muhim amal (`role_changed`, `invoice_paid`) o‘zgarmas `AuditLog` ga yozilishi.',
      'Multi-stage Dockerfile + Nginx + Gunicorn + PostgreSQL + Redis + Healthcheck.',
    ],
    architecture:
      'Nginx TLS → API v1/v2 → Tenant Middleware → RBAC Policy → Redis Cache → Postgres (Tenant-scoped) → Audit Trail.',
    erEntities: [
      {
        table: 'Organization & Membership',
        columns: ['id', 'slug', 'plan (free|pro)', 'role (owner|admin|member)'],
        relations: ['Organization 1 ──< N Membership', 'Organization 1 ──< N AuditLog'],
      },
    ],
    folderStructure: `saas_core/
├── tenancy/ (middleware.py, managers.py)
├── billing/ (subscriptions.py, webhooks.py)
├── audit/ (models.py, signals.py)
├── Dockerfile
└── docker-compose.prod.yml`,
    roadmapSteps: [
      '1. Tenant Isolation Middleware & Custom Manager',
      '2. RBAC Policy & Subscription Quotas',
      '3. Immutable Audit Logging & Versioning',
      '4. Redis Cache Invalidation & Monitoring',
      '5. Multi-stage Docker & Production Hardening',
    ],
    tasks: [
      {
        id: 'p6-t1',
        title: 'Tenant Isolation & Subscription Quota Tekshiruvi',
        defaultColumn: 'In Progress',
        difficulty: 'Murakkab',
        description:
          'Faqat joriy `tenant_id` ga tegishli qatorlarni qaytaruvchi hamda tarif rejasidagi (`free`: 5 user, `pro`: 100 user) limitni tekshiruvchi servis yozing.',
        acceptanceCriteria: [
          'Boshqa tenant ID li birorta ham yozuv natijaga kirmasligi shart (Cross-tenant leak = 0!).',
        ],
        dependencies: ['Tenancy Middleware'],
        hint: '`[row for row in db if row["tenant_id"] == current_tenant]`.',
        starterSnippet: `PLAN_LIMITS = {"free": 5, "pro": 100}

def scope_records(records: list[dict], tenant_id: str) -> list[dict]:
    # TODO: Faqat tenant_id mos yozuvlarni qaytaring
    return records

def can_add_member(plan: str, current_count: int) -> bool:
    return current_count < PLAN_LIMITS.get(plan, 0)`,
        testCode: `rows = [{"id": 1, "tenant_id": "acme"}, {"id": 2, "tenant_id": "evil"}]
assert scope_records(rows, "acme") == [{"id": 1, "tenant_id": "acme"}]
assert can_add_member("free", 5) is False and can_add_member("pro", 10) is True`,
        solutionSnippet: `PLAN_LIMITS = {"free": 5, "pro": 100}

def scope_records(records: list[dict], tenant_id: str) -> list[dict]:
    return [r for r in records if r.get("tenant_id") == tenant_id]

def can_add_member(plan: str, current_count: int) -> bool:
    return current_count < PLAN_LIMITS.get(plan, 0)`,
      },
    ],
    codeReviewChecklist: [
      'Tenant izolyatsiyasi barcha QuerySet va Redis kesh kalitlarida (`tenant:{id}:...`) bormi?',
      'Docker container root bo‘lmagan user (`USER appuser`) bilan ishlayaptimi?',
    ],
    finalEvaluationCriteria: [
      'Cross-tenant leak testi 100% yopilgan, Docker stack `/healthz` da 200 OK beradi.',
    ],
  },
];
