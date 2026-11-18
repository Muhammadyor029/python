export type AtlasDomainId = 'python' | 'postgresql' | 'django' | 'drf';

export interface AtlasTopicItem {
  range: string;
  title: string;
  level: '0-daraja' | 'Junior' | 'Middle' | 'Senior' | 'Ekspert';
  analogy: string;
  summary: string;
  keyTakeaways: string[];
  codeSnippet: string;
}

export interface AtlasDomain {
  id: AtlasDomainId;
  badge: string;
  title: string;
  totalQuestions: number;
  subtitle: string;
  chapters: AtlasTopicItem[];
}

export const SYLLABUS_ATLAS: AtlasDomain[] = [
  {
    id: 'python',
    badge: 'Python · 150 mavzu',
    title: 'Python: 0-darajadan CPython va Asyncio Ekspertigacha',
    totalQuestions: 150,
    subtitle:
      'Ma’lumot turlari, xotira modeli (GIL, GC, shallow/deep copy), OOP, generatorlar, dekoratorlar va asinxron dasturlash.',
    chapters: [
      {
        range: '#01–25',
        title: '0-bosqich: Turlar, O‘zgaruvchilar, Slicing va LEGB',
        level: '0-daraja',
        analogy:
          'O‘zgaruvchi — buyum ichidagi quti emas, balki xotiradagi obyektga bog‘langan yorliq (birka).',
        summary:
          'Dinamik va kuchli tiplash, int/float/Decimal/str/bool/None, mutable (list, dict, set) vs immutable (int, str, tuple, frozenset), "is" vs "==", slicing [start:stop:step] va LEGB ko‘rinish doirasi.',
        keyTakeaways: [
          'Pul hisob-kitobida har doim Decimal — float (0.1 + 0.2) ikkilik xatolik beradi',
          'x is None xotira identifikatsiyasini, == esa qiymatni solishtiradi',
          'Tuple kalit bo‘la oladi, chunki u hashable va o‘zgarmas',
          'Mutatsiyalanuvchi default argument def f(arr=[]) xavfli — arr=None ishlating',
        ],
        codeSnippet: `from decimal import Decimal
narx = Decimal("19.99")
yigindi = narx * 3  # Aniq: 59.97
def qosh(item, royxat=None):
    if royxat is None:
        royxat = []
    royxat.append(item)
    return royxat`,
      },
      {
        range: '#26–55',
        title: 'Funksiyalar, Comprehension, Generator va Nusxalash',
        level: 'Junior',
        analogy:
          'List — barcha nonni birato‘la pishirib omborga bosish; Generator (yield) — har kelgan mijozga issiq nonni birma-bir uzatish.',
        summary:
          '*args/**kwargs, lambda, list/dict/set comprehension, yield va generator expression (), zip/enumerate, collections (Counter, defaultdict, deque), shallow copy vs deepcopy.',
        keyTakeaways: [
          'Generator RAM’ni O(1) darajada ushlab, million qator faylni bemalol o‘qiydi',
          'copy.copy() faqat ustki qutini, copy.deepcopy() ichki qatlamlarni ham mustaqil ko‘chiradi',
          'dict va set O(1) tezlikda hash jadval orqali qidiradi',
        ],
        codeSnippet: `def katta_log_oqi(fayl):
    with open(fayl) as f:
        for qator in f:
            if "ERROR" in qator:
                yield qator.strip()  # RAM'ni to'ldirmaydi`,
      },
      {
        range: '#56–90',
        title: 'OOP, MRO, Dunder Metodlar, Dataclass va Dekoratorlar',
        level: 'Middle',
        analogy:
          'Dekorator — tayyor taom ustiga qadoq yoki shirin sous qo‘shadigan oshpaz yordamchisi (@wraps asl nomini saqlaydi).',
        summary:
          '__init__ vs __new__, @property, @classmethod vs @staticmethod, C3 MRO va super(), __str__/__repr__/__eq__/__hash__, ABC, @dataclass, __slots__, funksional dekoratorlar va try/except/else/finally.',
        keyTakeaways: [
          '__slots__ millionta obyektda __dict__ ni olib tashlab RAM’ni 50%+ tejaydi',
          '@functools.wraps(func) dekorator ostidagi funksiya __name__ va __doc__ ini saqlaydi',
          'else bloki faqat try ichida xato chiqmaganda ishlaydi; finally har doim ishlaydi',
        ],
        codeSnippet: `from dataclasses import dataclass
from functools import wraps

def log_vaqt(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@dataclass(slots=True, frozen=True)
class Pul:
    miqdor: int
    valyuta: str = "UZS"`,
      },
      {
        range: '#91–125',
        title: 'Context Manager, GIL, Threading, Multiprocessing va Asyncio',
        level: 'Senior',
        analogy:
          'GIL — oshxonada bitta pichoq: sabzi to‘g‘rash (CPU) uchun alohida oshpaz (Process) kerak, choy qaynatishni kutish (I/O) uchun bitta oshpaz Asyncio bilan 100 choynakni navbatma-navbat qaraydi.',
        summary:
          'with (__enter__/__exit__), @contextmanager, CPython GIL, I/O-bound (threading/asyncio) vs CPU-bound (multiprocessing), async def / await / asyncio.gather, Queue, venv/uv, logging.',
        keyTakeaways: [
          'Tarmoq so‘rovlari va DB kutishida Asyncio yoki Threading minglab vazifani ko‘taradi',
          'Og‘ir matematika va rasm/video ishlovida faqat Multiprocessing GIL ni aylanib o‘tadi',
          'with bloki xatolik chiqsa ham fayl va ulanishni avtomatik yopadi',
        ],
        codeSnippet: `import asyncio

async def serverdan_ol(nom):
    await asyncio.sleep(0.2)
    return f"{nom}: OK"

# Ikkalasi parallel 0.2 soniyada tugaydi (0.4s emas!):
# await asyncio.gather(serverdan_ol("Auth"), serverdan_ol("Billing"))`,
      },
      {
        range: '#126–150',
        title: 'Deskriptorlar, Metaklasslar, Garbage Collector, Typing va Pytest',
        level: 'Ekspert',
        analogy:
          'Django Model maydonlari (CharField, IntegerField) — ichida __get__ va __set__ deskriptor protokoli ishlaydigan aqlli posbonlar.',
        summary:
          'Descriptor protokoli, type() va Metaklasslar, Reference Counting + Cyclic GC, weakref, lru_cache, match-case, Protocol (structural typing), cProfile va pytest fixtures/monkeypatch.',
        keyTakeaways: [
          'CPython xotirani avval Reference Counting bilan, siklik bog‘lanishni esa Generational GC bilan tozalaydi',
          'cProfile qaysi funksiya CPU vaqtini yeyotganini aniq o‘lchaydi (PEP 8 + type hints bilan birga)',
        ],
        codeSnippet: `from functools import lru_cache
from typing import Protocol

class TolovTizimi(Protocol):
    def yech(self, summa: int) -> bool: ...

@lru_cache(maxsize=256)
def soliq_stavkasi(hudud_id: int) -> float:
    return 0.12`,
      },
    ],
  },
  {
    id: 'postgresql',
    badge: 'PostgreSQL · 90 mavzu',
    title: 'PostgreSQL: NULL Mantiqidan MVCC, Indekslar va Tuninggacha',
    totalQuestions: 90,
    subtitle:
      'To‘g‘ri ma’lumot turlari, JOIN & Window Functions, MVCC/VACUUM, B-tree/GIN/BRIN indekslar, EXPLAIN ANALYZE va PgBouncer.',
    chapters: [
      {
        range: '#01–22',
        title: 'ACID, Ma’lumot Turlari (NUMERIC, JSONB, UUIDv7) va NULL Tuzog‘i',
        level: 'Junior',
        analogy:
          'NULL — "nol" ham, "bo‘sh satr" ham emas, balki "yopiq konvert ichida nima borligi noma’lum" holati.',
        summary:
          'ACID kafolatlari, NULL uch qiymatli mantiq (TRUE / FALSE / UNKNOWN), COALESCE/NULLIF, NUMERIC vs FLOAT, TIMESTAMPTZ, JSONB vs JSON, UUIDv4 vs UUIDv7 (index fragmentation).',
        keyTakeaways: [
          'WHERE status != "cancelled" status NULL bo‘lgan qatorlarni TASHLAB YUBORADI — IS DISTINCT FROM ishlating',
          'NOT IN (SELECT ...) ichida bittagina NULL bo‘lsa, butun so‘rov 0 ta qator qaytaradi — NOT EXISTS xavfsiz!',
          'UUIDv7 vaqt bo‘yicha tartibli bo‘lgani uchun B-tree sahifalarini parchalamaydi',
        ],
        codeSnippet: `-- Xavfsiz NULL taqqoslash va JSONB saqlash
SELECT id, COALESCE(telefon, 'Kiritilmagan') AS aloqa
FROM users
WHERE status IS DISTINCT FROM 'cancelled';`,
      },
      {
        range: '#23–48',
        title: 'JOIN Turlari, SQL Bajarilish Tartibi, CTE va Window Functions',
        level: 'Middle',
        analogy:
          'GROUP BY qatorlarni bitta qutiga siqib yuborsa, Window Function (OVER) har bir qatorga qo‘shnisini ko‘rsatadigan deraza ochib beradi.',
        summary:
          'Mantiqiy tartib (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT), INNER/LEFT/FULL JOIN, CTE (WITH / RECURSIVE), ROW_NUMBER / RANK / DENSE_RANK / LAG / LEAD, UNION vs UNION ALL.',
        keyTakeaways: [
          'Dublikat tekshiruvi shart bo‘lmasa UNION o‘rniga UNION ALL ishlating — sortirovka tejaladi',
          'HAVING faqat guruhlangandan (GROUP BY) keyingi agregatlarga, WHERE esa guruhlashdan oldin ishlaydi',
        ],
        codeSnippet: `SELECT user_id, summa,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY yaratildi DESC) AS rn,
  LAG(summa) OVER (PARTITION BY user_id ORDER BY yaratildi) AS oldingi_tolov
FROM tolovlar;`,
      },
      {
        range: '#49–72',
        title: 'MVCC, VACUUM, B-tree / GIN / BRIN Indekslar va EXPLAIN ANALYZE',
        level: 'Senior',
        analogy:
          'MVCC — kitobni o‘chirib yozish o‘rniga yangi varaq ilish; o‘quvchilar eski varaqni tinch o‘qiydi, VACUUM esa keraksiz eski qog‘ozlarni supuradi.',
        summary:
          'MVCC snapshot & dead tuples, AUTOVACUUM va Transaction ID wraparound, B-tree (left-prefix rule), GIN (JSONB & pg_trgm), Partial & Covering (INCLUDE) index, EXPLAIN (ANALYZE, BUFFERS), Izolyatsiya darajalari, FOR UPDATE SKIP LOCKED.',
        keyTakeaways: [
          'Composite index (a, b) faqat WHERE a=... yoki (a, b) da ishlaydi; faqat WHERE b=... da ishlamaydi',
          'EXPLAIN ANALYZE da "Seq Scan" katta jadvalda ko‘rinsa, indeks yoki so‘rov tuzilishini tekshiring',
          'FOR UPDATE SKIP LOCKED worker navbatlarida deadlocksiz bir xil vazifani ikki marta olmaslik uchun oltin standart',
        ],
        codeSnippet: `CREATE INDEX CONCURRENTLY idx_orders_open_user
ON orders (user_id, yaratildi DESC)
WHERE holat = 'kutilmoqda';`,
      },
      {
        range: '#73–90',
        title: 'PgBouncer, Jadval Partitsiyalash, WAL Replikatsiya va Xavfsizlik',
        level: 'Ekspert',
        analogy:
          'PgBouncer — restoranga kirishdagi aqlli navbatchi: 1000 ta mehmon kelsa ham oshxonaga (Postgres) faqat 40 ta bo‘sh stoldan navbat bilan kirgizadi.',
        summary:
          'Transaction pooling (PgBouncer), Declarative Partitioning (Range / List / Hash), pg_stat_statements bilan eng sekin SQL larni topish, WAL loglari, Streaming Replication, PITR backup va SQL Injection himoyasi.',
        keyTakeaways: [
          'Har bir Postgres ulanishi ~10MB RAM yeydi — katta yuklamada albatta PgBouncer qo‘yiladi',
          'Parametrli so‘rovlar (%s) SQL Injection’ni 100% to‘xtatadi, hech qachon f-string bilan SQL tuzmang',
        ],
        codeSnippet: `-- Sekin so'rovlarni kuzatish:
SELECT calls, round(mean_exec_time::numeric, 2) AS avg_ms, query
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 5;`,
      },
    ],
  },
  {
    id: 'django',
    badge: 'Django · 120 mavzu',
    title: 'Django: MVT, ORM Chuqurligi, Celery va Zero-Downtime Deploy',
    totalQuestions: 120,
    subtitle:
      'AbstractUser, QuerySet lazy evaluation, N+1, Subquery/OuterRef, transaction.on_commit, Middleware, Async Django va xavfsiz migratsiya.',
    chapters: [
      {
        range: '#01–30',
        title: 'MVT, Settings, AbstractUser va Model Dizayn Qoidalari',
        level: 'Junior',
        analogy:
          'AUTH_USER_MODEL ni loyihaning 1-kunida sozlash — bino qurilishidan oldin poydevorga lift shaxtasini qo‘yish kabi shart.',
        summary:
          'MVT (Model-View-Template), split settings & .env, AbstractUser vs AbstractBaseUser, null=True vs blank=True, on_delete (CASCADE/PROTECT/SET_NULL), related_name, TextChoices, Abstract vs Proxy modellar.',
        keyTakeaways: [
          'CharField va TextField da null=True bermang — faqat blank=True (bo‘sh qiymat bitta "" ko‘rinishida turadi)',
          'Pul va muhim yozuvlarda on_delete=models.PROTECT ishlating, mijoz o‘chsa cheklar yo‘qolib ketmasin',
        ],
        codeSnippet: `class Buyurtma(models.Model):
    class Holat(models.TextChoices):
        YANGI = "yangi", "Yangi"
        TOLANGAN = "tolangan", "To'langan"
    ega = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    holat = models.CharField(max_length=16, choices=Holat.choices, default=Holat.YANGI)`,
      },
      {
        range: '#31–65',
        title: 'QuerySet Lazy Evaluation, N+1, Prefetch, F/Q va Subquery',
        level: 'Middle',
        analogy:
          'QuerySet — restoran buyurtma qog‘ozi: uni bir necha marta tahrirlashingiz mumkin, lekin oshxonaga faqat list(), len(), for yoki [0] qilinganda (evaluation) boradi.',
        summary:
          'Lazy evaluation & caching, select_related (JOIN) vs prefetch_related (2-query) vs Prefetch(queryset=...), F() & Q(), annotate() vs aggregate(), Subquery/OuterRef/Exists, bulk_create/bulk_update, iterator().',
        keyTakeaways: [
          'Prefetch qilingan obyektda .filter() chaqirsangiz kesh sinadi va yana N+1 chiqadi — to_attr bilan Prefetch() ishlating',
          'Obyekt sonini sanashda len(qs) o‘rniga qs.count(), borligini bilishda qs.exists() ishlating',
        ],
        codeSnippet: `from django.db.models import Prefetch, F
kurslar = Kurs.objects.select_related("muallif").prefetch_related(
    Prefetch("darslar", queryset=Dars.objects.filter(faol=True), to_attr="faol_darslar")
)
Kurs.objects.filter(id=1).update(korishlar=F("korishlar") + 1)`,
      },
      {
        range: '#66–95',
        title: 'Tranzaksiyalar (on_commit), Middleware, Signals, Redis va Admin',
        level: 'Middle',
        analogy:
          'Middleware — piyoz qatlamlari: so‘rov markazga (View) kirguncha ham, javob tashqariga chiqayotganda ham har bir qatlamdan o‘tadi.',
        summary:
          'transaction.atomic() & on_commit(), select_for_update(), Middleware tartibi (Security → Session → Auth), Signals vs Service Layer (bulk_update signal chaqirmaydi!), Redis cache-aside, Celery + Beat, Admin N+1 (list_select_related, raw_id_fields).',
        keyTakeaways: [
          'bulk_create() va QuerySet.update() Django signallarini (post_save) ISHGA TUSHIRMAYDI',
          'Celery task.delay() ni doim transaction.on_commit() ichida bering — aks holda worker bo‘sh qatorga uriladi',
        ],
        codeSnippet: `with transaction.atomic():
    tolov = Tolov.objects.create(ega=request.user, summa=summa)
    transaction.on_commit(lambda: chek_yuborish.delay(tolov.id))`,
      },
      {
        range: '#96–120',
        title: 'Async Django (ASGI), Zero-Downtime Migratsiya va Production',
        level: 'Senior',
        analogy:
          'Zero-downtime migratsiya — poyezd yurib turganda relsni almashtirish: avval yangisini qo‘yasiz (nullable), ma’lumotni ko‘chirasiz, keyin eski kod o‘chgach ustunni olib tashlaysiz.',
        summary:
          'WSGI (Gunicorn) vs ASGI (Uvicorn), SynchronousOnlyOperation & sync_to_async / aget / afilter, Expand-Contract migratsiya, SeparateDatabaseAndState, AddIndexConcurrently (atomic=False), DEBUG=False, CSRF, Structured Logging.',
        keyTakeaways: [
          'AddIndexConcurrently va RemoveIndexConcurrently albatta atomic = False bo‘lgan migratsiyada yozilishi shart',
          'Async view ichida sinxron ORM (Model.objects.get) chaqirsangiz SynchronousOnlyOperation chiqadi — aget() ishlating',
        ],
        codeSnippet: `class Migration(migrations.Migration):
    atomic = False  # Katta jadvalni bloklamaslik uchun SHART!
    operations = [
        AddIndexConcurrently(model_name="buyurtma", index=models.Index(fields=["holat"], name="idx_holat")),
    ]`,
      },
    ],
  },
  {
    id: 'drf',
    badge: 'DRF API · 80 mavzu',
    title: 'Django REST Framework: Serializer, JWT, Xavfsizlik va OpenAPI',
    totalQuestions: 80,
    subtitle:
      '3-bosqichli validatsiya, ViewSet vs APIView, JWT & RBAC/IDOR himoyasi, Rate Limiting, Idempotency-Key va Swagger hujjatlashtirish.',
    chapters: [
      {
        range: '#121–145',
        title: 'Serializer, 3-Bosqichli Validatsiya va Mass Assignment Himoyasi',
        level: 'Junior',
        analogy:
          'Serializer — aeroport bojxona ko‘rigi: pasport turini tekshiradi, sumkani alohida qaraydi va oxirida barcha hujjatlarni o‘zaro solishtiradi.',
        summary:
          'Serializer vs ModelSerializer, fields=["..."] vs "__all__" xavfi, 3-bosqichli validatsiya (field → validate_<field> → validate), read_only / write_only / source, SerializerMethodField (N+1 xavfi!), Nested write.',
        keyTakeaways: [
          'Hech qachon fields = "__all__" yozmang — foydalanuvchi JSON da "is_staff": true yuborib admin bo‘lib olishi mumkin!',
          'SerializerMethodField ichida bazaga so‘rov qilmang, oldindan annotate/select_related qilib keling',
        ],
        codeSnippet: `class BuyurtmaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyurtma
        fields = ["id", "kurs", "kupon_kodi"]  # user, summa, holat YO'Q!
        read_only_fields = ["id"]

    def validate_kupon_kodi(self, val):
        return val.strip().upper()`,
      },
      {
        range: '#146–170',
        title: 'APIView, GenericAPIView, ViewSet, Router va Pagination',
        level: 'Middle',
        analogy:
          'APIView — qo‘lda yasalgan maxsus kalit (to‘liq nazorat); ModelViewSet — 5 ta CRUD operatsiyani bitta Router ga ulaydigan tayyor dastgoh.',
        summary:
          '@api_view vs APIView vs GenericAPIView+Mixins vs ModelViewSet, DefaultRouter & @action(detail=True/False), django-filter + SearchFilter + OrderingFilter, PageNumberPagination vs CursorPagination, get_serializer_class().',
        keyTakeaways: [
          'Millionlab qatorli lenta/feed uchun PageNumber (?page=50000) sekinlashadi — CursorPagination O(1) ishlaydi',
          'Har bir ViewSet da get_queryset() ni foydalanuvchiga ko‘ra filtrlang va select_related qo‘shing',
        ],
        codeSnippet: `class MeningBuyurtmamViewSet(viewsets.ModelViewSet):
    serializer_class = BuyurtmaSerializer
    pagination_class = CursorPagination

    def get_queryset(self):
        return Buyurtma.objects.filter(ega=self.request.user).select_related("kurs")`,
      },
      {
        range: '#171–200',
        title: 'JWT Auth, 401 vs 403, IDOR, Throttling, Idempotency va OpenAPI',
        level: 'Senior',
        analogy:
          '401 — qorovul: "Pasporting yo‘q, kimligingni bilmayman!". 403 — "Pasporting bor (Amir), lekin Direktor xonasiga ruxsating yo‘q!"',
        summary:
          'SessionAuth vs JWT (Access 15m + Refresh 7d + Rotation/Blacklist), HttpOnly cookie, 401 vs 403, has_permission vs has_object_permission (IDOR himoyasi), ScopedRateThrottle, CORS, Idempotency-Key, 202 Accepted, drf-spectacular & APITestCase.',
        keyTakeaways: [
          'get_object() chaqirilganda has_object_permission ishlaydi; ro‘yxatda (list) esa faqat get_queryset() IDOR dan asraydi',
          'To‘lov va buyurtma POST endpointlariga albatta Idempotency-Key (UUID) va ScopedRateThrottle qo‘ying',
        ],
        codeSnippet: `class FaqatEgasi(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.ega_id == request.user.id  # IDOR himoyasi`,
      },
    ],
  },
];
