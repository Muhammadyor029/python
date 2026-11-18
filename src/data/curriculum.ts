import {BACKEND_ASSETS} from './backendCards';

export interface CurriculumModule {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  level: string;
  analogyTitle: string;
  analogyText: string;
  image: string;
  concepts: string[];
  codeTitle: string;
  code: string;
  terminalOutput: string[];
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'python-zero',
    step: '01',
    title: '0 dan boshlash: print("Salom, Dunyo!") va Python',
    subtitle:
      'O‘zgaruvchilar, int/str/float, shartlar, sikllar, funksiyalar va xotira mantiqi',
    level: 'Boshlang‘ich · 0-bosqich',
    analogyTitle: 'Hayotiy misol: Yorliqlar, havolalar va retsept daftari',
    analogyText:
      'O‘zgaruvchi — qiymatga bog‘langan yorliq (reference), masalan yosh = 20. Funksiya — tayyor retsept: argument berasiz, u natija qaytaradi. Esda tuting: "==" qiymatlarni, "is" esa ikki yorliq aynan bitta obyektga ishora qilayotganini tekshiradi.',
    image: BACKEND_ASSETS.terminal,
    concepts: [
      'print("Salom, Dunyo!") — kompyuter bilan birinchi muloqot',
      'Asosiy turlar: int (butun son), str (o‘zgarmas matn), bool, list, tuple, dict, set, None; pul uchun decimal.Decimal',
      '"is" vs "==" — xotira manzili va qiymatni solishtirish ("x is None")',
      'Generator (yield) — millionlab elementni RAM’ga yuklamasdan bitta-bitta oqizish',
      'Virtual muhit (venv) — har bir Django loyihasining mustaqil kutubxona qutisi',
    ],
    codeTitle: '01_boshlanish.py',
    code: `# 1. Eng birinchi qadam — ekranga chiqarish
print("Salom, Dunyo!")

# 2. Turlar va pulda Decimal aniqligi
from decimal import Decimal
yosh: int = 20
balans: Decimal = Decimal("150000.00")

# 3. Lug'at (dict) va xavfsiz .get()
talaba = {"ism": "Sardor", "tajriba_oy": 0}

def darsga_kirish(user: dict) -> str:
    if user.get("tajriba_oy") == 0:
        return f"Xush kelibsiz, {user['ism']}! 0 dan boshlaymiz."
    return f"Davom etamiz, {user['ism']}!"

print(darsga_kirish(talaba))
print(f"Balans turi: {type(balans).__name__}")`,
    terminalOutput: [
      '$ python 01_boshlanish.py',
      'Salom, Dunyo!',
      'Xush kelibsiz, Sardor! 0 dan boshlaymiz.',
      'Balans turi: Decimal',
      'Jarayon 0.01 soniyada muvaffaqiyatli yakunlandi.',
    ],
    quizQuestion:
      'Python’da qiymat None ga tengligini tekshirish va kutubxonalarni loyihalar bo‘yicha ajratish uchun to‘g‘ri usul qaysi?',
    quizOptions: [
      'x is None va Virtual muhit (venv)',
      'x == None va bitta global papka',
      'x != "" va HTML teglari',
    ],
    quizCorrectIndex: 0,
    quizExplanation:
      'To‘g‘ri! PEP 8 bo‘yicha None har doim "x is None" bilan tekshiriladi, kutubxonalar esa python -m venv .venv ichida ajratiladi.',
  },
  {
    id: 'http-json',
    step: '02',
    title: 'HTTP, JSON va API mantiqi',
    subtitle:
      'So‘rov va javob sikli, Idempotent metodlar, JSON va aniq Status kodlar (401 vs 403)',
    level: 'Asoslar',
    analogyTitle: 'Hayotiy misol: Restoran ofitsianti va buyurtma varaqasi',
    analogyText:
      'Siz (klient) menyu so‘raysiz — GET (qayta-qayta chaqirsa ham hech narsa o‘zgarmaydi). Buyurtma berasiz — POST. Ofitsiant natijani JSON qutida qaytaradi: 401 = "Pasporting yo‘q (login qil)", 403 = "Pasporting bor, lekin bu xonaga ruxsating yo‘q".',
    image: BACKEND_ASSETS.terminal,
    concepts: [
      'HTTP metodlari: GET (o‘qish), POST (yaratish), PUT (to‘liq yangilash), PATCH (qisman), DELETE',
      'Idempotency: GET, PUT, DELETE qayta yuborilsa ham natija bir xil; POST odatda idempotent emas, takroriy amallardan himoya uchun API Idempotency-Key qabul qilishi mumkin',
      'Status kodlar: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found',
      'JSON formati — frontend, mobil ilova va backend orasidagi umumiy til',
    ],
    codeTitle: 'http_suhbat.py',
    code: `import json

# Serverga kelgan HTTP POST so'rov namunasi:
sorov_body = '{"kurs": "Django Pro", "soni": 1}'
malumot = json.loads(sorov_body)

# Backend mantiqi tekshiradi va JSON javob qaytaradi:
if malumot.get("soni", 0) > 0:
    javob = {"status": 201, "xabar": "Buyurtma yaratildi", "data": malumot}
else:
    javob = {"status": 400, "xabar": "Soni 0 dan katta bo'lishi kerak"}

print(json.dumps(javob, ensure_ascii=False, indent=2))`,
    terminalOutput: [
      '$ python http_suhbat.py',
      '{',
      '  "status": 201,',
      '  "xabar": "Buyurtma yaratildi",',
      '  "data": { "kurs": "Django Pro", "soni": 1 }',
      '}',
    ],
    quizQuestion:
      'Foydalanuvchi tizimga login qilgan (tokeni bor), lekin admin sahifasiga kirishga huquqi yetmasa server qaysi status kodini qaytaradi?',
    quizOptions: ['401 Unauthorized', '403 Forbidden', '201 Created'],
    quizCorrectIndex: 1,
    quizExplanation:
      'Aynan shunday! 401 — autentifikatsiya yo‘q (kimligingiz noma’lum); 403 — kimligingiz ma’lum, lekin ruxsat (permission) yo‘q.',
  },
  {
    id: 'postgresql-orm',
    step: '03',
    title: 'PostgreSQL, MVCC va Django ORM',
    subtitle:
      'NULL mantiqi, B-tree/GIN indekslar, MVCC, VACUUM va N+1 muammosini yechish',
    level: 'Ma’lumotlar bazasi',
    analogyTitle: 'Hayotiy misol: Versiyali kitob ombori va katalog',
    analogyText:
      'PostgreSQL’da MVCC har bir o‘zgarishda eski qatorni o‘chirmay yangi versiya yozadi — shu bois o‘quvchilar yozuvchilarni kutmaydi! Eski qoldiqlarni VACUUM tozalaydi. Indeks (B-tree / GIN) esa 1 million qator ichidan kerakli ma’lumotni 1 millisekundda topadigan katalogdir.',
    image: BACKEND_ASSETS.vault,
    concepts: [
      'NULL ≠ 0 va NULL ≠ "": NULL bilan = va <> ishonchli emas; IS NULL, IS NOT NULL, IS DISTINCT FROM yoki COALESCE() ishlatiladi',
      'B-tree (=, <, ORDER BY), GIN (JSONB va to‘liq matn qidiruvi), Partial Index',
      'MVCC va Autovacuum — blokirovkasiz parallel o‘qish va dead tuple tozalash',
      'select_related() (JOIN) va prefetch_related() — N+1 so‘rovlarni yo‘qotish',
      'F() expression va SELECT FOR UPDATE SKIP LOCKED — race condition oldini olish',
    ],
    codeTitle: 'courses/models.py',
    code: `from django.db import models
from django.db.models import F

class Talaba(models.Model):
    telefon = models.CharField(max_length=20, unique=True)
    balans = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class Tolov(models.Model):
    ega = models.ForeignKey(Talaba, on_delete=models.PROTECT, related_name="tolovlar")
    miqdor = models.DecimalField(max_digits=12, decimal_places=2)
    sana = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["ega", "-sana"])]

# 1. N+1 muammosisiz bitta JOIN bilan olish:
oxirgi = Tolov.objects.select_related("ega").order_by("-sana")[:10]
# 2. Race condition'siz balansni atomar oshirish:
Talaba.objects.filter(id=1).update(balans=F("balans") + 50000)`,
    terminalOutput: [
      '$ python manage.py migrate',
      'Operations to perform: Apply all migrations: courses',
      '  Applying courses.0001_initial... OK',
      '[SQL] SELECT ... INNER JOIN "courses_talaba" ... (1.1 ms · 1 query)',
    ],
    quizQuestion:
      'Django’da ForeignKey ("bitta" tomon) ni bitta SQL JOIN orqali olib kelish va N+1 muammosini yo‘qotish uchun qaysi metod ishlatiladi?',
    quizOptions: ['prefetch_related()', 'select_related()', 'bulk_delete()'],
    quizCorrectIndex: 1,
    quizExplanation:
      'To‘g‘ri! select_related() ForeignKey va OneToOne uchun SQL JOIN qiladi; prefetch_related() esa ManyToMany va teskari bog‘lanishlarda 2-alohida so‘rov yuboradi.',
  },
  {
    id: 'django-mvt',
    step: '04',
    title: 'Django MVT, DRF va Sayt Arxitekturasi',
    subtitle:
      'null vs blank, 3-bosqichli Serializer validatsiyasi, transaction.on_commit() va ViewSet',
    level: 'Asosiy freymvork',
    analogyTitle: 'Hayotiy misol: Aeroport dispetcheri va bojxona tekshiruvi',
    analogyText:
      'urls.py — samolyotni to‘g‘ri darvozaga yo‘naltiruvchi dispetcher. Serializer — 3 bosqichli bojxona: (1) maydon turi, (2) validate_<field>, (3) umumiy validate(). Mass Assignment xatosidan saqlanish uchun fields=["id", "nomi", ...] aniq yoziladi ("__all__" emas!).',
    image: BACKEND_ASSETS.vault,
    concepts: [
      'Model maydonlari: null=True (PostgreSQL bazasi uchun) vs blank=True (Serializer/Forma uchun)',
      'Serializer 3-bosqichli validatsiyasi: field turi → validate_<maydon> → validate(attrs)',
      'Mass Assignment himoyasi: explicit fields va read_only_fields (user, role, balance)',
      'transaction.atomic() + transaction.on_commit() — tranzaksiya COMMIT bo‘lgach Celery chaqirish',
      'Pagination (Cursor / PageNumber) va Django Admin optimallashtirish (list_select_related)',
    ],
    codeTitle: 'courses/views.py',
    code: `from django.db import transaction
from rest_framework import serializers, viewsets
from .models import Kurs

class KursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kurs
        fields = ["id", "nomi", "daraja", "narxi", "faol"]
        read_only_fields = ["id"]

    def validate_narxi(self, qiymat):
        if qiymat < 0:
            raise serializers.ValidationError("Narx manfiy bo'la olmaydi!")
        return qiymat

class KursViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Kurs.objects.select_related("muallif").filter(faol=True)
    serializer_class = KursSerializer`,
    terminalOutput: [
      '$ python manage.py runserver',
      'Django version 5.1, using settings "core.settings"',
      'Starting development server at http://127.0.0.1:8000/',
      '[200 OK] GET /api/v1/courses/?page=1 -> 6.4 ms (2 SQL queries)',
    ],
    quizQuestion:
      'Django’da bazadagi ustun NULL qabul qilishi va forma/serializerda maydon majburiy bo‘lmasligi qaysi parametrlar bilan farqlanadi?',
    quizOptions: [
      'null=True (baza uchun) va blank=True (validatsiya uchun)',
      'Ikkalasi ham faqat CSS uchun',
      'unique=True va db_index=True',
    ],
    quizCorrectIndex: 0,
    quizExplanation:
      'Barakalla! null=True PostgreSQL ustunini NULL ga ruxsatli qiladi; blank=True esa form/DRF tekshiruvida bo‘sh qoldirishga ruxsat beradi.',
  },
  {
    id: 'auth-security',
    step: '05',
    title: 'Autentifikatsiya, JWT Token va Xavfsizlik',
    subtitle:
      'AbstractUser, Argon2 parol xeshi, Access/Refresh JWT, CORS, CSRF va Throttling',
    level: 'Xavfsizlik',
    analogyTitle: 'Hayotiy misol: Mehmonxona magnit kaliti va qabulxona',
    analogyText:
      'Loyiha boshidayoq AbstractUser meros olib Custom User tuzing! Login bo‘lganda parolingiz bir tomonlama Argon2/PBKDF2 xeshi bilan solishtiriladi va sizga 15 daqiqalik magnit kalit (JWT Access) hamda 7 kunlik kvitansiya (Refresh) beriladi.',
    image: BACKEND_ASSETS.terminal,
    concepts: [
      'AbstractUser — loyihaning 1-kunidanoq AUTH_USER_MODEL ni sozlash',
      'Xeshlash (Argon2 / PBKDF2 + salt) vs Shifrlash — parol hech qachon teskari ochilmaydi',
      'JWT: Access (qisqa, stateless) + Refresh (rotation + blacklist)',
      'Object-level permission (has_object_permission) — birovning ma’lumotini IDOR orqali ko‘rmaslik',
      'ScopedRateThrottle, CORS (ALLOWED_ORIGINS), CSRF himoyasi va .env sirlari',
    ],
    codeTitle: 'users/permissions.py',
    code: `from rest_framework.permissions import BasePermission

# IDOR hujumidan himoya: faqat egasi o'zgartira oladi
class FaqatEgasiUchun(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.talaba_id == request.user.id

# DRF Rate Limiting (Bruteforce himoyasi):
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "login": "5/minute",
        "user": "300/minute",
    },
}`,
    terminalOutput: [
      '$ POST /api/v1/auth/token/  { "email": "amir@paimon.uz", "password": "***" }',
      '200 OK (12 ms)',
      '{',
      '  "access": "eyJhbGciOiJIUzI1NiIs...",  // 15 daqiqa',
      '  "refresh": "eyJ0eXAiOiJKV1QiLC..." // 7 kun; productionda HttpOnly cookie tavsiya etiladi',
      '}',
    ],
    quizQuestion:
      'Django loyihasi boshlanishida kelajakda telefon/email login qo‘shish oson bo‘lishi uchun User modelni nimadan meros olish tavsiya etiladi?',
    quizOptions: [
      'AbstractUser (AUTH_USER_MODEL bilan)',
      'Oddiy dict',
      'django.db.migrations',
    ],
    quizCorrectIndex: 0,
    quizExplanation:
      'To‘g‘ri! Birinchi migratsiyadan oldin AbstractUser dan meros olish keyinchalik baza sxemasini buzmasdan yangi maydonlar qo‘shish imkonini beradi.',
  },
  {
    id: 'redis-cache',
    step: '06',
    title: 'Redis va Yuqori Tezlikdagi Keshlash',
    subtitle:
      'RAM xotira, Cache-Aside pattern, TTL, Cache Stampede va Celery Broker roli',
    level: 'Tezlik va Kesh',
    analogyTitle: 'Hayotiy misol: Ish stolidagi yopishqoq qog‘oz vs uzoq arxiv',
    analogyText:
      'Har bir foydalanuvchi uchun asosiy sahifadagi darslar ro‘yxatini PostgreSQL diskidan o‘qish o‘rniga, uni operativ xotiradagi yopishqoq qog‘ozga (Redis RAM) yozib qo‘yamiz. Keshdan o‘qish odatda sezilarli tezroq bo‘ladi. Yangi dars qo‘shilsa kesh invalidatsiya qilinadi.',
    image: BACKEND_ASSETS.vault,
    concepts: [
      'PostgreSQL (Disk / MVCC) vs Redis (RAM xotira) tezlik farqi',
      'Cache-Aside: cache.get() → topilmasa DB → cache.set(key, data, timeout=300)',
      'TTL (Time To Live) va Signal/Service orqali Cache Invalidation',
      'Redis’ning ikkinchi vazifasi: Celery vazifalari uchun tezkor xabar navbati (Broker)',
    ],
    codeTitle: 'courses/cache.py',
    code: `from django.core.cache import cache
from .models import Kurs

def ommabop_kurslarni_ol():
    kalit = "paimon:kurslar:top10"
    natija = cache.get(kalit)

    if natija is None:
        natija = list(
            Kurs.objects.filter(faol=True)
            .order_by("tartib")
            .values("id", "nomi", "daraja")
        )
        cache.set(kalit, natija, timeout=300)  # TTL: 5 daqiqa

    return natija`,
    terminalOutput: [
      '[1-so‘rov] Cache MISS -> PostgreSQL dan o‘qildi (38.4 ms)',
      '[2-so‘rov] Cache HIT  -> Redis RAM dan qaytarildi (0.8 ms)',
      '[3-so‘rov] Cache HIT  -> Redis RAM dan qaytarildi (0.7 ms)',
    ],
    quizQuestion:
      'Redis’da saqlangan kesh ma’lumot eski bo‘lib qolmasligi uchun unga beriladigan amal qilish muddati nima deyiladi?',
    quizOptions: ['TTL (Time To Live)', 'SQL JOIN', 'Foreign Key'],
    quizCorrectIndex: 0,
    quizExplanation:
      'Ajoyib! TTL muddati tugashi bilan Redis eski qiymatni o‘chiradi va keyingi so‘rov yangilangan ma’lumotni bazadan oladi.',
  },
  {
    id: 'celery-workers',
    step: '07',
    title: 'Celery, Redis Broker va Rejali Vazifalar (Beat)',
    subtitle:
      'transaction.on_commit(), idempotent tasklar, retry strategiyasi va Celery Beat',
    level: 'Asinxron tizim',
    analogyTitle: 'Hayotiy misol: Kafe kassasi va oshxona navbati',
    analogyText:
      'Kassir (Django) har bir mijozga PDF sertifikat chizilguncha kutib tursa navbat qotadi. Kassir chekni beradi (14 ms!), buyurtma qog‘ozini Redis navbatiga iladi (faqat transaction.on_commit() dan keyin!). Oshxonadagi baristalar (Celery Workerlar) esa fonda bajaradi.',
    image: BACKEND_ASSETS.pipeline,
    concepts: [
      'Producer (Django) → Broker (Redis) → Worker (Celery) oqimi',
      'Nega transaction.on_commit(lambda: task.delay(id)) ishlatish shart?',
      'Idempotent task — bir vazifa 2 marta ishlasa ham ikkita email/to‘lov ketmasligi',
      'Exponential backoff retry (autoretry_for, retry_backoff=True)',
      'Celery Beat — har kuni soat 09:00 da kunlik xulosa yuboradigan rejali soat',
    ],
    codeTitle: 'courses/tasks.py',
    code: `from celery import shared_task
from django.db import transaction

@shared_task(bind=True, max_retries=3, retry_backoff=True)
def sertifikat_yarat_va_yubor(self, talaba_id: int, modul_slug: str):
    # Idempotent tekshiruv: avval yaratilgan bo'lsa qayta yubormaymiz
    # 1. PDF sertifikat generatsiya (2.5 soniya)
    # 2. Email va Telegram xabarnoma yuborish
    return f"Talaba #{talaba_id} uchun {modul_slug} sertifikati yuborildi"

# View ichida xavfsiz chaqirish:
# with transaction.atomic():
#     yutuq = Yutuq.objects.create(...)
#     transaction.on_commit(lambda: sertifikat_yarat_va_yubor.delay(yutuq.talaba_id, "django"))`,
    terminalOutput: [
      '$ celery -A core worker -l info',
      '[tasks] . courses.tasks.sertifikat_yarat_va_yubor',
      '[INFO] Task received: courses.tasks.sertifikat_yarat_va_yubor[9f3a]',
      '[INFO] Task succeeded in 2.48s: "Talaba #12 uchun sertifikat yuborildi"',
    ],
    quizQuestion:
      'Bazaga yozuv kiritib, darhol Celery task chaqirganda worker "Record not found" xatosi olmasligi uchun nima ishlatiladi?',
    quizOptions: [
      'transaction.on_commit(lambda: task.delay(...))',
      'time.sleep(10) view ichida',
      'DEBUG = True',
    ],
    quizCorrectIndex: 0,
    quizExplanation:
      'Mukammal! transaction.on_commit() Celery vazifasini faqat PostgreSQL COMMIT muvaffaqiyatli yakunlangandan keyingina navbatga jo‘natadi.',
  },
  {
    id: 'docker-deploy',
    step: '08',
    title: 'Docker, Gunicorn, PgBouncer va Nginx Deploy',
    subtitle:
      'Production konteynerlar, Zero-downtime migratsiya, PgBouncer, SSL va Sentry',
    level: 'Production & DevOps',
    analogyTitle: 'Hayotiy misol: Standart yuk konteyneri va port darvozasi',
    analogyText:
      'Docker — barcha jihozlari (Python, kutubxonalar) muhrlangan konteyner. Nginx — port darvozaboni (HTTPS, statik fayl, rate limit). Gunicorn — so‘rovlarni parallel ko‘taruvchi ishchilar. PgBouncer esa PostgreSQL ulanishlarini tejab beruvchi aqlli darvoza.',
    image: BACKEND_ASSETS.deploy,
    concepts: [
      'runserver faqat lokal o‘qish uchun — Production’da Gunicorn (WSGI) / Uvicorn (ASGI)',
      'Nginx Reverse Proxy: HTTPS (SSL), Gzip/Brotli, /static/ va proxy_pass',
      'PgBouncer (transaction pooling) — 1000+ ulanishda PostgreSQL RAM’ini saqlash',
      'Zero-downtime migratsiya (expand-contract + AddIndexConcurrently)',
      'DEBUG=False, ALLOWED_HOSTS, tuzilgan JSON loglar va Sentry monitoring',
    ],
    codeTitle: 'docker-compose.yml',
    code: `services:
  db:
    image: postgres:16-alpine
    env_file: .env
  redis:
    image: redis:7-alpine
  web:
    build: .
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
    depends_on: [db, redis]
  celery:
    build: .
    command: celery -A core worker -l info
    depends_on: [redis, db]
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]`,
    terminalOutput: [
      '$ docker compose up -d --build',
      '[+] Running 5/5',
      ' ✔ Container paimon-db-1      Healthy (PostgreSQL 16)',
      ' ✔ Container paimon-redis-1   Healthy (Redis 7)',
      ' ✔ Container paimon-web-1     Started (Gunicorn 4 workers)',
      ' ✔ Container paimon-celery-1  Started (Celery ready)',
      ' ✔ Container paimon-nginx-1   Started (Reverse Proxy :443)',
    ],
    quizQuestion:
      'Nega production serverda Django’ning "manage.py runserver" buyrug‘i o‘rniga Gunicorn va Nginx ishlatiladi?',
    quizOptions: [
      'runserver bitta oqimli va xavfsiz emas; Gunicorn + Nginx minglab parallel so‘rovlarni va SSL ni ko‘taradi',
      'Gunicorn SQL jadvallarni chizadi',
      'Nginx faqat Python kodini tahrirlash uchun kerak',
    ],
    quizCorrectIndex: 0,
    quizExplanation:
      'Ajoyib! Gunicorn bir nechta worker jarayonlarida Django’ni yuritadi, Nginx esa SSL, statik fayllar va yuklama taqsimotini boshqaradi.',
  },
];

export interface ProjectFileNode {
  path: string;
  role: string;
  analogy: string;
  code: string;
}

// Aynan shu o'quv platformamizning haqiqiy Django + DRF + PostgreSQL + Celery loyiha fayllari:
export const DJANGO_PROJECT_FILES: ProjectFileNode[] = [
  {
    path: 'core/settings.py',
    role: 'Paimon Akademiya saytining bosh sozlamalar markazi',
    analogy: 'Binoning elektr, xavfsizlik va ma’lumot ombori boshqaruv paneli',
    code: `import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "users",
    "courses",
]

AUTH_USER_MODEL = "users.TalabaUser"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": os.environ["POSTGRES_HOST"],
        "CONN_MAX_AGE": 60,
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.environ["REDIS_URL"],
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {"quiz": "30/minute", "auth": "10/minute"},
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
}

CELERY_BROKER_URL = os.environ["REDIS_URL"]`,
  },
  {
    path: 'core/urls.py',
    role: 'Saytning barcha API manzillari (Router)',
    analogy: 'Kiruvchi HTTP so‘rovni kerakli view bo‘limiga yo‘naltiruvchi dispetcher',
    code: `from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from courses.views import ModulViewSet, PythonTurDetailAPI, QuizTekshirAPI, SertifikatSorovAPI

router = DefaultRouter()
router.register("modules", ModulViewSet, basename="modul")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="jwt-login"),
    path("api/v1/auth/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
    path("api/v1/", include(router.urls)),
    path("api/v1/types/<slug:keyword>/", PythonTurDetailAPI.as_view()),
    path("api/v1/quiz/submit/", QuizTekshirAPI.as_view()),
    path("api/v1/progress/certificate/", SertifikatSorovAPI.as_view()),
]`,
  },
  {
    path: 'users/models.py',
    role: 'AbstractUser asosidagi maxsus Foydalanuvchi modeli',
    analogy: 'O‘quvchining pasporti va to‘plagan ballari yoziladigan shaxsiy karta',
    code: `from django.contrib.auth.models import AbstractUser
from django.db import models

class TalabaUser(AbstractUser):
    class Daraja(models.TextChoices):
        NOL = "nol", "0-bosqich (Print)"
        JUNIOR = "junior", "Junior Backend"
        MIDDLE = "middle", "Middle Django"

    email = models.EmailField(unique=True)
    daraja = models.CharField(
        max_length=16, choices=Daraja.choices, default=Daraja.NOL
    )
    tajriba_ball = models.PositiveIntegerField(default=0)
    oxirgi_faollik = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]`,
  },
  {
    path: 'courses/models.py',
    role: 'Modullar, Python Turlari va O‘quvchi Progress jadvallari',
    analogy: 'Darsliklar javoni va kim qaysi mavzuni yod olganini saqlovchi daftar',
    code: `from django.conf import settings
from django.contrib.postgres.indexes import GinIndex
from django.db import models

class TimeStampedModel(models.Model):
    yaratildi = models.DateTimeField(auto_now_add=True)
    yangilandi = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Modul(TimeStampedModel):
    tartib = models.PositiveSmallIntegerField(unique=True)
    slug = models.SlugField(unique=True)
    sarlavha = models.CharField(max_length=180)
    hayotiy_misol = models.TextField()
    kod_namuna = models.TextField()
    kalit_sozlar = models.JSONField(default=list, blank=True)
    faol = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ["tartib"]
        indexes = [GinIndex(fields=["kalit_sozlar"], name="modul_kw_gin")]

class TalabaProgress(TimeStampedModel):
    talaba = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progresslar"
    )
    modul = models.ForeignKey(Modul, on_delete=models.CASCADE)
    yakunlandi = models.BooleanField(default=False)
    togri_javoblar = models.PositiveSmallIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["talaba", "modul"], name="unique_talaba_modul"
            )
        ]`,
  },
  {
    path: 'courses/serializers.py',
    role: 'DRF Validatsiya va JSON qolipi (Mass Assignment himoyali)',
    analogy: 'Kiruvchi ma’lumotni 3 bosqichda tekshiruvchi bojxona nazorati',
    code: `from rest_framework import serializers
from .models import Modul

class ModulSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modul
        fields = ["id", "tartib", "slug", "sarlavha", "hayotiy_misol", "kalit_sozlar"]
        read_only_fields = ["id"]

class QuizTekshirSerializer(serializers.Serializer):
    modul_slug = serializers.SlugField(max_length=64)
    tanlangan_indeks = serializers.IntegerField(min_value=0, max_value=5)

    def validate_modul_slug(self, qiymat: str):
        if not Modul.objects.filter(slug=qiymat, faol=True).exists():
            raise serializers.ValidationError("Bunday faol modul topilmadi.")
        return qiymat`,
  },
  {
    path: 'courses/views.py',
    role: 'Redis kesh, Atomar yangilash va Celery on_commit Endpointlar',
    analogy: 'So‘rovlarni soniyaning mingdan birida qayta ishlovchi API markazi',
    code: `from django.core.cache import cache
from django.db import transaction
from django.db.models import F
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Modul, TalabaProgress
from .serializers import ModulSerializer, QuizTekshirSerializer
from .tasks import pdf_sertifikat_yubor

class ModulViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModulSerializer

    def get_queryset(self):
        return Modul.objects.filter(faol=True).only(
            "id", "tartib", "slug", "sarlavha", "hayotiy_misol", "kalit_sozlar"
        )

class QuizTekshirAPI(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "quiz"

    def post(self, request):
        serializer = QuizTekshirSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        slug = serializer.validated_data["modul_slug"]
        with transaction.atomic():
            progress, _ = TalabaProgress.objects.select_for_update().get_or_create(
                talaba=request.user, modul=Modul.objects.get(slug=slug)
            )
            progress.yakunlandi = True
            progress.togri_javoblar = F("togri_javoblar") + 1
            progress.save(update_fields=["yakunlandi", "togri_javoblar"])

        cache.delete(f"progress:{request.user.id}")
        return Response({"natija": "Yakunlandi", "ball": "+10 XP"}, status=200)

class SertifikatSorovAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        with transaction.atomic():
            # Faqat DB COMMIT bo'lgandan keyin Celery ishga tushadi!
            transaction.on_commit(
                lambda: pdf_sertifikat_yubor.delay(request.user.id, request.user.email)
            )
        return Response(
            {"holat": "Sertifikat fonda tayyorlanmoqda"},
            status=status.HTTP_202_ACCEPTED,
        )`,
  },
  {
    path: 'courses/tasks.py',
    role: 'Sertifikat PDF va kunlik takrorlash xabarnomalari (Celery)',
    analogy: 'Fonda mijozni kutdirmasdan ishlaydigan tezkor ishchi',
    code: `from celery import shared_task
from django.core.mail import send_mail

@shared_task(bind=True, max_retries=3, retry_backoff=True)
def pdf_sertifikat_yubor(self, talaba_id: int, email: str):
    try:
        # 1. WeasyPrint bilan PDF sertifikat yasash
        # 2. Email orqali yuborish
        send_mail(
            subject="Paimon Backend — Kurs Sertifikatingiz Tayyor!",
            message=f"Tabriklaymiz (Talaba #{talaba_id})! Paimon akademiyasini yakunladingiz.",
            from_email="academy@paimon.uz",
            recipient_list=[email],
        )
        return {"yuborildi": True, "talaba_id": talaba_id}
    except Exception as exc:
        raise self.retry(exc=exc)`,
  },
  {
    path: 'docker-compose.yml',
    role: 'Saytni PostgreSQL + Redis + Gunicorn + Celery + Nginx da ishga tushirish',
    analogy: 'Butun akademiya serverini bitta buyruqda ko‘taradigan zavod',
    code: `services:
  db:
    image: postgres:16-alpine
    env_file: .env
  redis:
    image: redis:7-alpine
  web:
    build: .
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
    depends_on: [db, redis]
  celery:
    build: .
    command: celery -A core worker -l info
    depends_on: [redis, db]
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]`,
  },
];

export interface SimulatedDjangoEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  viewName: string;
  summaryUz: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  sqlCount: string;
  cacheStatus: 'Redis HIT' | 'Cache INVALIDATED' | 'Celery QUEUED' | 'Direct DB';
  requestBody?: string;
  middlewareTrace: string[];
  responseJson: string;
}

export const DJANGO_API_ENDPOINTS: SimulatedDjangoEndpoint[] = [
  {
    id: 'list-modules',
    method: 'GET',
    path: '/api/v1/modules/?page=1',
    viewName: 'ModulViewSet.list',
    summaryUz: 'Saytdagi barcha 8 ta dars modulini Redis kesh orqali olish',
    statusCode: 200,
    statusText: '200 OK',
    latencyMs: 2.1,
    sqlCount: '0 SQL (Redis HIT)',
    cacheStatus: 'Redis HIT',
    middlewareTrace: [
      'SecurityMiddleware → HTTPS headerlar tekshirildi',
      'CommonMiddleware → URL /api/v1/modules/ moslandi',
      'RedisCache → "paimon:modules:p1" kalitidan 0.8 ms da olindi',
      'DRF JSONRenderer → 8 ta modul JSON formatida qaytarildi',
    ],
    responseJson: `{
  "count": 8,
  "cache": "HIT (TTL: 245s)",
  "results": [
    {
      "id": 1,
      "tartib": 1,
      "slug": "python-zero",
      "sarlavha": "0 dan boshlash: print(\\"Salom, Dunyo!\\") va Python",
      "kalit_sozlar": ["int", "Decimal", "str", "is vs ==", "venv"]
    },
    {
      "id": 2,
      "tartib": 2,
      "slug": "http-json",
      "sarlavha": "HTTP, JSON va API mantiqi",
      "kalit_sozlar": ["GET", "POST", "401 vs 403", "Idempotency"]
    }
  ]
}`,
  },
  {
    id: 'type-int',
    method: 'GET',
    path: '/api/v1/types/int/',
    viewName: 'PythonTurDetailAPI.get',
    summaryUz: 'Oddiy "int" ma’lumot turini hayotiy misol va SQL ekvivalenti bilan olish',
    statusCode: 200,
    statusText: '200 OK',
    latencyMs: 3.4,
    sqlCount: '1 SQL (1.1 ms)',
    cacheStatus: 'Direct DB',
    middlewareTrace: [
      'URL Resolver → slug="int" parametri PythonTurDetailAPI ga uzatildi',
      'PostgreSQL → SELECT * FROM courses_pythontur WHERE keyword=\'int\' (B-tree index)',
      'Serializer → hayotiy misol va golden_rule JSON ga o‘girildi',
    ],
    responseJson: `{
  "keyword": "int",
  "sarlavha": "Butun son (Integer)",
  "hayotiy_misol": "Sinfdagi o'quvchilar soni: 2.5 ta odam bo'lmaydi!",
  "postgresql_turi": "BIGINT (int8)",
  "namuna": "yosh = 20; type(yosh) -> <class 'int'>"
}`,
  },
  {
    id: 'quiz-submit',
    method: 'POST',
    path: '/api/v1/quiz/submit/',
    viewName: 'QuizTekshirAPI.post',
    summaryUz: 'JWT token bilan test javobini tekshirish va F() orqali XP qo‘shish',
    statusCode: 200,
    statusText: '200 OK',
    latencyMs: 9.8,
    sqlCount: '2 SQL (SELECT FOR UPDATE + UPDATE)',
    cacheStatus: 'Cache INVALIDATED',
    requestBody: `{
  "modul_slug": "postgresql-orm",
  "tanlangan_indeks": 1
}`,
    middlewareTrace: [
      'JWTAuthentication → Authorization: Bearer eyJhbG... tekshirildi (Talaba #12)',
      'ScopedRateThrottle → "quiz" limiti tekshirildi (3/30 per minute)',
      'QuizTekshirSerializer.is_valid() → 3-bosqichli validatsiyadan o‘tdi',
      'transaction.atomic() → F("togri_javoblar") + 1 bilan atomar yangilandi',
      'cache.delete("progress:12") → eski kesh tozalandi',
    ],
    responseJson: `{
  "natija": "Yakunlandi",
  "modul": "postgresql-orm",
  "ball": "+10 XP",
  "jami_xp": 80,
  "eslatma": "select_related() N+1 muammosini 1 ta JOIN bilan yechadi."
}`,
  },
  {
    id: 'certificate-async',
    method: 'POST',
    path: '/api/v1/progress/certificate/',
    viewName: 'SertifikatSorovAPI.post',
    summaryUz: 'transaction.on_commit() bilan PDF sertifikatni Celery navbatiga tashlash',
    statusCode: 202,
    statusText: '202 Accepted',
    latencyMs: 11.4,
    sqlCount: '1 SQL + 1 Redis Push',
    cacheStatus: 'Celery QUEUED',
    requestBody: `{
  "til": "uz",
  "format": "PDF"
}`,
    middlewareTrace: [
      'JWTAuthentication → Talaba #12 (amir@paimon.uz) aniqlandi',
      'transaction.atomic() → Sertifikat yozuvi bazaga saqlandi va COMMIT bo‘ldi',
      'transaction.on_commit() → pdf_sertifikat_yubor.delay(12, "amir@paimon.uz")',
      'Response → Foydalanuvchi 2.5 soniya kutmadi, darhol 202 Accepted qaytdi',
    ],
    responseJson: `{
  "holat": "Sertifikat fonda tayyorlanmoqda",
  "celery_task_id": "9f3a8c12-4b20-41e8-91d2-paimon",
  "javob_vaqti_ms": 11.4,
  "kutilayotgan_email": "amir@paimon.uz"
}`,
  },
];
