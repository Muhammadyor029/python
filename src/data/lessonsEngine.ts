export type LessonDomain = 'python' | 'django' | 'orm' | 'api' | 'postgres';

export interface CodeExampleLevel {
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Professional' | 'Real Project';
  title: string;
  code: string;
  lineNotes: {line: number; note: string}[];
}

export interface DeepLesson {
  id: string;
  domain: LessonDomain;
  difficulty:
    | 'Absolute Beginner'
    | 'Beginner'
    | 'Intermediate'
    | 'Upper Intermediate'
    | 'Advanced'
    | 'Expert';
  title: string;
  subtitle: string;
  visualLabId: 'python-visual' | 'django-visual' | 'orm-visual' | 'api-visual' | 'postgres-visual';
  sourceReference: string;
  // 01. Introduction
  intro: {
    whatIsIt: string;
    whyExists: string;
    problemSolved: string;
    whereUsed: string;
    prerequisites: string[];
  };
  // 02. Real World Analogy
  analogy: {
    title: string;
    story: string;
  };
  // 03. Deep Explanation
  deepExplanation: {
    internalMechanism: string;
    workingPrinciple: string;
    architectureRole: string;
    pros: string[];
    cons: string[];
    limitations: string[];
    whenToUse: string;
    whenNotToUse: string;
  };
  // 04. Animated Visualization link cue
  visualizationHint: string;
  // 05. Code Examples (Basic -> Real Project) with line-by-line notes
  codeExamples: CodeExampleLevel[];
  // 06. Experiment (Editable & Runnable on Python sandbox)
  experiment: {
    prompt: string;
    starterCode: string;
    note: string;
  };
  // 07. Common Mistakes
  commonMistakes: {
    mistake: string;
    whyWrong: string;
    fix: string;
  }[];
  // 08. Practical Tasks
  practicalTasks: string[];
  // 09. Real Project Integration
  realProjectIntegration: {
    project: string;
    explanation: string;
    snippet: string;
  };
  // 10. Knowledge Check
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  // 11. Summary
  summary: string[];
  // 12. Next Step
  nextStep: {
    nextTopicTitle: string;
    preparationTip: string;
  };
}

export const DEEP_LESSONS: DeepLesson[] = [
  {
    id: 'py-memory-ref',
    domain: 'python',
    difficulty: 'Beginner',
    title: 'Python Xotira Modeli: Obyektlar, Reference, is vs == va Copy',
    subtitle:
      'O‘zgaruvchi nima uchun "quti" emas, balki xotiradagi obyektga yopishtirilgan yorliq (reference) ekani',
    visualLabId: 'python-visual',
    sourceReference: 'Python 3.12 Official Docs — Data Model & copy module',
    intro: {
      whatIsIt:
        'Python’da har bir qiymat (int, str, list, dict, funksiya) Heap xotirasida PyObject sifatida yaratiladi. O‘zgaruvchi nomi esa qiymatni o‘zida saqlamaydi, balki shu obyekt manziliga ishora qiluvchi nom (reference) hisoblanadi.',
      whyExists:
        'Katta ro‘yxat yoki obyektlarni har safar funksiyaga uzatganda nusxa ko‘chirmasdan, tezkor manzil (pointer) uzatish orqali xotira va CPU vaqtini tejash uchun.',
      problemSolved:
        'Yashirin mutatsiya (bitta joyda o‘zgartirsangiz boshqa joydagi ma’lumot buzilib ketishi) va mutable default argument xatolarini oldini olish.',
      whereUsed:
        'Har bir Python funksiyasida, Django View kontekstlarida, kesh obyektlarida va JSON ma’lumotlarni transformatsiya qilishda.',
      prerequisites: ['Asosiy turlar (int, str, list, dict)', 'print() va funksiyalar'],
    },
    analogy: {
      title: 'Ombor qutisi va stiker yorliqlar',
      story:
        'Tasavvur qiling, omborda ichida [non, choy] turgan bitta savat bor. `a = ["non", "choy"]` deganingizda savatga "a" stikeri yopishadi. `b = a` qilsangiz, yangi savat olinmaydi — o‘sha bitta savatga ikkinchi "b" stikeri ham yopishtiriladi! Endi `b.append("asal")` desangiz, "a" dan qaraganda ham "asal" ko‘rinadi.',
    },
    deepExplanation: {
      internalMechanism:
        'CPython har bir PyObject tuzilmasida `ob_refcnt` (reference counter) va `ob_type` saqlaydi. Yangi o‘zgaruvchi bog‘langanda `ob_refcnt` +1 oshadi, o‘chirilganda -1 kamayadi va 0 bo‘lganda xotiradan darhol tozalanadi.',
      workingPrinciple:
        '`==` operatori obyektlarning qiymatini (`__eq__`) solishtiradi. `is` esa ularning xotiradagi `id()` manzili aynan bitta obyekt ekanini tekshiradi. `copy.copy()` faqat tashqi konteynerni yangi yaratadi, ichki elementlarga eski havolalarni qoldiradi; `copy.deepcopy()` esa barcha ichma-ich daraxtni rekursiv nusxalaydi.',
      architectureRole:
        'Ma’lumotlar oqimida kutilmagan side-effect’lar chiqmasligi uchun xizmatlararo DTO/sozlamalarni xavfsiz izolyatsiya qiladi.',
      pros: [
        'Funksiyalarga katta ma’lumotlarni O(1) vaqtda uzatish',
        '`x is None` kabi manzil tekshiruvlari juda tez (bitta pointer taqqoslash)',
      ],
      cons: [
        'Mutable obyektlar (`list`, `dict`, `set`) ehtiyotsiz ulashilsa, yashirin bug keltirib chiqaradi',
        '`deepcopy()` juda chuqur va katta obyektlarda sekin va ko‘p RAM yeydi',
      ],
      limitations: [
        'CPython kichik butun sonlarni (-5..256) va ba’zi qisqa satrlarni interning (kesh) qiladi — shu bois sonlarni `is` bilan solishtirish xavfli!',
      ],
      whenToUse:
        '`is` ni faqat `None`, `True`, `False` yoki sentinel obyektlar uchun ishlating. Qiymat solishtirishda doim `==` ishlating.',
      whenNotToUse:
        'Hech qachon `if user_id is 300:` yoki `def f(items=[]):` yozmang.',
    },
    visualizationHint:
      'Pastdagi Python Visual Lab -> Variables & Memory bo‘limida Heap manzillari va Shallow/Deep Copy o‘qlarini jonli boshqaring.',
    codeExamples: [
      {
        level: 'Basic',
        title: 'Alias vs == va is farqi',
        code: `a = [10, 20]
b = a
c = [10, 20]

print(a == c)  # Qiymatlar teng
print(a is c)  # Xotira manzili boshqa
print(a is b)  # Bitta obyekt`,
        lineNotes: [
          {line: 2, note: 'b = a yangi ro‘yxat yaratmaydi, o‘sha manzilga ikkinchi yorliq bog‘laydi.'},
          {line: 3, note: 'c mutlaqo yangi ro‘yxat obyektini Heapda yaratadi.'},
          {line: 5, note: 'a == c True, chunki elementlari bir xil.'},
          {line: 6, note: 'a is c False, chunki id(a) != id(c).'},
        ],
      },
      {
        level: 'Intermediate',
        title: 'Shallow Copy tuzog‘i',
        code: `import copy

asl = [[1, 2], [3, 4]]
sayoz = copy.copy(asl)
sayoz[0].append(99)

print("Asl:", asl)
print("Sayoz:", sayoz)`,
        lineNotes: [
          {line: 4, note: 'Tashqi ro‘yxat yangi, lekin ichidagi [1, 2] ro‘yxat hanuz umumiy!'},
          {line: 5, note: 'Ichki ro‘yxatni o‘zgartirish asl ma’lumotga ham ta’sir qiladi.'},
        ],
      },
      {
        level: 'Advanced',
        title: 'Deep Copy va Mutable Default tuzatishi',
        code: `import copy

def buyurtma_qosh(nom: str, savat: list[str] | None = None) -> list[str]:
    if savat is None:
        savat = []
    savat.append(nom)
    return savat

sozlama = {"kesh": {"ttl": 60}}
nusxa = copy.deepcopy(sozlama)
nusxa["kesh"]["ttl"] = 300
print(sozlama["kesh"]["ttl"], nusxa["kesh"]["ttl"])`,
        lineNotes: [
          {line: 3, note: 'Default qiymat sifatida [] emas, doim None ishlatiladi.'},
          {line: 10, note: 'deepcopy ichki lug‘atni ham alohida manzilga ajratadi.'},
        ],
      },
      {
        level: 'Professional',
        title: 'Immutability orqali himoya (frozen dataclass)',
        code: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class NarxQoidasi:
    valyuta: str
    foiz: int

qoida = NarxQoidasi("UZS", 12)
print(qoida)`,
        lineNotes: [
          {line: 3, note: 'frozen=True maydonlarni o‘zgartirishni taqiqlaydi (TypeError/FrozenInstanceError).'},
          {line: 3, note: 'slots=True har bir obyektda alohida __dict__ yaratilishini oldini oladi.'},
        ],
      },
      {
        level: 'Real Project',
        title: 'Django sozlamalarini xavfsiz meros olish',
        code: `import copy

BASE_API_CONFIG = {
    "rate_limit": {"anon": "30/min", "user": "120/min"},
    "pagination": 20,
}

def tenant_config(custom_user_limit: str) -> dict:
    cfg = copy.deepcopy(BASE_API_CONFIG)
    cfg["rate_limit"]["user"] = custom_user_limit
    return cfg

vip = tenant_config("600/min")
print("Base:", BASE_API_CONFIG["rate_limit"]["user"])
print("VIP:", vip["rate_limit"]["user"])`,
        lineNotes: [
          {line: 9, note: 'Agar copy.copy() ishlatilganida, BASE_API_CONFIG ham o‘zgarib barcha mijozlarga ta’sir qilgan bo‘lardi.'},
        ],
      },
    ],
    experiment: {
      prompt: 'Pastdagi kodni o‘zgartirib ko‘ring: `copy.copy` ni `copy.deepcopy` ga almashtiring va `a` o‘zgaradimi yoki yo‘qmi tekshiring.',
      starterCode: `import copy

a = {"foydalanuvchi": "Amir", "rollar": ["student"]}
b = copy.copy(a)  # Buni copy.deepcopy(a) ga almashtirib sinang!
b["rollar"].append("admin")

print("a =", a)
print("b =", b)
print("a['rollar'] is b['rollar'] ->", a["rollar"] is b["rollar"])`,
      note: 'Haqiqiy Python sandbox serverida bajariladi.',
    },
    commonMistakes: [
      {
        mistake: 'def add_item(item, items=[]):',
        whyWrong: 'Default ro‘yxat funksiya e’lon qilinganda FAQAT 1 marta yaratiladi va barcha chaqiruvlar o‘rtasida bo‘lishiladi.',
        fix: 'items: list | None = None qilib, funksiya ichida if items is None: items = [] yozing.',
      },
      {
        mistake: 'if status_code is 200:',
        whyWrong: 'Katta sonlarda (masalan 404 yoki 1000) CPython yangi obyekt yaratishi mumkin va is False beradi.',
        fix: 'Son va matnlarni doim == bilan solishtiring; is faqat None uchun.',
      },
    ],
    practicalTasks: [
      'Ikki o‘lchovli matritsa yaratib, shallow va deep copy farqini isbotlovchi funksiya yozing.',
      'Mutable default argumentsiz xavfsiz `kesh_qosh(kalit, qiymat, ombor=None)` funksiyasini yarating.',
    ],
    realProjectIntegration: {
      project: 'Paimon Multi-Tenant SaaS Konfiguratsiya Servisi',
      explanation: 'Har bir kompaniya (tenant) uchun default API limitlarini nusxalaganda `deepcopy` ishlatilmasa, bitta mijozning limiti barcha mijozlarga tarqalib ketadi.',
      snippet: `tenant_settings = copy.deepcopy(DEFAULT_LIMITS)`,
    },
    knowledgeCheck: {
      question: 'x = [1, [2, 3]]; y = x.copy(); y[1].append(4) bajarilganda x[1] ning qiymati nima bo‘ladi?',
      options: ['[2, 3, 4]', '[2, 3]', 'TypeError chiqadi'],
      correctIndex: 0,
      explanation: '.copy() sayoz nusxa yaratadi, shuning uchun ichki [2, 3] ro‘yxat hanuz x va y uchun bitta manzilda.',
    },
    summary: [
      'O‘zgaruvchi qiymat emas — obyekt manziliga bog‘langan nomdir.',
      '`==` qiymatni, `is` esa xotira manzilini solishtiradi.',
      'Ichma-ich mutable obyektlarda `copy.deepcopy()` ishlating.',
    ],
    nextStep: {
      nextTopicTitle: 'Dekoratorlar, Closure va LEGB Scope',
      preparationTip: 'Funksiyalar ham Python’da oddiy obyekt ekanini va boshqa funksiyadan qaytarilishi mumkinligini eslab qoling.',
    },
  },
  {
    id: 'py-decorators-closures',
    domain: 'python',
    difficulty: 'Intermediate',
    title: 'Python Dekoratorlar, Closure va @wraps Mexanizmi',
    subtitle:
      'First-class funksiyalar, yopiq muhit (closure) va funksiyani o‘zgartirmasdan kengaytirish',
    visualLabId: 'python-visual',
    sourceReference: 'Python 3.12 Official Docs — PEP 318 & functools.wraps',
    intro: {
      whatIsIt:
        'Dekorator — bu boshqa funksiyani argument sifatida qabul qilib, uning atrofida qo‘shimcha mantiq (log yozish, keshlash, ruxsat tekshirish) qo‘shadigan va yangi wrapper funksiya qaytaradigan Python vositasi.',
      whyExists:
        'O‘nlab funksiyalar ichiga bir xil tekshiruv (vaqt o‘lchash, auth, retry) kodini qayta-qayta nusxalamasdan DRY tamoyilini saqlash uchun.',
      problemSolved:
        'Asosiy biznes mantiqni texnik kesishuvchi vazifalardan (logging, caching, auth) toza ajratib beradi.',
      whereUsed:
        '@functools.lru_cache, @dataclass, @property, @staticmethod, Celery @shared_task, Django @login_required.',
      prerequisites: ['Funksiyalar (*args, **kwargs)', 'LEGB Scope va Closure'],
    },
    analogy: {
      title: 'Sovg‘a qutisi va o‘ram qog‘ozi',
      story:
        'Asl funksiyangiz — ichidagi soat sovg‘asi. Dekorator — bu sovg‘ani buzmasdan ustidan chiroyli o‘ram qog‘ozi va xavfsizlik muhrini yopishtirish. Qabul qiluvchi avval muhrni tekshiradi, keyin sovg‘ani ochadi.',
    },
    deepExplanation: {
      internalMechanism:
        '`@dekorator` sintaksisi aslida sintaktik shakar (syntactic sugar): `fn = dekorator(fn)` bilan aynan bir xil! Modul import qilingan paytda (definition time) dekorator bir marta ishga tushadi; funksiya chaqirilganda (call time) esa ichidagi `wrapper(*args, **kwargs)` ishlaydi.',
      workingPrinciple:
        'Ichki `wrapper` funksiyasi tashqi `dekorator` doirasidagi `func` o‘zgaruvchisini `__closure__` katakchasida eslab qoladi. `@functools.wraps(func)` esa asl funksiyaning `__name__`, `__doc__` va `__wrapped__` metadata’sini ko‘chirib beradi.',
      architectureRole:
        'Funksiya darajasidagi aspect-oriented kengaytirish vositasi (Django Middleware esa HTTP request/response darajasida ishlaydi — ikkalasi boshqa qatlam!).',
      pros: [
        'Kod takrorlanishini keskin kamaytiradi',
        'Funksiya signaturasini toza saqlaydi',
      ],
      cons: [
        '@wraps qo‘yilmasa stack trace va OpenAPI/Swagger hujjatlari buziladi',
        '3–4 ta dekorator ustma-ust qo‘yilsa debug qilish qiyinlashadi',
      ],
      limitations: [
        'Asinxron (`async def`) funksiyalar uchun wrapper ham `async def` + `await func(...)` bo‘lishi shart!',
      ],
      whenToUse:
        'Retry, keshlash, funksiya ishlash vaqtini o‘lchash, argument validatsiyasi yoki ruxsat tekshirishda.',
      whenNotToUse:
        'Butun veb-saytning barcha URL’lariga tegishli HTTP header qo‘shishda (buning uchun Django Middleware kerak).',
    },
    visualizationHint:
      'Python Visual Lab -> Advanced Python -> Decorator tabida `func` ning `wrapper` ichidan qadam-baqadam o‘tishini kuzating.',
    codeExamples: [
      {
        level: 'Basic',
        title: 'Dekorator = funksiya ichida funksiya',
        code: `def salom_oshir(func):
    def wrapper():
        print("--- Boshlandi ---")
        func()
        print("--- Tugadi ---")
    return wrapper

@salom_oshir
def hisobot():
    print("Hisobot chiqarildi")

hisobot()`,
        lineNotes: [
          {line: 8, note: 'hisobot = salom_oshir(hisobot) bilan teng.'},
          {line: 12, note: 'Aslida endi wrapper() chaqirilmoqda.'},
        ],
      },
      {
        level: 'Intermediate',
        title: '*args, **kwargs va @wraps bilan to‘g‘ri dekorator',
        code: `from functools import wraps
import time

def vaqt_olcha(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        natija = func(*args, **kwargs)
        ms = (time.perf_counter() - t0) * 1000
        print(f"{func.__name__} -> {ms:.2f} ms")
        return natija
    return wrapper

@vaqt_olcha
def yigindi(n: int) -> int:
    return sum(range(n))

print(yigindi(10000), yigindi.__name__)`,
        lineNotes: [
          {line: 5, note: '@wraps(func) bo‘lmasa yigindi.__name__ "wrapper" bo‘lib qolardi.'},
          {line: 8, note: 'return natija unutilsa, funksiya None qaytarib qo‘yadi!'},
        ],
      },
      {
        level: 'Advanced',
        title: 'Parametrli Retry dekoratori (3 qavatli funksiya)',
        code: `from functools import wraps

def retry(urinishlar: int = 3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            oxirgi_xato = None
            for i in range(1, urinishlar + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    oxirgi_xato = exc
                    print(f"Urinish {i} muvaffaqiyatsiz: {exc}")
            raise oxirgi_xato
        return wrapper
    return decorator`,
        lineNotes: [
          {line: 3, note: 'Argument oladigan dekorator tashqaridan yana bir qavat funksiya qaytaradi.'},
          {line: 14, note: 'Barcha urinishlar tugasa oxirgi asl xatoni ko‘tarish kerak.'},
        ],
      },
      {
        level: 'Professional',
        title: 'Asyncio va Sync ni farqlovchi dekorator',
        code: `import inspect
from functools import wraps

def log_call(func):
    if inspect.iscoroutinefunction(func):
        @wraps(func)
        async def async_wrap(*args, **kwargs):
            return await func(*args, **kwargs)
        return async_wrap

    @wraps(func)
    def sync_wrap(*args, **kwargs):
        return func(*args, **kwargs)
    return sync_wrap`,
        lineNotes: [
          {line: 5, note: 'Async funksiyani oddiy wrapperga o‘rasangiz coroutine await qilinmay qoladi!'},
        ],
      },
      {
        level: 'Real Project',
        title: 'Idempotency va ruxsat tekshiruvchi API yordamchisi',
        code: `from functools import wraps

def rol_kerak(ruxsat_etilgan: set[str]):
    def decorator(func):
        @wraps(func)
        def wrapper(user_rol: str, *args, **kwargs):
            if user_rol not in ruxsat_etilgan:
                raise PermissionError(f"{user_rol} uchun ruxsat yo‘q")
            return func(user_rol, *args, **kwargs)
        return wrapper
    return decorator`,
        lineNotes: [
          {line: 7, note: 'Biznes funksiyasiga kirishdan oldin RBAC tekshiruvi bajariladi.'},
        ],
      },
    ],
    experiment: {
      prompt: 'Pastdagi kodda `@wraps(func)` ni olib tashlab ko‘ring va `hisob.__name__` qanday o‘zgarishini kuzating.',
      starterCode: `from functools import wraps

def audit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[AUDIT] {func.__name__} chaqirildi")
        return func(*args, **kwargs)
    return wrapper

@audit
def tolov_hisobla(summa: int) -> int:
    return int(summa * 1.12)

print("Natija:", tolov_hisobla(1000))
print("Funksiya nomi:", tolov_hisobla.__name__)`,
      note: 'Python sandboxda darhol natijani ko‘ring.',
    },
    commonMistakes: [
      {
        mistake: 'wrapper ichida `return func(*args, **kwargs)` o‘rniga shunchaki `func(...)` chaqirib qo‘yish',
        whyWrong: 'Dekorator qo‘yilgan funksiya kutilmaganda `None` qaytara boshlaydi.',
        fix: 'Har doim natijani saqlab `return natija` qiling.',
      },
      {
        mistake: 'Dekorator ichida `func(...)` ni wrapper tashqarisida chaqirib qo‘yish',
        whyWrong: 'Funksiya fayl import qilinishi bilanoq ishlab ketadi, chaqirilganda emas.',
        fix: 'Asl funksiyani faqat `def wrapper(...)` ichida chaqiring.',
      },
    ],
    practicalTasks: [
      'Funksiya natijasini argumentlari bo‘yicha lug‘atda saqlab qoladigan oddiy `@memoize` dekoratorini yozing.',
      'Faqat musbat sonlar qabul qiladigan `@faqat_musbat` dekoratorini yozing.',
    ],
    realProjectIntegration: {
      project: 'Paimon Django & Celery Servisi',
      explanation: 'Django REST viewlarida rate-limit va Celery tasklarda exponential backoff retry aynan parametrli dekoratorlar yordamida yoziladi.',
      snippet: `@shared_task(bind=True, autoretry_for=(ConnectionError,), retry_backoff=True)`,
    },
    knowledgeCheck: {
      question: 'Ikki dekorator @A ustida @B ostida yozilsa, funksiyani chaqirganda qaysi biri BIRINCHI ishga tushadi?',
      options: ['Yuqoridagi @A wrapperi birinchi', 'Pastdagi @B wrapperi birinchi', 'Ikkalasi parallel'],
      correctIndex: 0,
      explanation: '@A @B def f(): aslida f = A(B(f)) degani. Shu bois tashqi @A wrapper birinchi chaqiriladi, ichkarida @B ni chaqiradi.',
    },
    summary: [
      'Dekorator import vaqtida funksiya ustidan wrapper qo‘yadi.',
      'Doim `@wraps(func)` va `return func(*args, **kwargs)` yozing.',
      'Argumentli dekorator 3 qavatli (factory → decorator → wrapper) bo‘ladi.',
    ],
    nextStep: {
      nextTopicTitle: 'Generators (yield) va Asyncio Event Loop',
      preparationTip: 'Closure kabi generator ham bajarilish holatini (stack frame) xotirada saqlab tura olishini ko‘rasiz.',
    },
  },
  {
    id: 'dj-request-lifecycle',
    domain: 'django',
    difficulty: 'Intermediate',
    title: 'Django Request Lifecycle, Middleware Zanjiri va WSGI vs ASGI',
    subtitle:
      'Brauzerdan kelgan HTTP so‘rov Django ichidan javobgacha aynan qanday bosib o‘tishi',
    visualLabId: 'django-visual',
    sourceReference: 'Django 5.1 Official Docs — HTTP Handling & Middleware',
    intro: {
      whatIsIt:
        'Django Request Lifecycle — bu mijozdan kelgan xom HTTP so‘rov `HttpRequest` obyektiga aylanib, Middleware, URL Resolver, View va ORM’dan o‘tib, `HttpResponse` sifatida qaytishining qat’iy ketma-ketligi.',
      whyExists:
        'Har bir View funksiyasida HTTPS tekshiruvi, Session yuklash, CSRF himoya va foydalanuvchini aniqlash kodlarini yozmaslik uchun.',
      problemSolved:
        'Cross-cutting HTTP xavfsizligi, marshrutlash va xatoliklarni markazlashgan yagona quvur (pipeline) orqali boshqaradi.',
      whereUsed:
        'Har bir Django veb-sahifasi va REST API so‘rovida (100% barcha endpointlarda).',
      prerequisites: ['HTTP metodlar va status kodlar', 'Python funksiyalar va klasslar'],
    },
    analogy: {
      title: 'Aeroport xavfsizlik nazorati va kutish zali',
      story:
        'Yo‘lovchi (HTTP Request) aeroportga kiradi: Nginx (tashqi darvoza) → Security Middleware (metall detektor) → Session/Auth Middleware (pasport tekshiruvi) → URL Resolver (qaysi terminal/gate?) → View (chipta ro‘yxati) → ORM (baza) → va orqaga Middleware orqali chiqish!',
    },
    deepExplanation: {
      internalMechanism:
        'So‘rov WSGI/ASGI server (Gunicorn/Uvicorn) orqali `WSGIHandler` / `ASGIHandler` ga keladi. U `MIDDLEWARE` ro‘yxatini yuqoridan pastga (onion model!) kesib o‘tadi, `ROOT_URLCONF` dan regex/path bo‘yicha mos view’ni topadi va qaytishda Middleware’lardan pastdan yuqoriga teskari tartibda chiqadi.',
      workingPrinciple:
        'WSGI har bir so‘rovni bitta sinxron thread/worker bilan bajaradi. ASGI (`async def` view + Uvicorn) esa bitta Event Loop ichida minglab I/O kutayotgan (WebSocket, SSE, tashqi API) so‘rovlarni parallel ushlab tura oladi.',
      architectureRole:
        'Kiruvchi tarmoq trafikini biznes mantiqdan (Views/Services) ajratuvchi himoya va marshrutlash qatlami.',
      pros: [
        'Middleware tartibi aniq va modulli',
        'CSRF, X-Frame-Options, Session avtomatik himoyalangan',
      ],
      cons: [
        'Og‘ir sinxron DB so‘rov `async def` view ichida Event Loop’ni muzlatib qo‘yishi mumkin (`sync_to_async` kerak)',
      ],
      limitations: [
        'Middleware tartibi muhim: `AuthenticationMiddleware` albatta `SessionMiddleware` dan KEYIN turishi shart!',
      ],
      whenToUse:
        'Standart CRUD API va adminka uchun WSGI (Gunicorn) yetarli; WebSocket (Django Channels) yoki ko‘p tashqi API chaqiruvlarida ASGI (Uvicorn) ishlating.',
      whenNotToUse:
        'Faqat bitta endpointga kerakli biznes tekshiruvini global Middleware qilmang — decorator yoki DRF Permission yozing.',
    },
    visualizationHint:
      'Django Visual Lab bo‘limida Play tugmasini bosib, Request zanjirining har bir bosqichini (Middleware → URL → View → ORM → Response) bosing.',
    codeExamples: [
      {
        level: 'Basic',
        title: 'Oddiy Django Function View va URL',
        code: `from django.http import JsonResponse
from django.urls import path

def salom_view(request):
    return JsonResponse({"xabar": "Salom, Paimon!", "metod": request.method})

urlpatterns = [
    path("api/salom/", salom_view, name="salom"),
]`,
        lineNotes: [
          {line: 4, note: 'View har doim birinchi argument sifatida HttpRequest oladi.'},
          {line: 5, note: 'JsonResponse avtomatik Content-Type: application/json qo‘yadi.'},
        ],
      },
      {
        level: 'Intermediate',
        title: 'Custom Latency Logging Middleware',
        code: `import time

class RequestVaqtMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response  # Keyingi qatlamga havola

    def __call__(self, request):
        boshlanish = time.perf_counter()
        response = self.get_response(request)  # View bajariladi
        ms = (time.perf_counter() - boshlanish) * 1000
        response["X-Request-Time-Ms"] = f"{ms:.2f}"
        return response`,
        lineNotes: [
          {line: 4, note: '__init__ server ishga tushganda faqat 1 marta chaqiriladi.'},
          {line: 9, note: 'get_response(request) dan oldin — kirish, keyin — chiqish fazasi.'},
        ],
      },
      {
        level: 'Advanced',
        title: 'Middleware tartibi va ASGI mosligi',
        code: `from asgiref.sync import iscoroutinefunction
from django.utils.decorators import sync_and_async_middleware

@sync_and_async_middleware
def trace_middleware(get_response):
    if iscoroutinefunction(get_response):
        async def middleware(request):
            request.trace_id = "req_async"
            return await get_response(request)
        return middleware
    def middleware(request):
        request.trace_id = "req_sync"
        return get_response(request)
    return middleware`,
        lineNotes: [
          {line: 4, note: 'Django 5 da ASGI muhitida thread-almashtirish xarajatini yo‘qotadi.'},
        ],
      },
      {
        level: 'Professional',
        title: 'View’da ASGI async + Django 5 aall() ORM',
        code: `from django.http import JsonResponse
from .models import Kurs

async def kurslar_async_view(request):
    # Django 5 da asinxron queryset iteratsiyasi:
    royxat = [k.nomi async for k in Kurs.objects.filter(faol=True)[:10]]
    return JsonResponse({"kurslar": royxat})`,
        lineNotes: [
          {line: 6, note: 'Oddiy `for` o‘rniga `async for` ishlatilmasa SynchronousOnlyOperation xatosi chiqadi!'},
        ],
      },
      {
        level: 'Real Project',
        title: 'Production MIDDLEWARE ketma-ketligi (settings.py)',
        code: `MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",       # 1. HTTPS / HSTS
    "django.contrib.sessions.middleware.SessionMiddleware",# 2. Session yuklash
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",           # 3. CSRF himoya
    "django.contrib.auth.middleware.AuthenticationMiddleware", # 4. request.user!
    "core.middleware.RequestVaqtMiddleware",
]`,
        lineNotes: [
          {line: 6, note: 'AuthenticationMiddleware SessionMiddleware dan keyin turishi shart.'},
        ],
      },
    ],
    experiment: {
      prompt: 'Python yordamida Onion (piyoz) Middleware zanjiri kirishda 1→2→View va chiqishda 2→1 tartibda ishlashini sinab ko‘ring.',
      starterCode: `def view(req):
    print("  [3] View bajarildi:", req)
    return {"status": 200}

def auth_mw(next_fn):
    def handle(req):
        print(" [2] Auth kirish")
        res = next_fn(req)
        print(" [4] Auth chiqish")
        return res
    return handle

def log_mw(next_fn):
    def handle(req):
        print("[1] Log kirish")
        res = next_fn(req)
        print("[5] Log chiqish")
        return res
    return handle

app = log_mw(auth_mw(view))
print("Natija:", app("/api/orders/"))`,
      note: 'Python sandbox da Django Middleware Onion modeli bajariladi.',
    },
    commonMistakes: [
      {
        mistake: 'AuthenticationMiddleware ni SessionMiddleware dan oldinga qo‘yish',
        whyWrong: 'request.user sessiondan o‘qiladi — session hali yuklanmagan bo‘ladi va ImproperlyConfigured chiqadi.',
        fix: 'Har doim SessionMiddleware yuqorida, AuthenticationMiddleware pastda tursin.',
      },
      {
        mistake: 'async view ichida time.sleep() yoki sinxron requests.get() chaqirish',
        whyWrong: 'Butun Event Loop qotib qoladi va boshqa barcha foydalanuvchilar javob ololmaydi.',
        fix: 'asyncio.sleep() va httpx.AsyncClient() ishlating.',
      },
    ],
    practicalTasks: [
      'So‘rov sarlavhasida X-Client-Version bo‘lmasa 426 status qaytaruvchi custom Middleware loyihalang.',
    ],
    realProjectIntegration: {
      project: 'Paimon LMS Core Gateway',
      explanation: 'Har bir API so‘roviga `X-Request-ID` biriktirilib, xatolik yuz berganda Sentry va PostgreSQL audit loglari aynan shu ID bilan bog‘lanadi.',
      snippet: `response["X-Request-ID"] = request.request_id`,
    },
    knowledgeCheck: {
      question: 'Middleware-A ro‘yxatda Middleware-B dan yuqorida tursa, Response qaytishda qaysi biri OXIRGI ishlaydi?',
      options: ['Middleware-A', 'Middleware-B', 'Tasodifiy'],
      correctIndex: 0,
      explanation: 'Onion modeli: kirishda A -> B -> View, qaytishda esa View -> B -> A tartibda ishlaydi.',
    },
    summary: [
      'Middleware onion (piyoz) qatlamlari kabi kirishda ham, chiqishda ham ishlaydi.',
      'ASGI asinxron I/O uchun, WSGI standart sinxron so‘rovlar uchun qulay.',
    ],
    nextStep: {
      nextTopicTitle: 'Django ORM QuerySet Lazy Evaluation & N+1 Optimization',
      preparationTip: 'View ichidan bazaga murojaat qilganda necha marta SQL ketayotganini keyingi darsda o‘lchaymiz.',
    },
  },
  {
    id: 'orm-lazy-nplus1',
    domain: 'orm',
    difficulty: 'Upper Intermediate',
    title: 'Django ORM: Lazy Evaluation, select_related, prefetch_related va N+1',
    subtitle:
      'QuerySet qachon bazaga uriladi va nega 100 qatorlik jadval serverni qulatishi mumkin',
    visualLabId: 'orm-visual',
    sourceReference: 'Django 5.1 Official Docs — QuerySets & Optimization',
    intro: {
      whatIsIt:
        'Django ORM Python klasslari orqali SQL yozish imkonini beradi. QuerySet — "dangasa" (lazy): `.filter()` va `.exclude()` yozganingizda bazaga HALI so‘rov ketmaydi, faqat ma’lumotni o‘qiganingizda SQL bajariladi.',
      whyExists:
        'SQL injeksiyadan himoyalanish, kodni modulli filtrlash va ma’lumotlar bazasi bilan Python obyektlaridek ishlash uchun.',
      problemSolved:
        'Bitta sahifa yuklanganda yashirincha 100–500 ta SQL so‘rovi ketib qoladigan N+1 muammosini yo‘qotish.',
      whereUsed:
        'ListView, DRF Serializerlar, hisobotlar, dashboardlar va API ro‘yxatlarida.',
      prerequisites: ['SQL JOIN asoslari', 'ForeignKey va ManyToMany munosabatlar'],
    },
    analogy: {
      title: 'Bozorga 100 marta qatnash vs 1 ta ro‘yxat bilan borish',
      story:
        '100 ta kitob ro‘yxatini olib, har bir kitobning muallifini bilish uchun do‘konga alohida 100 marta qatnash — N+1 muammosi. `select_related("author")` esa bitta chekda SQL JOIN bilan kitobni ham, muallifni ham bir kelishda olib keladi!',
    },
    deepExplanation: {
      internalMechanism:
        'QuerySet faqat quyidagi paytlarda evaluate (SQLga aylanib bazaga yuborilish) bo‘ladi: `for` sikli, `list(qs)`, `len(qs)`, slicing `qs[0]`, `bool(qs)`, `repr(qs)`. `select_related()` SQL `INNER/LEFT OUTER JOIN` qiladi (`ForeignKey` / `OneToOne`). `prefetch_related()` esa ikkinchi alohida SQL `WHERE id IN (...)` yuborib, ularni Python xotirasida bog‘laydi (`ManyToMany` / reverse `ForeignKey`).',
      workingPrinciple:
        'Bundan tashqari `F()` qiymatlarni Python’ga olib chiqmasdan bazaning o‘zida atomar yangilaydi (race condition yo‘q!); `Q()` esa `OR` (`|`) va `NOT` (`~`) shartlarni tuzadi.',
      architectureRole:
        'Django dasturi va PostgreSQL o‘rtasidagi asosiy tezlik darvozasi — sekinlikning katta qismi noto‘g‘ri ORM so‘rovlaridan kelib chiqadi.',
      pros: [
        'Parametrlangan SQL — SQL injection’dan himoyalangan',
        'select_related / prefetch_related bilan ortiqcha so‘rovlarni kamaytirish',
      ],
      cons: [
        'Tashqi ko‘rinishda oddiy `book.author.name` yashirin SQL urishini boshlovchi dasturchi sezmay qolishi mumkin',
      ],
      limitations: [
        '`select_related` ManyToMany maydonida ishlamaydi (buning uchun `prefetch_related` shart).',
      ],
      whenToUse:
        '`ForeignKey` va `OneToOne` uchun `select_related`; `ManyToMany` va reverse `ForeignKey` uchun `prefetch_related`.',
      whenNotToUse:
        'Faqat 1 ta ustun kerak bo‘lganda butun Model obyektini yuklamang — `.only()` yoki `.values()` ishlating; sanashda `len(qs)` emas `.count()` ishlating.',
    },
    visualizationHint:
      'Django ORM Visual Lab’da REAL SQLite dvigatelida N+1 (13 ta so‘rov) va select_related (1 ta JOIN so‘rov) ni jonli taqqoslang!',
    codeExamples: [
      {
        level: 'Basic',
        title: 'Lazy Evaluation — qachon SQL ketadi?',
        code: `qs = Kitob.objects.filter(narx__gt=50000)   # SQL KETMADI!
qs = qs.exclude(nashr_yili__lt=2020)        # Hali ham SQL KETMADI!
kitoblar = list(qs[:10])                    # ENDI 1 ta SQL ketdi!`,
        lineNotes: [
          {line: 1, note: 'Faqat QuerySet zanjiri shakllanadi.'},
          {line: 3, note: 'list() ma’lumotni o‘qigani uchun bitta birlashtirilgan SQL yuboriladi.'},
        ],
      },
      {
        level: 'Intermediate',
        title: 'select_related vs prefetch_related',
        code: `# ForeignKey (1-ga-1 yoki Ko'p-ga-1): bitta SQL JOIN
kitoblar = Kitob.objects.select_related("muallif", "kategoriya")

# ManyToMany yoki reverse FK: 2 ta alohida SQL (IN bilan)
mualliflar = Muallif.objects.prefetch_related("kitoblar")`,
        lineNotes: [
          {line: 2, note: 'Muallif va kategoriya bitta JOIN bilan olinadi.'},
          {line: 5, note: 'Har bir muallif uchun alohida SELECT emas, bitta IN (...) bilan olinadi.'},
        ],
      },
      {
        level: 'Advanced',
        title: 'F() Expression — Race Condition’siz atomar yangilash',
        code: `from django.db.models import F

# ❌ XATO: 2 ta user bir paytda sotib olsa ombor soni noto'g'ri chiqadi!
# mahsulot.qoldiq -= 1; mahsulot.save()

# ✅ TO'G'RI: SQL darajasida atomar UPDATE mahsulot SET qoldiq = qoldiq - 1
Mahsulot.objects.filter(id=42, qoldiq__gte=1).update(qoldiq=F("qoldiq") - 1)`,
        lineNotes: [
          {line: 7, note: 'Bazaning o‘zida hisoblanadi — parallel so‘rovlarda ham yo‘qotish bo‘lmaydi.'},
        ],
      },
      {
        level: 'Professional',
        title: 'annotate(), aggregate() va Q() bilan tahlil',
        code: `from django.db.models import Count, Q, Sum

stat = Muallif.objects.annotate(
    faol_kitoblar=Count("kitoblar", filter=Q(kitoblar__chop_etilgan=True))
).filter(Q(faol_kitoblar__gte=3) | Q(reyting__gte=4.8))`,
        lineNotes: [
          {line: 4, note: 'Django DB ichida GROUP BY + FILTER bajaradi.'},
        ],
      },
      {
        level: 'Real Project',
        title: 'DRF ViewSet’da N+1 ni butunlay yopish',
        code: `class BuyurtmaViewSet(ReadOnlyModelViewSet):
    serializer_class = BuyurtmaSerializer

    def get_queryset(self):
        return (
            Buyurtma.objects
            .filter(mijoz=self.request.user)
            .select_related("mijoz", "manzil")
            .prefetch_related("qatorlar__mahsulot")
        )`,
        lineNotes: [
          {line: 8, note: 'Mijoz va manzil JOIN bilan, buyurtma qatorlari esa prefetch bilan olinadi.'},
        ],
      },
    ],
    experiment: {
      prompt: 'Haqiqiy SQLite xotira bazasida N+1 va JOIN farqini Python sandbox orqali o‘lchang (`SELECT` sonini ko‘ring).',
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE muallif (id INT PRIMARY KEY, ism TEXT)")
conn.execute("CREATE TABLE kitob (id INT PRIMARY KEY, nom TEXT, muallif_id INT)")
for i in range(1, 4):
    conn.execute("INSERT INTO muallif VALUES (?, ?)", (i, f"Muallif_{i}"))
for k in range(1, 7):
    conn.execute("INSERT INTO kitob VALUES (?, ?, ?)", (k, f"Kitob_{k}", (k % 3) + 1))

# 1) N+1 usuli:
so_rovlar = 0
kitoblar = conn.execute("SELECT id, nom, muallif_id FROM kitob").fetchall()
so_rovlar += 1
for _, nom, m_id in kitoblar:
    m = conn.execute("SELECT ism FROM muallif WHERE id = ?", (m_id,)).fetchone()
    so_rovlar += 1
print("N+1 jami SQL soni:", so_rovlar)

# 2) select_related (JOIN) usuli:
joined = conn.execute(
    "SELECT k.nom, m.ism FROM kitob k JOIN muallif m ON k.muallif_id = m.id"
).fetchall()
print("JOIN jami SQL soni: 1 ->", joined[:2])`,
      note: 'Python sandbox + SQLite3 da bajariladi.',
    },
    commonMistakes: [
      {
        mistake: 'len(Model.objects.all()) bilan sanash',
        whyWrong: 'Barcha million qatorni RAMga yuklab keyin sanaydi.',
        fix: 'Model.objects.count() ishlating (SQL: SELECT COUNT(*)).',
      },
      {
        mistake: 'if Model.objects.filter(...): ishlatish',
        whyWrong: 'Barcha mos qatorlarni yuklaydi; mavjudlikni bilish uchun 1 ta ham yetarli.',
        fix: 'if Model.objects.filter(...).exists(): ishlating.',
      },
    ],
    practicalTasks: [
      'Order va OrderItem modellari uchun N+1 chiqarmaydigan `get_queryset()` yozing.',
    ],
    realProjectIntegration: {
      project: 'E-Commerce Order List API',
      explanation: 'Paimon E-Commerce’da `select_related("mijoz")` + `Prefetch("items")` siz 50 ta buyurtma 251 ta SQL chiqarardi; tuzatilgandan keyin atigi 2 ta SQL ga tushdi.',
      snippet: `Buyurtma.objects.select_related("mijoz").prefetch_related("items__product")`,
    },
    knowledgeCheck: {
      question: 'ManyToMany maydoni (masalan Post.tags) ni N+1 siz yuklash uchun qaysi metod ishlatiladi?',
      options: ['prefetch_related("tags")', 'select_related("tags")', 'annotate("tags")'],
      correctIndex: 0,
      explanation: 'select_related faqat bitta qiymatli (FK/OneToOne) bog‘lanishlarda SQL JOIN qiladi; ko‘p qiymatli ManyToMany uchun prefetch_related ishlatiladi.',
    },
    summary: [
      'QuerySet dangasa (lazy): faqat ma’lumot o‘qilganda SQL ketadi.',
      'ForeignKey → `select_related`, ManyToMany → `prefetch_related`.',
      'Sanash uchun `.count()`, tekshirish uchun `.exists()`, atomar yangilash uchun `F()`.',
    ],
    nextStep: {
      nextTopicTitle: 'DRF Serializer Pipeline, JWT & IDOR Security',
      preparationTip: 'Endi optimallashgan QuerySet’larni qanday qilib xavfsiz JSON API’ga chiqarishni o‘rganamiz.',
    },
  },
  {
    id: 'api-drf-security',
    domain: 'api',
    difficulty: 'Upper Intermediate',
    title: 'DRF Serializer Validatsiya, JWT Lifecycle, IDOR va Idempotency',
    subtitle:
      'API yozishda ma’lumotni himoyalash, xavfsiz avtorizatsiya va Mass Assignment’dan qochish',
    visualLabId: 'api-visual',
    sourceReference: 'DRF 3.15 Docs & OWASP API Security Top 10 (2023)',
    intro: {
      whatIsIt:
        'Django REST Framework (DRF) — ma’lumotlarni Python/ORM va JSON o‘rtasida tekshiruvchi Serializer, ruxsat tizimi (Authentication/Permissions), Pagination va Rate Limiting arxitekturasi.',
      whyExists:
        'Foydalanuvchi yuborgan JSON hech qachon ishonchli emas: uni validatsiya qilish, tokenini tekshirish va birovning ma’lumotini o‘g‘irlashdan (IDOR) himoyalash zarur.',
      problemSolved:
        'Broken Object Level Authorization (OWASP API1), Mass Assignment (API3) va qayta to‘lov yechilib ketish (Idempotency) muammolari.',
      whereUsed:
        'Mobil ilovalar, SPA frontendlar va tashqi hamkorlar bilan ishlaydigan barcha REST API’larda.',
      prerequisites: ['HTTP status kodlar (401/403)', 'Django Models & QuerySet'],
    },
    analogy: {
      title: 'Bank kassasi: Pasport, Chek va Ikki marta yechilmaslik muhrlari',
      story:
        '1) Pasport (JWT Access Token) tekshiriladi — bo‘lmasa 401. 2) Bu sizning hisobingizmi (IDOR/Permission)? Birovniki bo‘lsa 403/404. 3) Internet uzilib "To‘lash" tugmasini 2 marta bossangiz ham Idempotency-Key tufayli pul faqat 1 marta yechiladi!',
    },
    deepExplanation: {
      internalMechanism:
        'DRF `serializer.is_valid()` 3 bosqichda ishlaydi: (1) Field type & validator tekshiruvi (`to_internal_value`), (2) Har bir maydon uchun `validate_<field>(self, value)`, (3) Obyekt darajasida `validate(self, attrs)`. Faqat shundan so‘ng `validated_data` ga ruxsat beriladi.',
      workingPrinciple:
        'JWT stateless token: Header.Payload.Signature (HMAC-SHA256 / EdDSA). Payload base64’da shifrlanmagan — shuning uchun unga parol yozmang! Access token qisqa (15 daqiqa), Refresh token esa uzoq (7 kun) va blacklist qilinishi mumkin.',
      architectureRole:
        'Tashqi dunyo va ichki biznes/DB qatlami o‘rtasidagi qat’iy kontrakt va OWASP himoya devori.',
      pros: [
        'Deklarativ va qayta ishlatiladigan validatsiya',
        'OpenAPI/Swagger (drf-spectacular) avtomatik generatsiya',
      ],
      cons: [
        '`fields = "__all__"` yozilsa, tajovuzkor `is_staff=True` yoki `balance=999999` yuborib Mass Assignment hujumi qilishi mumkin!',
      ],
      limitations: [
        'Oddiy JWT muddati tugaguncha bekor qilinmaydi — majburiy chiqarish (logout) uchun Redis blacklist yoki token rotation kerak.',
      ],
      whenToUse:
        'Har doim `fields = [...]` ro‘yxatini ochiq yozing va `user`, `is_staff`, `status` maydonlarini `read_only_fields` ga qo‘ying.',
      whenNotToUse:
        'Hech qachon `request.data` ni to‘g‘ridan-to‘g‘ri `Model.objects.create(**request.data)` ga bermang!',
    },
    visualizationHint:
      'API Architecture Lab’da JSON so‘rovning Auth → Permission → Throttle → Serializer → View bosqichlaridan o‘tishini bosib ko‘ring.',
    codeExamples: [
      {
        level: 'Basic',
        title: 'Xavfsiz ModelSerializer (Mass Assignment yo‘q)',
        code: `from rest_framework import serializers

class BuyurtmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyurtma
        fields = ["id", "mahsulot", "soni", "umumiy_summa", "holat"]
        read_only_fields = ["id", "umumiy_summa", "holat"]`,
        lineNotes: [
          {line: 7, note: 'Foydalanuvchi narx yoki holatni JSON orqali o‘zgartira olmaydi!'},
        ],
      },
      {
        level: 'Intermediate',
        title: '3-bosqichli validatsiya (validate_<field> va validate)',
        code: `class TolovSerializer(serializers.Serializer):
    summa = serializers.DecimalField(max_digits=12, decimal_places=2)
    boshlanish = serializers.DateField()
    tugash = serializers.DateField()

    def validate_summa(self, value):
        if value <= 0:
            raise serializers.ValidationError("Summa 0 dan katta bo‘lishi shart.")
        return value

    def validate(self, attrs):
        if attrs["tugash"] < attrs["boshlanish"]:
            raise serializers.ValidationError("Tugash sanasi oldin bo‘la olmaydi.")
        return attrs`,
        lineNotes: [
          {line: 6, note: '2-bosqich: bitta maydon tekshiruvi.'},
          {line: 11, note: '3-bosqich: ikki maydonni o‘zaro solishtirish.'},
        ],
      },
      {
        level: 'Advanced',
        title: 'IDOR himoyasi: get_queryset + Custom Permission',
        code: `class FaqatEgasi(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.egasi_id == request.user.id

class MeningBuyurtmalarimViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, FaqatEgasi]

    def get_queryset(self):
        # Har bir foydalanuvchi faqat o'zinikini ko'radi!
        return Buyurtma.objects.filter(egasi=self.request.user)`,
        lineNotes: [
          {line: 10, note: 'URL /orders/99/ yuborilsa ham birovning buyurtmasi 404 beradi.'},
        ],
      },
      {
        level: 'Professional',
        title: 'Idempotency-Key bilan ikki marta yechilishdan himoya',
        code: `def create(self, request, *args, **kwargs):
    idem_key = request.headers.get("Idempotency-Key")
    if not idem_key:
        return Response({"xato": "Idempotency-Key majburiy"}, status=400)
    cached = cache.get(f"idem:{request.user.id}:{idem_key}")
    if cached:
        return Response(cached, status=200)  # Xuddi o'sha javob qaytadi!`,
        lineNotes: [
          {line: 6, note: 'Tarmoq qayta urinsa ham to‘lov ikki marta o‘tmaydi.'},
        ],
      },
      {
        level: 'Real Project',
        title: 'CursorPagination & ScopedRateThrottle',
        code: `class IzohPagination(CursorPagination):
    page_size = 20
    ordering = "-yaratildi"  # OFFSET siz O(1) tezlik!

class LoginAPIView(APIView):
    throttle_scope = "auth_bruteforce"  # Daqiqada 5 urinish`,
        lineNotes: [
          {line: 3, note: 'Million qatorli jadvalda 10,000-sahifa ham 1-sahifadek tez ochiladi.'},
        ],
      },
    ],
    experiment: {
      prompt: 'Python’da Serializer validatsiya va Mass Assignment himoyasi qanday ishlashini amalda sinang (`is_staff` urinishini bloklang).',
      starterCode: `RUXSAT_MAYDONLAR = {"ism", "kurs"}

def xavfsiz_saqla(payload: dict) -> dict:
    # Tajovuzkor yuborgan ortiqcha maydonlarni filtrlaymiz:
    toza = {k: v for k, v in payload.items() if k in RUXSAT_MAYDONLAR}
    if not toza.get("ism"):
        raise ValueError("ism bo'sh bo'lmasligi kerak")
    return {"saqlandi": toza, "bloklandi": set(payload) - RUXSAT_MAYDONLAR}

kelgan_json = {"ism": "Dilshod", "kurs": "Django", "is_staff": True, "balans": 999999}
print(xavfsiz_saqla(kelgan_json))`,
      note: 'Python sandboxda bajariladi.',
    },
    commonMistakes: [
      {
        mistake: 'fields = "__all__"',
        whyWrong: 'Modeldagi maxfiy yoki hisoblangan maydonlar (is_superuser, balance) foydalanuvchi tomonidan o‘zgartirilishi mumkin.',
        fix: 'Maydonlarni ro‘yxatda aniq sanab, tizim maydonlarini `read_only_fields` qiling.',
      },
      {
        mistake: 'Katta jadvallarda PageNumberPagination (?page=50000) ishlatish',
        whyWrong: 'SQL OFFSET 1,000,000 qatorni sanab tashlashga majbur bo‘ladi va baza sekinlashadi.',
        fix: 'CursorPagination ishlating.',
      },
    ],
    practicalTasks: [
      'Parol va parolni tasdiqlash (`password` != `password_confirm`) mos kelishini `validate()` da tekshiruvchi Serializer yozing.',
    ],
    realProjectIntegration: {
      project: 'Paimon Blog & E-Commerce REST API',
      explanation: 'Barcha POST to‘lov endpointlari `Idempotency-Key` + `IsAuthenticated` + `ScopedRateThrottle` bilan himoyalangan.',
      snippet: `permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]`,
    },
    knowledgeCheck: {
      question: 'JWT Access Token payload qismidagi ma’lumot shifrlanganmi?',
      options: [
        'Yo‘q, Base64 kodlangan xolos — hamma o‘qiy oladi, shuning uchun maxfiy parol yozmang',
        'Ha, AES-256 bilan shifrlangan',
        'Faqat HTTPS da shifrlanadi, lekin server ham o‘qiy olmaydi',
      ],
      correctIndex: 0,
      explanation: 'Standart JWT imzolanadi (o‘zgartirib bo‘lmaydi), lekin Base64URL ochiq matn! Maxfiy ma’lumotlarni payloadga yozmang.',
    },
    summary: [
      'Validatsiya: Field Type → `validate_<field>` → `validate`.',
      'Hech qachon `fields = "__all__"` ishlatmang.',
      'IDOR ni `get_queryset()` + `has_object_permission` bilan yoping.',
    ],
    nextStep: {
      nextTopicTitle: 'PostgreSQL Internals: B-tree/GIN Indexes, JOIN & MVCC',
      preparationTip: 'API ning ortidagi ma’lumotlar bazasi qanday qidirishi va qulflashini o‘rganamiz.',
    },
  },
  {
    id: 'pg-indexes-mvcc',
    domain: 'postgres',
    difficulty: 'Advanced',
    title: 'PostgreSQL: B-tree/GIN Indekslar, JOIN, ACID, MVCC va EXPLAIN',
    subtitle:
      'Bazaning ichki qidiruv mexanizmi: Seq Scan vs Index Scan va nega hamma ustunga indeks qo‘yilmaydi',
    visualLabId: 'postgres-visual',
    sourceReference: 'PostgreSQL 16 Official Docs — Indexes, MVCC & EXPLAIN',
    intro: {
      whatIsIt:
        'PostgreSQL — ACID kafolatli obyekt-relyatsion ma’lumotlar bazasi. Indekslar (B-tree, GIN, BRIN) qidiruvni tezlashtiradi, MVCC esa o‘qish va yozish bir-birini to‘sib qo‘ymasligini ta’minlaydi.',
      whyExists:
        'Katta jadvalda bitta mijozni topish uchun butun jadvalni o‘qib chiqish (Seq Scan) sekin; B-tree indeks esa qidiruvni O(log N) gacha tezlashtiradi.',
      problemSolved:
        'Sekin SQL so‘rovlari, deadlocklar, noto‘g‘ri JOIN natijalari va ko‘p foydalanuvchili yuklamada jadval qotishi.',
      whereUsed:
        'Barcha production Django backendlar, moliya tizimlari, analitika va qidiruv modullarida.',
      prerequisites: ['SQL SELECT, WHERE, PRIMARY KEY, FOREIGN KEY'],
    },
    analogy: {
      title: '1000 betlik ensiklopediya mundarijasi',
      story:
        'Mundarija (Index) bo‘lmasa, bitta atamani topish uchun 1-betdan 1000-betgacha varaqlash kerak (Sequential Scan). Mundarija bo‘lsa darhol 412-betni ochasiz (Index Scan). Lekin har bir so‘zga mundarija tuzsangiz, kitobning o‘zidan qalin bo‘lib, yangi sahifa qo‘shish (INSERT/UPDATE) sekinlashadi!',
    },
    deepExplanation: {
      internalMechanism:
        'B-tree muvozanatli daraxt bo‘lib O(log N) tezlikda ishlaydi. Query Planner (`EXPLAIN ANALYZE`) jadval statistikasiga (`ANALYZE`) qarab Index Scan, Bitmap Index Scan yoki kichik jadvallarda ataylab Seq Scan tanlaydi (chunki kichik jadvalda bitta sahifani o‘qish arzonroq!).',
      workingPrinciple:
        'MVCC (Multi-Version Concurrency Control): UPDATE paytida PostgreSQL eski qatorni o‘chirmaydi (`xmax` qo‘yadi), yangi versiyani yozadi (`xmin`). Shuning uchun `SELECT` hech qachon `UPDATE` ni kutmaydi. O‘lik qatorlarni esa `AUTOVACUUM` tozalaydi.',
      architectureRole:
        'Ilovaning ma’lumotlar yaxlitligi (ACID) va eng quyi saqlash qatlami.',
      pros: [
        'O‘quvchilar yozuvchilarni, yozuvchilar o‘quvchilarni bloklamaydi (MVCC)',
        'GIN bilan JSONB va matn qidiruvi juda tez',
        'CREATE INDEX CONCURRENTLY ishlab turgan bazani qulflamaydi',
      ],
      cons: [
        'Har bir ortiqcha indeks INSERT, UPDATE va DELETE tezligini pasaytiradi hamda disk joyini yeydi',
      ],
      limitations: [
        'Oddiy B-tree indeks `LIKE "%so‘z%"` (boshida % bo‘lsa) va funksiya ichidagi `WHERE LOWER(email) = ...` da (expression index bo‘lmasa) ISHLAMAYDI!',
      ],
      whenToUse:
        'Tez-tez `WHERE`, `JOIN` (ForeignKey), `ORDER BY` da ishlatiladigan yuqori selektiv ustunlarga indeks qo‘ying.',
      whenNotToUse:
        'Kam qatorli kichik jadvallarga yoki `boolean` kabi atigi 2 xil qiymatli ustunlarga oddiy B-tree qo‘ymang (Seq Scan baribir tezroq bo‘ladi).',
    },
    visualizationHint:
      'PostgreSQL Visual Lab’da INNER / LEFT / RIGHT / FULL JOIN qator bog‘lanishlarini va Index Scan vs Seq Scan yo‘lini jonli ko‘ring.',
    codeExamples: [
      {
        level: 'Basic',
        title: 'INNER JOIN vs LEFT JOIN',
        code: `-- Faqat buyurtmasi bor mijozlar:
SELECT m.ism, b.summa
FROM mijozlar m INNER JOIN buyurtmalar b ON b.mijoz_id = m.id;

-- Buyurtmasi yo'q mijozlar ham (summa = NULL bo'lib) chiqadi:
SELECT m.ism, b.summa
FROM mijozlar m LEFT JOIN buyurtmalar b ON b.mijoz_id = m.id;`,
        lineNotes: [
          {line: 6, note: 'Chap jadval (mijozlar) to‘liq saqlanadi.'},
        ],
      },
      {
        level: 'Intermediate',
        title: 'Composite Index tartibi (Leftmost Prefix Rule)',
        code: `-- (user_id, created_at) indeksi:
CREATE INDEX idx_orders_user_date ON orders (user_id, created_at DESC);

-- ✅ Indeks ishlaydi: WHERE user_id = 5 AND created_at > '2026-01-01'
-- ✅ Indeks ishlaydi: WHERE user_id = 5
-- ❌ Ishlamaydi:     WHERE created_at > '2026-01-01' (chap ustun yo'q!)`,
        lineNotes: [
          {line: 2, note: 'Kompozit indeksda ustunlar tartibi hal qiluvchi ahamiyatga ega.'},
        ],
      },
      {
        level: 'Advanced',
        title: 'Partial Index va CONCURRENTLY (Zero-downtime)',
        code: `-- Faqat to'lanmagan buyurtmalarni indekslash (kichikroq indeks):
CREATE INDEX CONCURRENTLY idx_unpaid_orders
ON orders (created_at)
WHERE status = 'pending';`,
        lineNotes: [
          {line: 2, note: 'CONCURRENTLY jadvalga yozishni bloklamaydi.'},
          {line: 4, note: 'Productionda allaqachon yakunlangan millionlab buyurtma indeksga kirmaydi.'},
        ],
      },
      {
        level: 'Professional',
        title: 'SELECT FOR UPDATE (Deadlock oldini olish)',
        code: `BEGIN;
-- Balansni o'zgartirishdan oldin qatorni qulflaymiz (har doim ID o'sish tartibida!):
SELECT id, balans FROM hisoblar
WHERE id IN (10, 25)
ORDER BY id ASC
FOR UPDATE;
COMMIT;`,
        lineNotes: [
          {line: 5, note: 'Qulflarni bir xil tartibda olish Deadlock ehtimolini yo‘q qiladi.'},
        ],
      },
      {
        level: 'Real Project',
        title: 'Django Migration’da xavfsiz indeks qo‘shish',
        code: `from django.contrib.postgres.operations import AddIndexConcurrently
from django.db import migrations, models

class Migration(migrations.Migration):
    atomic = False  # CONCURRENTLY uchun majburiy!
    operations = [
        AddIndexConcurrently(
            model_name="buyurtma",
            index=models.Index(fields=["mijoz", "-yaratildi"], name="idx_ord_mijoz_dt"),
        ),
    ]`,
        lineNotes: [
          {line: 5, note: 'atomic = False bo‘lmasa PostgreSQL xato qaytaradi!'},
        ],
      },
    ],
    experiment: {
      prompt: 'Haqiqiy SQLite dvigatelida EXPLAIN QUERY PLAN orqali indeks bo‘lganda SEARCH, bo‘lmaganda SCAN chiqishini tekshiring.',
      starterCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (id INT PRIMARY KEY, email TEXT, role TEXT)")
for i in range(500):
    conn.execute("INSERT INTO users VALUES (?, ?, ?)", (i, f"user{i}@paimon.uz", "student"))

plan_without = conn.execute("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user420@paimon.uz'").fetchall()
print("Indekssiz:", plan_without)

conn.execute("CREATE INDEX idx_users_email ON users(email)")
plan_with = conn.execute("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user420@paimon.uz'").fetchall()
print("Indeks bilan:", plan_with)`,
      note: 'Real SQLite EXPLAIN QUERY PLAN bajariladi.',
    },
    commonMistakes: [
      {
        mistake: 'Hamma ustunga B-tree indeks qo‘yib chiqish',
        whyWrong: 'Har bir yozish (INSERT/UPDATE) barcha indekslarni ham yangilaydi va WAL/I/O yukini oshiradi.',
        fix: 'Faqat EXPLAIN ANALYZE da kerak bo‘lgan so‘rovlarga selektiv indeks qo‘ying.',
      },
      {
        mistake: 'Production katta jadvalda oddiy CREATE INDEX ishlatish',
        whyWrong: 'Jadvalni yozishdan bloklab saytni to‘xtatib qo‘yadi.',
        fix: 'CONCURRENTLY (`atomic = False`) ishlating.',
      },
    ],
    practicalTasks: [
      'Order jadvali uchun `status = "active"` qatorlariga Partial Index yozing.',
    ],
    realProjectIntegration: {
      project: 'Paimon Telemetry & Audit Logs',
      explanation: 'Audit loglar jadvali vaqt bo‘yicha o‘sadigan milliard qatorli jadval bo‘lgani uchun B-tree o‘rniga `BRIN` indeksi ishlatiladi.',
      snippet: `BrinIndex(fields=["created_at"], pages_per_range=64)`,
    },
    knowledgeCheck: {
      question: 'Nega kichik (masalan 50 qatorli) jadvalda indeks bo‘lsa ham PostgreSQL ba’zan Seq Scan tanlaydi?',
      options: [
        'Butun jadval 1 ta 8KB disk sahifasiga sig‘adi — indeks daraxti + jadvalga 2 marta sakrash sekinroq',
        'PostgreSQL 1000 qatordan kichik jadvallarda indeksni o‘chirib qo‘yadi',
        'Indeks faqat JOIN da ishlaydi',
      ],
      correctIndex: 0,
      explanation: 'Query Planner xarajat (cost) hisoblaydi: bitta sahifani to‘g‘ridan-to‘g‘ri o‘qish B-tree ildizidan tushishdan arzonroq!',
    },
    summary: [
      'Indeks o‘qishni tezlashtiradi, lekin yozishni sekinlashtiradi — muvozanat zarur.',
      'MVCC tufayli SELECT UPDATE ni bloklamaydi.',
      'Katta jadvallarda doim `CREATE INDEX CONCURRENTLY` ishlating.',
    ],
    nextStep: {
      nextTopicTitle: 'Guided Coding Workspace & Real Projects Studio',
      preparationTip: 'Endi o‘rgangan bilimlaringizni real Python sandbox muhitida kod yozib va loyiha qurib mustahkamlang!',
    },
  },
];
