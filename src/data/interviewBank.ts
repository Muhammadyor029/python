export type InterviewTopic = 'Python' | 'PostgreSQL' | 'Django' | 'DRF';
export type InterviewLevel = 'Junior' | 'Middle' | 'Senior';

export interface InterviewCard {
  id: string;
  topic: InterviewTopic;
  level: InterviewLevel;
  question: string;
  answer: string;
  memoryHook: string;
  code?: string;
}

export const INTERVIEW_BANK: InterviewCard[] = [
  // PYTHON
  {
    id: 'py-is-eq',
    topic: 'Python',
    level: 'Junior',
    question: 'Python’da "is" va "==" operatorlarining farqi nima?',
    answer:
      '"==" ikki obyektning QIYMATLARI tengligini tekshiradi. "is" esa ular xotirada aynan BITTA obyekt ekanligini (manzili bir xilligini) tekshiradi. None bilan solishtirishda har doim "x is None" ishlatiladi.',
    memoryHook:
      'Ikki egizak mashina == (bir xil model), lekin xuddi o‘sha bitta mashina "is"!',
    code: `a = [1, 2, 3]; b = [1, 2, 3]
a == b     # True (qiymatlari teng)
a is b     # False (xotirada 2 ta alohida ro'yxat)
x = None; x is None  # True`,
  },
  {
    id: 'py-decimal-float',
    topic: 'Python',
    level: 'Junior',
    question: 'Nima uchun pul va narxlarni float o‘rniga Decimal da saqlash shart?',
    answer:
      'IEEE 754 float ikkilik sanoq tizimida 0.1 + 0.2 ni 0.30000000000000004 qilib qaytaradi. Decimal o‘nlik sanoqda aniq ishlaydi va tiyin yo‘qolishini to‘xtatadi.',
    memoryHook: 'Harorat uchun float, bank va kassa uchun faqat Decimal!',
    code: `from decimal import Decimal
Decimal("0.10") + Decimal("0.20") == Decimal("0.30")  # True`,
  },
  {
    id: 'py-mutable-default',
    topic: 'Python',
    level: 'Junior',
    question: 'def func(items=[]) yozish nima uchun eng keng tarqalgan Python xatosi?',
    answer:
      'Default argument funksiya chaqirilganda emas, def e’lon qilinganda 1 marta yaratiladi. Natijada barcha chaqiruvlar bitta list ni bo‘lishib oladi. To‘g‘risi: items=None.',
    memoryHook: 'Funksiya default qutisini faqat 1 marta sotib oladi — har safar ichiga qo‘shib boraveradi.',
    code: `def qosh(el, savat=None):
    if savat is None: savat = []
    savat.append(el); return savat`,
  },
  {
    id: 'py-gen-list',
    topic: 'Python',
    level: 'Middle',
    question: 'Generator (yield) nima va oddiy list’dan nimasi afzal?',
    answer:
      'List barcha millionta elementni birdaniga RAM xotiraga yuklaydi. Generator esa har safar next() chaqirilganda faqat BITTA element yaratadi (lazy evaluation) — xotirani minglab marta tejaydi.',
    memoryHook:
      'List — butun hovuzni uyingizga olib kelish; Generator — kranni ochib kerakli piyola suv olish.',
    code: `def sanoq(n):
    for i in range(n):
        yield i  # RAM: O(1)`,
  },
  {
    id: 'py-copy',
    topic: 'Python',
    level: 'Middle',
    question: 'Shallow copy va Deep copy farqi nima?',
    answer:
      'Shallow copy (copy.copy) tashqi qutini yangi qiladi, lekin ichidagi ichki ro‘yxatlarga eski manzilni qoldiradi. Deep copy (copy.deepcopy) hamma ichki qatlamlarni ham noldan mustaqil nusxalaydi.',
    memoryHook:
      'Shallow — uy kalitini nusxalash (ichidagi mebel bitta); Deep — xuddi o‘xshash yangi uy qurish.',
    code: `import copy
asl = [[1, 2], [3, 4]]
yuzaki = copy.copy(asl)
chuqur = copy.deepcopy(asl)`,
  },
  {
    id: 'py-decorators',
    topic: 'Python',
    level: 'Middle',
    question: 'Dekorator qanday ishlaydi va @functools.wraps nega kerak?',
    answer:
      'Dekorator — funksiyani argument sifatida olib, uning atrofida qo‘shimcha mantiq (log, auth, kesh) bajaruvchi yangi wrapper qaytaradigan funksiya. @wraps(func) asl __name__ va __doc__ ni yo‘qotmaslik uchun shart.',
    memoryHook: '@wraps bo‘lmasa hamma funksiyalarning pasporti "wrapper" ga aylanib qoladi.',
  },
  {
    id: 'py-slots',
    topic: 'Python',
    level: 'Senior',
    question: 'Dataclass va __slots__ xotirani qanday tejaydi?',
    answer:
      '@dataclass boilerplate (__init__, __repr__, __eq__) ni avtomatik yozadi. slots=True (yoki __slots__) har bir obyektda dinamik __dict__ lug‘atini olib tashlab RAM’ni 40–60% kamaytiradi.',
    memoryHook: '__slots__ — har bir uyga cheksiz ombor (__dict__) o‘rniga aniq shkaf qo‘yish.',
  },
  {
    id: 'py-gil',
    topic: 'Python',
    level: 'Senior',
    question: 'GIL (Global Interpreter Lock) nima? Threading vs Multiprocessing vs Asyncio?',
    answer:
      'GIL — CPython’da bir vaqtning o‘zida faqat bitta thread Python baytkodini bajarishini ta’minlovchi qulf. CPU-og‘ir hisoblar uchun Multiprocessing, tarmoq/DB kutish (I/O-bound) uchun Asyncio yoki Threading tanlanadi.',
    memoryHook:
      'Oshxonada bitta pichoq (GIL) bor: sabzi to‘g‘rash (CPU) uchun 2-oshpazga 2-jarayon (Multiprocessing) kerak.',
  },

  // POSTGRESQL
  {
    id: 'pg-null',
    topic: 'PostgreSQL',
    level: 'Junior',
    question: 'PostgreSQL’da NULL nima va "WHERE col != \'x\'" nega xavfli?',
    answer:
      'NULL — "qiymat noma’lum" holati (0 ham, "" ham emas). NULL bilan har qanday taqqoslash UNKNOWN beradi! Shuning uchun "WHERE col != \'x\'" col NULL bo‘lgan qatorlarni tashlab yuboradi. To‘g‘risi: IS DISTINCT FROM.',
    memoryHook:
      'Noma’lum yosh == Noma’lum yosh? Bilmaymiz (NULL)! Tekshirish uchun IS NULL / IS DISTINCT FROM.',
    code: `SELECT COALESCE(phone, email, 'aloqa yoq') FROM users;
SELECT * FROM orders WHERE status IS DISTINCT FROM 'cancelled';`,
  },
  {
    id: 'pg-not-in-null',
    topic: 'PostgreSQL',
    level: 'Middle',
    question: 'NOT IN (subquery) nima uchun 0 ta qator qaytarishi mumkin?',
    answer:
      'Agar subquery natijasida bittagina NULL bo‘lsa, x NOT IN (1, 2, NULL) -> (x != 1 AND x != 2 AND x != NULL) -> UNKNOWN ga aylanadi va natija bo‘sh chiqadi! Har doim NOT EXISTS ishlating.',
    memoryHook: 'NOT IN bitta NULL ko‘rsa butun ro‘yxatni o‘chiradi — NOT EXISTS esa xavfsiz!',
  },
  {
    id: 'pg-mvcc',
    topic: 'PostgreSQL',
    level: 'Middle',
    question: 'MVCC va VACUUM PostgreSQL’da qanday ishlaydi?',
    answer:
      'MVCC har bir UPDATE’da eski qatorni o‘chirilgan deb belgilab, yangi versiya yozadi — natijada o‘quvchilar yozuvchilarni bloklamaydi! Eski "dead tuple" qoldiqlarini esa AUTOVACUUM tozalaydi.',
    memoryHook:
      'MVCC — hujjatni o‘chirib yozish o‘rniga yangi sahifa ochib, eski sahifani keyin supuruvchi (VACUUM) ga topshirish.',
  },
  {
    id: 'pg-indexes',
    topic: 'PostgreSQL',
    level: 'Middle',
    question: 'B-tree, GIN va BRIN indekslarining qaysi biri qachon kerak?',
    answer:
      'B-tree (default, 95% hollar) — =, <, >, BETWEEN, ORDER BY uchun. GIN — JSONB (@>, ?), massivlar va LIKE \'%matn%\' (pg_trgm) uchun. BRIN — milliard qatorli vaqt bo‘yicha o‘suvchi loglar uchun juda ixcham indeks.',
    memoryHook:
      'B-tree = kitob mundarijasi; GIN = kalit so‘zlar ko‘rsatkichi (JSON/Matn); BRIN = boblar chegarasi.',
    code: `CREATE INDEX idx_docs_gin ON docs USING GIN (data jsonb_path_ops);
CREATE INDEX CONCURRENTLY idx_orders_active ON orders (user_id)
WHERE status NOT IN ('done', 'cancelled');`,
  },
  {
    id: 'pg-window',
    topic: 'PostgreSQL',
    level: 'Middle',
    question: 'Window Functions (ROW_NUMBER, RANK, LAG) GROUP BY dan nimasi bilan farq qiladi?',
    answer:
      'GROUP BY ko‘p qatorni bitta jamlama qatorga siqadi; Window Functions esa har bir asl qatorni saqlagan holda qo‘shni qatorlar (PARTITION BY / ORDER BY) bo‘yicha raqam, summa yoki oldingi qiymatni chiqaradi.',
    memoryHook: 'GROUP BY siqadi, OVER() esa har bir qatorga qo‘shnisiga qarash uchun deraza ochadi.',
  },
  {
    id: 'pg-skip-locked',
    topic: 'PostgreSQL',
    level: 'Senior',
    question: 'FOR UPDATE SKIP LOCKED va Deadlock’dan qanday qochiladi?',
    answer:
      'SELECT ... FOR UPDATE parallel tranzaksiyalar bir xil balansni buzmasligi uchun qatorni qulflaydi. Navbatlarda SKIP LOCKED band qatorni kutmasdan keyingisiga o‘tadi. Deadlock oldini olish uchun resurslar DOIM bir xil tartibda (ORDER BY id) qulflanadi.',
    memoryHook:
      'SKIP LOCKED — kassada band bo‘lgan stolni tashlab, bo‘sh turgan keyingi mijozga xizmat ko‘rsatish.',
    code: `SELECT * FROM jobs WHERE status = 'pending'
ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;`,
  },
  {
    id: 'pg-pgbouncer',
    topic: 'PostgreSQL',
    level: 'Senior',
    question: 'Nima uchun production’da Django va PostgreSQL orasiga PgBouncer qo‘yiladi?',
    answer:
      'Har bir PostgreSQL ulanishi serverda alohida OS jarayoni ochib ~10 MB RAM yeydi. PgBouncer transaction pooling rejimida 2000 ta mijoz so‘rovini atigi 30–50 ta haqiqiy DB ulanishiga navbatlab beradi.',
    memoryHook: 'PgBouncer — restoranda 1000 ta mehmonni 40 ta bo‘sh stolga navbat bilan o‘tqazuvchi administrator.',
  },

  // DJANGO
  {
    id: 'dj-null-blank',
    topic: 'Django',
    level: 'Junior',
    question: 'Django’da null=True va blank=True orasidagi farq nima?',
    answer:
      'null=True — ma’lumotlar bazasi (PostgreSQL) darajasida ustun NULL qabul qilishini bildiradi. blank=True — Django forma/serializer validatsiyasi darajasida maydon bo‘sh bo‘lishi mumkinligini bildiradi. CharField/TextField’da faqat blank=True beriladi.',
    memoryHook:
      'null = Baza ombori qoidasi; blank = Qabulxona anketasi (validatsiya) qoidasi.',
  },
  {
    id: 'dj-abstract-user',
    topic: 'Django',
    level: 'Junior',
    question: 'Nega birinchi migratsiyadan oldin AbstractUser dan Custom User tuzish shart?',
    answer:
      'Loyiha o‘rtasida default User dan Custom User ga o‘tish ForeignKey jadvallarini sindiradi. 1-kundan AbstractUser dan meros olib AUTH_USER_MODEL = "users.User" yozilsa, keyin email login yoki telefon qo‘shish oson bo‘ladi.',
    memoryHook: 'Bino qurilishidan oldin poydevorga lift shaxtasini qo‘yish.',
  },
  {
    id: 'dj-n-plus-1',
    topic: 'Django',
    level: 'Middle',
    question: 'select_related() va prefetch_related() farqi? (N+1 muammosi)',
    answer:
      'select_related SQL JOIN bilan BITTA so‘rovda ForeignKey/OneToOne ("bitta" tomon) ni oladi. prefetch_related esa alohida so‘rov + Python biriktirish bilan ManyToMany/reverse FK ("ko‘p" tomon) ni oladi.',
    memoryHook:
      'select_related = bitta tomonga JOIN (1 so‘rov); prefetch_related = ko‘p tomonga alohida 2-so‘rov.',
    code: `Order.objects.select_related('user').prefetch_related('items')`,
  },
  {
    id: 'dj-f-q-atomic',
    topic: 'Django',
    level: 'Middle',
    question: 'F() expression va transaction.on_commit() nima uchun kritik?',
    answer:
      'F() qiymatni Python’ga yuklamasdan bazada atomar yangilaydi (race condition yo‘q!). transaction.on_commit() esa Celery task yoki email’ni faqat DB tranzaksiyasi muvaffaqiyatli COMMIT bo‘lgandagina yuboradi.',
    memoryHook:
      'on_commit = "Shartnomaga muhr bosilgachgina (COMMIT) kuryerga (Celery) qo‘ng‘iroq qil!"',
    code: `with transaction.atomic():
    order = Order.objects.create(...)
    transaction.on_commit(lambda: send_receipt.delay(order.id))`,
  },
  {
    id: 'dj-subquery-outerref',
    topic: 'Django',
    level: 'Senior',
    question: 'Subquery va OuterRef qachon qo‘llanadi?',
    answer:
      'Har bir qator uchun bog‘langan jadvaldan eng oxirgi to‘lov yoki izoh kabi bitta qiymatni Python siklisiz bitta SQL so‘rovda annotate() qilib olish uchun ishlatiladi.',
    memoryHook: 'OuterRef — tashqi jadvaldan ichki so‘rovga yo‘llanma (korrelyatsiyalangan subquery).',
  },
  {
    id: 'dj-zero-downtime',
    topic: 'Django',
    level: 'Senior',
    question: 'Zero-downtime migratsiya va AddIndexConcurrently qoidalari nima?',
    answer:
      'Production’da eski kod va yangi baza bir vaqtda ishlaydi: ustunni birdan o‘chirish yoki NOT NULL ni default’siz qo‘shish saytni yiqitadi (expand-contract kerak). AddIndexConcurrently esa atomic=False bo‘lishi shart.',
    memoryHook:
      'Eski uyni buzishdan oldin yangisini qurib ko‘chirish (expand-contract) = 0 uzilish.',
  },
  {
    id: 'dj-async-orm',
    topic: 'Django',
    level: 'Senior',
    question: 'Async view ichida SynchronousOnlyOperation xatosi nega chiqadi?',
    answer:
      'Oddiy Django ORM metodlari (.get(), .all()) sinxron va event loopni bloklaydi. Async def view da await Model.objects.aget(...) yoki asgiref.sync.sync_to_async ishlatish shart.',
    memoryHook: 'Async oqimda sinxron bloklovchi ORM chaqirsangiz Django himoya sifatida to‘xtatadi.',
  },

  // DRF
  {
    id: 'drf-validation-order',
    topic: 'DRF',
    level: 'Middle',
    question: 'DRF Serializer validatsiyasining 3 bosqichli tartibi qanday?',
    answer:
      'is_valid() chaqirilganda: (1) Field darajasi (tip, required, max_length, validators=[]); (2) validate_<field>(self, value); (3) validate(self, attrs) — bir nechta maydonni o‘zaro tekshirish.',
    memoryHook:
      '1. Pasport turi → 2. Har bir hujjat alohida → 3. Hujjatlarni o‘zaro solishtirish.',
    code: `def validate_price(self, value):
    if value < 0: raise ValidationError("Manfiy bo'lmasin")
    return value`,
  },
  {
    id: 'drf-jwt-401-403',
    topic: 'DRF',
    level: 'Junior',
    question: 'JWT Access vs Refresh token va 401 vs 403 status kodlari farqi?',
    answer:
      'Access token qisqa muddatli (5–15 min, Bearer headerda). Refresh token uzoq muddatli (7 kun, faqat yangi Access olish uchun). 401 = "Kim ekaningni bilmadim (login qil)"; 403 = "Bilaman, lekin ruxsating yo‘q".',
    memoryHook:
      '401 = "Pasporting yo‘q!"; 403 = "Pasporting bor, lekin bu VIP xonaga kira olmaysan!"',
  },
  {
    id: 'drf-cursor-pagination',
    topic: 'DRF',
    level: 'Middle',
    question: 'PageNumberPagination vs CursorPagination qachon tanlanadi?',
    answer:
      'PageNumber kichik jadvallarda sahifa raqamiga sakrash uchun yaxshi. Millionlab qatorli lentalarda OFFSET sekinlashadi va dublikat chiqadi — CursorPagination O(1) indeks bilan barqaror ishlaydi.',
    memoryHook: 'PageNumber = sahifa raqami; Cursor = oxirgi ko‘rgan nuqtangdan davom etish.',
  },
  {
    id: 'drf-idor-object-perm',
    topic: 'DRF',
    level: 'Middle',
    question: 'IDOR hujumi nima va DRF da undan qanday himoyalaniladi?',
    answer:
      'IDOR — foydalanuvchi URL dagi ID ni (/orders/42 -> /orders/43) o‘zgartirib birovning ma’lumotini ko‘rishi. Himoya: get_queryset() ni request.user bilan filtrlash va has_object_permission() yozish.',
    memoryHook: 'Har bir eshik (list va detail) da egalik tekshiruvi bo‘lishi shart.',
  },
  {
    id: 'drf-idempotency',
    topic: 'DRF',
    level: 'Senior',
    question: 'API’da Idempotency-Key va Mass Assignment himoyasi qanday qilinadi?',
    answer:
      'Mobil tarmoq uzilganda POST qayta yuborilsa ikkita to‘lov ketmasligi uchun mijoz UUID Idempotency-Key yuboradi. Mass Assignment oldini olish uchun serializer’da fields aniq sanab o‘tiladi (hech qachon "__all__").',
    memoryHook:
      'Idempotency-Key = bir chek raqamiga ikki marta pul yechmaslik kafolati.',
  },
  {
    id: 'drf-throttle-openapi',
    topic: 'DRF',
    level: 'Senior',
    question: 'ScopedRateThrottle va drf-spectacular (OpenAPI) nima uchun kerak?',
    answer:
      'ScopedRateThrottle login yoki SMS yuborish kabi nozik endpointlarga alohida limit (masalan 5/min) qo‘yadi. drf-spectacular esa kodingizdan avtomatik jonli Swagger/OpenAPI 3 hujjatini generatsiya qiladi.',
    memoryHook: 'Throttling — kirish eshigidagi hisoblagich; drf-spectacular — frontend uchun tayyor qo‘llanma.',
  },
];
