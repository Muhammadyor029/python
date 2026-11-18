export interface WorkspaceExercise {
  id: string;
  title: string;
  track: 'Python Core' | 'Algoritm & Xotira' | 'Django / API Mantiq' | 'SQL (SQLite Real)';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  executionMode: 'real-python' | 'real-sqlite-engine';
  description: string;
  requirements: string[];
  hints: string[];
  expectedBehavior: string;
  starterCode: string;
  solutionCode: string;
  testCode: string;
  explanation: string;
}

export const WORKSPACE_EXERCISES: WorkspaceExercise[] = [
  {
    id: 'ws-decimal-cart',
    title: '01. E-Commerce Savat Hisoblagich (Decimal Aniqligi)',
    track: 'Python Core',
    difficulty: 'Beginner',
    executionMode: 'real-python',
    description:
      'Float o‘rniga `Decimal` ishlatib, mahsulotlar ro‘yxatidan chegirmali umumiy summani tiyinigacha aniq hisoblaydigan `savat_hisobla(items, chegirma_foiz)` funksiyasini yozing.',
    requirements: [
      'Har bir element `{"narx": "19.99", "soni": 2}` ko‘rinishidagi dict bo‘ladi.',
      'Hisob-kitobda float emas, `decimal.Decimal` ishlating.',
      'Chegirma foizini ayirib, natijani `Decimal` sifatida 2 xonali aniqlikda (`quantize(Decimal("0.01"))`) qaytaring.',
    ],
    hints: [
      '1-maslahat: `from decimal import Decimal` import qiling va satrni `Decimal(item["narx"])` ga o‘tkazing.',
      '2-maslahat: Chegirma koeffitsiyenti: `Decimal("1") - (Decimal(str(chegirma_foiz)) / Decimal("100"))`.',
    ],
    expectedBehavior:
      'savat_hisobla([{"narx": "0.10", "soni": 1}, {"narx": "0.20", "soni": 1}], 0) -> Decimal("0.30") qaytarmog‘i kerak.',
    starterCode: `from decimal import Decimal

def savat_hisobla(items: list[dict], chegirma_foiz: int = 0) -> Decimal:
    # Shu yerda Decimal bilan aniq hisoblang:
    jami = Decimal("0.00")
    for item in items:
        pass  # TODO: narx * soni qo'shing
    return jami.quantize(Decimal("0.01"))

print(savat_hisobla([{"narx": "0.10", "soni": 1}, {"narx": "0.20", "soni": 1}], 0))`,
    solutionCode: `from decimal import Decimal

def savat_hisobla(items: list[dict], chegirma_foiz: int = 0) -> Decimal:
    jami = Decimal("0.00")
    for item in items:
        jami += Decimal(str(item["narx"])) * Decimal(str(item["soni"]))
    koeff = Decimal("1") - (Decimal(str(chegirma_foiz)) / Decimal("100"))
    return (jami * koeff).quantize(Decimal("0.01"))

print(savat_hisobla([{"narx": "0.10", "soni": 1}, {"narx": "0.20", "soni": 1}], 10))`,
    testCode: `from decimal import Decimal
assert savat_hisobla([{"narx": "0.10", "soni": 1}, {"narx": "0.20", "soni": 1}], 0) == Decimal("0.30"), "0.10 + 0.20 aynan Decimal('0.30') bo'lishi shart!"
assert savat_hisobla([{"narx": "100.00", "soni": 2}], 10) == Decimal("180.00"), "10% chegirma bilan 180.00 chiqishi kerak"`,
    explanation:
      'Pul hisob-kitoblarida float ikkilik tizimda `0.30000000000000004` xato beradi; Django `DecimalField` va Python `Decimal` buni 100% oldini oladi.',
  },
  {
    id: 'ws-safe-mutable-cache',
    title: '02. Yashirin Mutatsiya Bugini Tuzatish (Mutable Default + Deepcopy)',
    track: 'Algoritm & Xotira',
    difficulty: 'Intermediate',
    executionMode: 'real-python',
    description:
      'Foydalanuvchi rollarini qo‘shadigan `rol_qosh(ism, rollar=...)` va sozlamani buzmasdan klonlaydigan `sozlama_klonla(base, yangi_limit)` funksiyalarini yozing.',
    requirements: [
      'Birinchi talaba `rol_qosh("Ali")` chaqirilganda faqat `["student"]` bo‘lsin.',
      'Ikkinchi talaba `rol_qosh("Vali")` chaqirilganda Alining roli unga o‘tib qolmasin!',
      '`sozlama_klonla` asl `base["limits"]` lug‘atini o‘zgartirmasin.',
    ],
    hints: [
      '1-maslahat: `rollar: list[str] | None = None` qiling va funksiya ichida `rollar = []` yarating.',
      '2-maslahat: `import copy` dan `copy.deepcopy(base)` ishlating.',
    ],
    expectedBehavior:
      'Har bir foydalanuvchi mustaqil ro‘yxatga ega bo‘ladi va base konfiguratsiya himoyalanadi.',
    starterCode: `import copy

def rol_qosh(ism: str, rollar=[]):  # XATO SHU YERDA!
    rollar.append("student")
    return {"ism": ism, "rollar": rollar}

def sozlama_klonla(base: dict, yangi_limit: int) -> dict:
    klon = copy.copy(base)  # SAYOZ NUSXA XATOSI!
    klon["limits"]["rpm"] = yangi_limit
    return klon

print(rol_qosh("Ali"))
print(rol_qosh("Vali"))`,
    solutionCode: `import copy

def rol_qosh(ism: str, rollar: list[str] | None = None) -> dict:
    if rollar is None:
        rollar = []
    else:
        rollar = list(rollar)
    rollar.append("student")
    return {"ism": ism, "rollar": rollar}

def sozlama_klonla(base: dict, yangi_limit: int) -> dict:
    klon = copy.deepcopy(base)
    klon["limits"]["rpm"] = yangi_limit
    return klon

print(rol_qosh("Ali"))
print(rol_qosh("Vali"))`,
    testCode: `u1 = rol_qosh("Ali")
u2 = rol_qosh("Vali")
assert u1["rollar"] == ["student"] and u2["rollar"] == ["student"], "Mutable default bugi hal qilinmagan!"
base = {"limits": {"rpm": 60}}
vip = sozlama_klonla(base, 500)
assert base["limits"]["rpm"] == 60 and vip["limits"]["rpm"] == 500, "Deepcopy ishlatilmagani uchun base o'zgarib ketdi!"`,
    explanation:
      'Mutable default argumentlar funksiya e’lon qilinganda bitta obyekt bo‘lib qoladi. `None` + `deepcopy()` ikkala tuzoqni ham yopadi.',
  },
  {
    id: 'ws-drf-serializer-clean',
    title: '03. API Mass Assignment Himoyachisi & Validatsiya',
    track: 'Django / API Mantiq',
    difficulty: 'Intermediate',
    executionMode: 'real-python',
    description:
      'Kelgan JSON ichidan faqat ruxsat etilgan maydonlarni (`title`, `price`) o‘tkazib, `is_admin`, `balance` kabi xavfli maydonlarni olib tashlaydigan hamda `price > 0` ni tekshiradigan `validate_product_payload(data)` funksiyasini yozing.',
    requirements: [
      '`title` bo‘sh bo‘lmasligi va kamida 3 ta belgidan iborat bo‘lishi kerak (aks holda `ValueError`).',
      '`price` musbat son (> 0) bo‘lishi shart (aks holda `ValueError`).',
      'Qaytgan dictda faqat `title` va `price` bo‘lsin (`is_admin` tushib qolsin!).',
    ],
    hints: [
      '1-maslahat: `title = str(data.get("title", "")).strip()` qilib uzunligini tekshiring.',
      '2-maslahat: Faqat `{"title": title, "price": price}` qaytaring.',
    ],
    expectedBehavior:
      'Yaroqsiz ma’lumotda `ValueError`, xavfli maydonlar kelsa ularni tashlab yuborgan toza dict qaytaradi.',
    starterCode: `def validate_product_payload(data: dict) -> dict:
    # TODO: title (len >= 3) va price (> 0) ni tekshiring
    # TODO: Mass Assignment ga yo'l qo'ymang (faqat title va price qaytaring)
    return data

print(validate_product_payload({"title": "Python Kurs", "price": 120, "is_admin": True}))`,
    solutionCode: `def validate_product_payload(data: dict) -> dict:
    title = str(data.get("title", "")).strip()
    if len(title) < 3:
        raise ValueError("Mahsulot nomi kamida 3 ta belgi bo'lishi shart.")
    price = data.get("price", 0)
    if not isinstance(price, (int, float)) or price <= 0:
        raise ValueError("Narx 0 dan katta son bo'lishi shart.")
    return {"title": title, "price": price}

print(validate_product_payload({"title": "Python Kurs", "price": 120, "is_admin": True}))`,
    testCode: `res = validate_product_payload({"title": "Django Pro", "price": 250, "is_admin": True, "balance": 9999})
assert res == {"title": "Django Pro", "price": 250}, "Xavfli maydonlar filtrlanmadi!"
try:
    validate_product_payload({"title": "A", "price": 10})
    assert False, "Qisqa title uchun ValueError chiqishi kerak edi"
except ValueError:
    pass
try:
    validate_product_payload({"title": "Kurs", "price": -5})
    assert False, "Manfiy narx uchun ValueError chiqishi kerak edi"
except ValueError:
    pass`,
    explanation:
      'OWASP API3 (Excessive Data Exposure / Mass Assignment) ga ko‘ra, hech qachon kelgan JSON lug‘atini to‘liq bazaga saqlamaslik, balki whitelist maydonlarni ajratish shart.',
  },
  {
    id: 'ws-sql-join-query',
    title: '04. Real SQLite Bazada JOIN va Indeksli Qidiruv',
    track: 'SQL (SQLite Real)',
    difficulty: 'Advanced',
    executionMode: 'real-sqlite-engine',
    description:
      'Xotiradagi SQLite bazasida `departments` va `employees` jadvallarini bog‘lab, har bir bo‘lim nomi va xodimlar sonini qaytaradigan `get_department_counts(conn)` funksiyasini bitta SQL JOIN + GROUP BY so‘rovi bilan yozing.',
    requirements: [
      'Xodimi 0 ta bo‘lgan bo‘lim ham natijada `0` bilan chiqishi kerak (`LEFT JOIN`!).',
      'Natija `[("Backend", 2), ("DevOps", 1), ("Design", 0)]` kabi bo‘lim nomi alifbo tartibida (`ORDER BY`) bo‘lsin.',
    ],
    hints: [
      '1-maslahat: `COUNT(e.id)` ishlating (`COUNT(*)` NULL qatorni ham 1 sanab qo‘yadi!).',
      '2-maslahat: `LEFT JOIN employees e ON e.dept_id = d.id GROUP BY d.id, d.name ORDER BY d.name ASC`.',
    ],
    expectedBehavior:
      'LEFT JOIN va COUNT(e.id) orqali barcha bo‘limlar aniq xodimlar soni bilan qaytadi.',
    starterCode: `import sqlite3

def get_department_counts(conn: sqlite3.Connection) -> list[tuple[str, int]]:
    # TODO: Bitta SQL LEFT JOIN + GROUP BY so'rovini yozing
    sql = """
    SELECT d.name, 0
    FROM departments d
    ORDER BY d.name ASC
    """
    return conn.execute(sql).fetchall()

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE departments (id INT PRIMARY KEY, name TEXT)")
db.execute("CREATE TABLE employees (id INT PRIMARY KEY, name TEXT, dept_id INT)")
db.executemany("INSERT INTO departments VALUES (?, ?)", [(1, "Backend"), (2, "Design"), (3, "DevOps")])
db.executemany("INSERT INTO employees VALUES (?, ?, ?)", [(1, "Ali", 1), (2, "Vali", 1), (3, "Guli", 3)])
print(get_department_counts(db))`,
    solutionCode: `import sqlite3

def get_department_counts(conn: sqlite3.Connection) -> list[tuple[str, int]]:
    sql = """
    SELECT d.name, COUNT(e.id) as emp_count
    FROM departments d
    LEFT JOIN employees e ON e.dept_id = d.id
    GROUP BY d.id, d.name
    ORDER BY d.name ASC
    """
    return conn.execute(sql).fetchall()

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE departments (id INT PRIMARY KEY, name TEXT)")
db.execute("CREATE TABLE employees (id INT PRIMARY KEY, name TEXT, dept_id INT)")
db.executemany("INSERT INTO departments VALUES (?, ?)", [(1, "Backend"), (2, "Design"), (3, "DevOps")])
db.executemany("INSERT INTO employees VALUES (?, ?, ?)", [(1, "Ali", 1), (2, "Vali", 1), (3, "Guli", 3)])
print(get_department_counts(db))`,
    testCode: `test_db = sqlite3.connect(":memory:")
test_db.execute("CREATE TABLE departments (id INT PRIMARY KEY, name TEXT)")
test_db.execute("CREATE TABLE employees (id INT PRIMARY KEY, name TEXT, dept_id INT)")
test_db.executemany("INSERT INTO departments VALUES (?, ?)", [(1, "Backend"), (2, "Design"), (3, "DevOps")])
test_db.executemany("INSERT INTO employees VALUES (?, ?, ?)", [(1, "Ali", 1), (2, "Vali", 1), (3, "Guli", 3)])
res = get_department_counts(test_db)
assert res == [("Backend", 2), ("Design", 0), ("DevOps", 1)], f"Kutilgan: [('Backend', 2), ('Design', 0), ('DevOps', 1)], Olingan: {res}"`,
    explanation:
      '`LEFT JOIN` + `COUNT(e.id)` bo‘limda xodim bo‘lmaganda `NULL` ni 0 deb sanaydi; `COUNT(*)` esa xato ravishda 1 qaytarib yuborgan bo‘lardi!',
  },
];
