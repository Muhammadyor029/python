export interface PythonTypeLesson {
  id:
    | 'int'
    | 'float'
    | 'decimal'
    | 'str'
    | 'bool'
    | 'list'
    | 'tuple'
    | 'dict'
    | 'set'
    | 'none';
  keyword: string;
  titleUz: string;
  category: string;
  analogyTitle: string;
  analogyDesc: string;
  goldenRule: string;
  sampleCode: string;
  typeOutput: string;
  backendUse: string;
}

export const PYTHON_TYPES: PythonTypeLesson[] = [
  {
    id: 'int',
    keyword: 'int',
    titleUz: 'Butun son (Integer)',
    category: 'Sonlar',
    analogyTitle: 'Barmoq bilan sanaladigan aniq narsalar',
    analogyDesc:
      'int — vergulsiz, kasrsiz toza butun sonlar: 0, 1, 25, -10. Xuddi sinfdagi o‘quvchilar soni yoki buyurtma ID raqami kabi — 2.5 ta odam bo‘lmaydi!',
    goldenRule:
      'PostgreSQL’da ID uchun BIGINT (int8), Python’da esa cheksiz katta butun sonlar ham int bo‘ladi.',
    sampleCode: `yosh = 20
buyurtmalar_soni = 1540
qarz = -50

print(type(yosh))          # <class 'int'>
print(yosh + 5)            # 25
print(int("42") + 8)       # 50 — matndan int ga o'girish`,
    typeOutput: "<class 'int'>",
    backendUse: 'ID raqamlar, foydalanuvchi yoshi, mahsulot soni, sahifa raqami',
  },
  {
    id: 'float',
    keyword: 'float',
    titleUz: 'Haqiqiy kasr son (Float)',
    category: 'Sonlar',
    analogyTitle: 'Tarozidagi vazn yoki harorat',
    analogyDesc:
      'float — nuqtali (kasr) sonlar: 3.14, 36.6, -0.5. Kompyuter xotirasida ikkilik (binary) ko‘rinishda taqriban saqlanadi, shuning uchun 0.1 + 0.2 = 0.30000000000000004 chiqadi!',
    goldenRule:
      'Hech qachon PUL hisob-kitobida float ishlatmang! Float — masofa, foiz va ilmiy hisoblar uchun.',
    sampleCode: `harorat = 36.6
pi = 3.14159

print(type(harorat))       # <class 'float'>
print(0.1 + 0.2)           # 0.30000000000000004 (diqqat!)`,
    typeOutput: "<class 'float'>",
    backendUse: 'GPS koordinatalar, vazn, foiz ko‘rsatkichlari, reyting (4.8)',
  },
  {
    id: 'decimal',
    keyword: 'Decimal',
    titleUz: 'Aniq kasr (Pul uchun!)',
    category: 'Sonlar',
    analogyTitle: 'Bank kassasi va aniq hisob-kitob',
    analogyDesc:
      'Decimal (Django’da DecimalField, PostgreSQL’da NUMERIC) — 1 tiyin ham yo‘qolmasligi uchun matnga asoslangan o‘nlik aniqlikda hisoblaydi: 0.1 + 0.2 aniq 0.3 beradi.',
    goldenRule:
      'Django’da narx, balans, to‘lovlar uchun DOIM models.DecimalField(max_digits=12, decimal_places=2)!',
    sampleCode: `from decimal import Decimal

narx = Decimal("0.10") + Decimal("0.20")
print(narx)                # 0.30 (100% aniq!)
# Django modelda: DecimalField(max_digits=10, decimal_places=2)`,
    typeOutput: "<class 'decimal.Decimal'>",
    backendUse: 'Bank balansi, mahsulot narxi, soliq va cheklar',
  },
  {
    id: 'str',
    keyword: 'str',
    titleUz: 'Matn (String)',
    category: 'Matn',
    analogyTitle: 'Yelimlangan harflar poyezdi (o‘zgarmas)',
    analogyDesc:
      'str — qo‘shtirnoq ("...") yoki birtirnoq (\'...\') ichidagi har qanday matn. Python’da str IMMUTABLE (o‘zgarmas): bitta harfini joyida almashtirib bo‘lmaydi, har o‘zgarish yangi matn yaratadi.',
    goldenRule:
      'Formatlash uchun eng tez va zamonaviy usul — f-string: f"Salom, {ism}!". PostgreSQL’da oddiy matn uchun text ishlatiladi.',
    sampleCode: `ism = "Amir"
xabar = f"Salom, {ism.upper()}!"

print(xabar)               # Salom, AMIR!
print(ism[0], ism[-1])     # A  r (birinchi va oxirgi harf)
print(ism[::-1])           # rimA (teskari kesish / slicing)`,
    typeOutput: "<class 'str'>",
    backendUse: 'Ism, email, URL slug, JWT tokenlar, JSON javoblar',
  },
  {
    id: 'bool',
    keyword: 'bool',
    titleUz: 'Mantiqiy qiymat (Boolean)',
    category: 'Mantiq',
    analogyTitle: 'Chiroq kaliti: Yoqilgan yoki O‘chiq',
    analogyDesc:
      'bool faqat ikki holatdan birini oladi: True (ha / yoqilgan) yoki False (yo‘q / o‘chiq). Barcha if shartlari oxir-oqibat True yoki False ga aylanadi.',
    goldenRule:
      'Bo‘sh qiymatlar ("", [], {}, 0, None) shart ichida False, to‘la qiymatlar esa True hisoblanadi.',
    sampleCode: `tolangan = True
bloklangan = False

if tolangan and not bloklangan:
    print("Kirishga ruxsat!")
print(type(tolangan))      # <class 'bool'>`,
    typeOutput: "<class 'bool'>",
    backendUse: 'is_active, is_staff, email_tasdiqlangan, obuna holati',
  },
  {
    id: 'list',
    keyword: 'list',
    titleUz: 'Ro‘yxat (List)',
    category: 'To‘plamlar',
    analogyTitle: 'Ochiq va raqamlangan kitob javoni [ ]',
    analogyDesc:
      'list — tartibli va O‘ZGARUVCHAN (mutable) to‘plam. Kvadrat qavs [] bilan yoziladi. Yangi element qo‘shish (.append), o‘chirish (.pop) va almashtirish mumkin.',
    goldenRule:
      'O‘zgaruvchan bo‘lgani uchun list dict kaliti bo‘la olmaydi. Tez yaratish uchun List Comprehension: [x*2 for x in sonlar].',
    sampleCode: `mahsulotlar = ["non", "choy", "shakar"]
mahsulotlar.append("asal")
mahsulotlar[1] = "ko'k choy"

juftlar = [x for x in range(6) if x % 2 == 0]
print(mahsulotlar, juftlar)`,
    typeOutput: "<class 'list'>",
    backendUse: 'Buyurtma elementlari ro‘yxati, DRF API natijalari, batch yozuvlar',
  },
  {
    id: 'tuple',
    keyword: 'tuple',
    titleUz: 'Kortej (Tuple)',
    category: 'To‘plamlar',
    analogyTitle: 'Shisha bilan muhrlangan javon ( )',
    analogyDesc:
      'tuple — tartibli, lekin O‘ZGARMAS (immutable) ro‘yxat. Yaratilgandan keyin ichidagi elementni o‘zgartirib ham, o‘chirib ham bo‘lmaydi. Shu bois xotirada yengil va listdan tezroq.',
    goldenRule:
      'O‘zgarmas bo‘lgani uchun tuple hashable — uni dict kaliti yoki set elementi qilish mumkin!',
    sampleCode: `koordinata = (41.2995, 69.2401)  # Toshkent
# koordinata[0] = 42  -> TypeError! O'zgartirib bo'lmaydi

statuslar = (("new", "Yangi"), ("paid", "To'langan"))
print(type(koordinata))`,
    typeOutput: "<class 'tuple'>",
    backendUse: 'Django choices, ALLOWED_HOSTS, koordinatalar, *args yig‘ish',
  },
  {
    id: 'dict',
    keyword: 'dict',
    titleUz: 'Lug‘at (Dictionary)',
    category: 'To‘plamlar',
    analogyTitle: 'Har bir narsaning aniq nomi yozilgan quti { }',
    analogyDesc:
      'dict — kalit: qiymat (key: value) juftliklaridan iborat hash-jadval. Millionta element ichidan ham kalit orqali O(1) — bir zumda topadi!',
    goldenRule:
      'Yo‘q kalitni d["kalit"] deb olish KeyError beradi; xavfsiz olish uchun DOIM d.get("kalit", default) ishlating!',
    sampleCode: `talaba = {"ism": "Dilshod", "daraja": "Junior"}
talaba["shahar"] = "Samarqand"

# Xavfsiz olish (KeyError bermaydi):
ball = talaba.get("ball", 0)
print(talaba["ism"], ball)`,
    typeOutput: "<class 'dict'>",
    backendUse: 'JSON API body/javoblari, request.session, **kwargs, kesh',
  },
  {
    id: 'set',
    keyword: 'set',
    titleUz: 'To‘plam (Set)',
    category: 'To‘plamlar',
    analogyTitle: 'Dublikatlarni avtomatik olib tashlaydigan elak',
    analogyDesc:
      'set — tartibsiz, indekssiz va faqat NOYOB (takrorlanmas) elementlarni saqlaydigan to‘plam. Element bor-yo‘qligini tekshirish (x in s) listga qaraganda ming marta tez (O(1)).',
    goldenRule:
      'Bo‘sh set yaratish uchun {} emas (u dict!), set() yoziladi. Listdagi dublikatlarni yo‘qotish: list(set(royxat)).',
    sampleCode: `teglar = {"python", "django", "python", "redis"}
print(teglar)              # {'python', 'django', 'redis'}

a = {1, 2, 3}; b = {2, 3, 4}
print(a & b)               # {2, 3} (kesishma)`,
    typeOutput: "<class 'set'>",
    backendUse: 'Unikal ID’lar (favorite_ids), ruxsatlar kesishmasi, tez qidiruv',
  },
  {
    id: 'none',
    keyword: 'None',
    titleUz: 'Bo‘sh qiymat (None / NULL)',
    category: 'Maxsus',
    analogyTitle: 'Hali hech kim o‘tirmagan bo‘sh stul',
    analogyDesc:
      'None — 0 ham emas, bo‘sh satr "" ham emas; qiymat umuman yo‘qligini bildiradi. PostgreSQL’da bu NULL ga to‘g‘ri keladi (hatto NULL = NULL ham True emas!).',
    goldenRule:
      'Python’da DOIM "if x is None:" ishlating ("==" emas). SQL’da esa "WHERE ustun IS NULL".',
    sampleCode: `chegirma = None

if chegirma is None:
    print("Chegirma belgilanmagan")

# PostgreSQL'da COALESCE(chegirma, 0) -> 0 qaytaradi`,
    typeOutput: "<class 'NoneType'>",
    backendUse: 'deleted_at=None (o‘chirilmagan), optional FK, .first() natijasi',
  },
];
