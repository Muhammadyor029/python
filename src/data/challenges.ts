export type ChallengeScope = 'hammasi' | 'python' | 'django' | 'api';

export interface RandomQuizQuestion {
  id: string;
  scope: Exclude<ChallengeScope, 'hammasi'>;
  topicTag: string;
  prompt: string;
  codeContext?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BugHunterChallenge {
  id: string;
  scope: Exclude<ChallengeScope, 'hammasi'>;
  siteName: string;
  endpointOrFile: string;
  symptomError: string;
  scenario: string;
  codeLines: string[];
  bugLineNumber: number; // 1-indexed
  fixChoices: {
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  fixedLinePreview: string;
}

export interface SequenceChallenge {
  id: string;
  scope: Exclude<ChallengeScope, 'hammasi'>;
  title: string;
  description: string;
  stepsInOrder: string[];
  explanation: string;
}

export const RANDOM_QUIZ_BANK: RandomQuizQuestion[] = [
  // PYTHON (10 questions)
  {
    id: 'qz-py-decimal',
    scope: 'python',
    topicTag: 'Python · Turlar (0-bosqich)',
    prompt:
      'Onlayn do‘kon backendida mahsulot narxlari va foydalanuvchi balansini hisoblashda nega float o‘rniga Decimal ishlatiladi?',
    codeContext: '>>> 0.1 + 0.2\n0.30000000000000004',
    options: [
      'float ikkilik sanoq tizimida ba’zi o‘nlik kasrlarni aniq saqlay olmaydi va tiyinlarda xatolik yig‘iladi',
      'Decimal sonlarni faqat bazadan tashqarida matn sifatida chop etish uchun kerak',
      'float faqat manfiy sonlar bilan ishlay olmaydi',
      'Decimal har doim float ga qaraganda 100 barobar kam xotira egallaydi',
    ],
    correctIndex: 0,
    explanation:
      'IEEE 754 float ikkilik sanoqda 0.1 ni cheksiz kasr sifatida saqlaydi. Pul va moliya hisobida har doim Decimal("0.10") va Django DecimalField ishlatiladi.',
  },
  {
    id: 'qz-py-is-none',
    scope: 'python',
    topicTag: 'Python · Xotira & "is"',
    prompt: 'Python’da qiymatning None ekanligini tekshirishning eng to‘g‘ri va xavfsiz usuli qaysi?',
    options: [
      'if qiymat is None:',
      'if qiymat == None:',
      'if type(qiymat) == "None":',
      'if qiymat = None:',
    ],
    correctIndex: 0,
    explanation:
      'None butun dastur davomida bitta singleton obyekt. "is" xotira manzilini tezkor tekshiradi va maxsus __eq__ metodlari tomonidan aldanmaydi (PEP 8 talabi).',
  },
  {
    id: 'qz-py-mutable-default',
    scope: 'python',
    topicTag: 'Python · Funksiyalar',
    prompt:
      'Quyidagi funksiyani ikki marta chaqirganda (qosh("a"), keyin qosh("b")) nima sodir bo‘ladi?',
    codeContext: 'def qosh(el, savat=[]):\n    savat.append(el)\n    return savat',
    options: [
      'Ikkinchi chaqiruv ["a", "b"] qaytaradi, chunki default [] funksiya e’lon qilinganda 1 marta yaratiladi',
      'Har safar yangi ["a"] va ["b"] ro‘yxat qaytadi',
      'Python darhol TypeError tashlaydi',
      'Ikkinchi chaqiruv faqat None qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'Python funksiyaning default argumentini chaqirganda emas, def o‘qilganda 1 marta yaratadi! Shuning uchun default sifatida savat=None berib, ichida savat = [] ochish shart.',
  },
  {
    id: 'qz-py-generator',
    scope: 'python',
    topicTag: 'Python · Generator (yield)',
    prompt: '10 million qatorli log faylni RAM’ni to‘ldirmasdan qatorma-qator o‘qish uchun nima ishlatiladi?',
    options: [
      'yield bilan yozilgan Generator funksiya (lazy evaluation)',
      'Butun faylni list(f.readlines()) ga yuklash',
      'Barcha qatorlarni bitta tuple ga o‘girish',
      'deepcopy() bilan nusxa ko‘chirish',
    ],
    correctIndex: 0,
    explanation:
      'Generator next() chaqirilganda navbatdagi bitta elementnigina hisoblaydi — xotira O(1) darajasida qoladi.',
  },
  {
    id: 'qz-py-gil',
    scope: 'python',
    topicTag: 'Python · GIL & Concurrency',
    prompt:
      '100 ta rasmni og‘ir matematika bilan siqish (CPU-bound) va 100 ta tashqi API ga so‘rov yuborish (I/O-bound) uchun mos tanlov qaysi?',
    options: [
      'CPU-bound uchun Multiprocessing; I/O-bound uchun Asyncio yoki Threading',
      'Ikkalasiga ham faqat bitta oddiy for sikli',
      'CPU-bound uchun Threading, chunki GIL uni tezlashtiradi',
      'Asyncio CPU yadrolarini avtomatik 16 taga bo‘ladi',
    ],
    correctIndex: 0,
    explanation:
      'GIL bir jarayonda bir vaqtda faqat bitta thread Python baytkodini bajarishiga ruxsat beradi. CPU yuklamasini faqat alohida OS jarayonlari (Multiprocessing) parallel bajaradi.',
  },
  {
    id: 'qz-py-decorator',
    scope: 'python',
    topicTag: 'Python · Dekoratorlar',
    prompt: 'Dekorator ichidagi wrapper funksiyaga @functools.wraps(func) yozish nima uchun kerak?',
    options: [
      'Asl funksiyaning __name__, __doc__ va metama’lumotlarini saqlab qolish uchun',
      'Funksiyani avtomatik bazaga yozish uchun',
      'Xotirani C tilida tozalash uchun',
      'Dekoratorni faqat int qaytaradigan qilish uchun',
    ],
    correctIndex: 0,
    explanation:
      '@wraps bo‘lmasa, DRF/Swagger yoki logging tizimi barcha dekoratsiya qilingan funksiyalarni "wrapper" deb ko‘rib adashadi.',
  },
  {
    id: 'qz-py-slots',
    scope: 'python',
    topicTag: 'Python · OOP & Xotira',
    prompt: 'Klassda __slots__ = ("x", "y") e’lon qilish qanday natija beradi?',
    options: [
      'Har bir obyekt uchun __dict__ lug‘ati yaratilmaydi va RAM sezilarli tejaladi',
      'Klassdan meros olish butunlay taqiqlanadi',
      'Barcha metodlar avtomatik asinxron bo‘ladi',
      'Obyektlar PostgreSQL ga avtomatik saqlanadi',
    ],
    correctIndex: 0,
    explanation:
      'Oddiy klass har bir nusxada dinamik __dict__ saqlaydi. __slots__ atributlar ro‘yxatini qat’iy belgilab, katta sonli obyektlarda xotirani ~50% gacha kamaytiradi.',
  },
  {
    id: 'qz-py-try-else',
    scope: 'python',
    topicTag: 'Python · Xatolar boshqaruvi',
    prompt: 'Python’da try / except / else / finally tuzilmasida "else" bloki qachon ishga tushadi?',
    options: [
      'Faqat try bloki ichida hech qanday xato (exception) chiqmaganda',
      'Faqat except xato ushlaganidan keyin',
      'Xato chiqishidan qat’i nazar har doim',
      'Faqat return dan keyin',
    ],
    correctIndex: 0,
    explanation:
      'try muvaffaqiyatli tugasa → else ishlaydi. Xato chiqsa → except ishlaydi. finally esa har ikkala holatda ham albatta bajariladi.',
  },
  {
    id: 'qz-py-deepcopy',
    scope: 'python',
    topicTag: 'Python · Shallow vs Deep Copy',
    prompt: 'a = [[1, 2], [3, 4]] ro‘yxatidan b = a.copy() olinsa va b[0].append(99) bajarilsa, a[0] qanday bo‘ladi?',
    options: [
      'a[0] ham [1, 2, 99] ga o‘zgaradi, chunki .copy() sayoz (shallow) nusxa oladi',
      'a[0] o‘zgarmaydi ([1, 2] qoladi)',
      'Python ValueError qaytaradi',
      'a butunlay bo‘shab qoladi',
    ],
    correctIndex: 0,
    explanation:
      'Shallow copy tashqi ro‘yxatni yangilaydi, lekin ichidagi [1, 2] ga o‘sha eski manzilni qoldiradi. Mustaqil nusxa uchun copy.deepcopy(a) kerak.',
  },

  // DJANGO & POSTGRESQL (11 questions)
  {
    id: 'qz-pg-null-trap',
    scope: 'django',
    topicTag: 'PostgreSQL · NULL Mantiqi',
    prompt:
      'Buyurtmalar jadvalida 100 ta qator bor, shundan 20 tasining status ustuni NULL. "SELECT COUNT(*) FROM orders WHERE status != \'cancelled\'" nechta qator qaytaradi (cancelled lar 10 ta bo‘lsa)?',
    options: [
      '70 ta — chunki NULL != \'cancelled\' natijasi UNKNOWN (NULL) bo‘lib, WHERE dan o‘tmaydi',
      '90 ta — chunki NULL qiymat cancelled ga teng emas',
      '100 ta — PostgreSQL xato bermaydi',
      '0 ta — syntax error chiqadi',
    ],
    correctIndex: 0,
    explanation:
      'SQL uch qiymatli mantiqda ishlaydi: NULL bilan har qanday =, != solishtirish UNKNOWN qaytaradi. NULL qatorlarni ham qo‘shish uchun "WHERE status IS DISTINCT FROM \'cancelled\'" ishlating.',
  },
  {
    id: 'qz-pg-mvcc',
    scope: 'django',
    topicTag: 'PostgreSQL · MVCC & VACUUM',
    prompt: 'PostgreSQL’da katta jadvalda UPDATE qilganda o‘quvchilar (SELECT) nega yozuvchini kutib qolmaydi?',
    options: [
      'MVCC har bir UPDATE da eski qatorni o‘chirmay yangi versiyasini (tuple) yozadi; eski qoldiqlarni VACUUM tozalaydi',
      'PostgreSQL barcha ma’lumotni faqat Redis RAM da saqlaydi',
      'SELECT so‘rovlari har doim diskni qulflaydi',
      'UPDATE operatsiyasi ma’lumotni o‘zgartirmaydi',
    ],
    correctIndex: 0,
    explanation:
      'MVCC (Multi-Version Concurrency Control) o‘quvchilarga tranzaksiya boshlangan paytdagi barqaror snapshotni beradi. Autovacuum esa eski dead tuple joyini qayta ishlatishga bo‘shatadi.',
  },
  {
    id: 'qz-pg-index',
    scope: 'django',
    topicTag: 'PostgreSQL · Indekslar',
    prompt: 'JSONB ichidagi kalitlar (@>) va "%so‘z%" (pg_trgm) qidiruvini tezlashtirish uchun qaysi PostgreSQL indeksi tanlanadi?',
    options: ['GIN indeksi', 'BRIN indeksi', 'Hash indeksi', 'Unique Constraint'],
    correctIndex: 0,
    explanation:
      'GIN (Generalized Inverted Index) JSONB, massivlar va to‘liq matn/trigram qidiruvlari uchun mo‘ljallangan. B-tree esa oddiy =, <, >, ORDER BY uchun eng tez.',
  },
  {
    id: 'qz-pg-skip-locked',
    scope: 'django',
    topicTag: 'PostgreSQL · Concurrency',
    prompt: 'Bir nechta parallel worker bitta SQL navbat jadvalidan bir xil vazifani tortib olmasligi uchun eng to‘g‘ri SQL qaysi?',
    options: [
      'SELECT ... WHERE status = \'pending\' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED',
      'SELECT ... LIMIT 1 (hech qanday qulfsiz)',
      'LOCK TABLE jobs IN ACCESS EXCLUSIVE MODE',
      'SELECT DISTINCT * FROM jobs',
    ],
    correctIndex: 0,
    explanation:
      'FOR UPDATE SKIP LOCKED boshqa worker qulflagan qatorni kutmasdan sakrab o‘tib, darhol keyingi bo‘sh qatorni band qiladi.',
  },
  {
    id: 'qz-dj-null-blank',
    scope: 'django',
    topicTag: 'Django · Model Maydonlari',
    prompt: 'Django’da "telefon = models.CharField(max_length=20, blank=True)" qachon null=True ga muhtoj EMAS?',
    options: [
      'CharField va TextField da bo‘sh qiymat "" sifatida saqlanadi; null=True esa unique=True bo‘lgandagina istisno tariqasida kerak',
      'CharField hech qachon bo‘sh bo‘la olmaydi',
      'blank=True avtomatik PostgreSQL ustunini NULL ga aylantiradi',
      'Har doim null=True va blank=True ikkalasi ham taqiqlangan',
    ],
    correctIndex: 0,
    explanation:
      'null=True baza darajasida NULL ruxsati, blank=True esa form/serializer tekshiruvi. CharField da "" va NULL ikkita xil "bo‘sh" holat yaratmasligi uchun odatda faqat blank=True yoziladi (lekin unique=True bo‘lsa NULL lar unikal sanalmaydi, shunda null=True qo‘shiladi).',
  },
  {
    id: 'qz-dj-nplus1',
    scope: 'django',
    topicTag: 'Django ORM · N+1',
    prompt: 'Har bir Talaba va uning 10 ta Kursini chiqarishda (ManyToMany / reverse ForeignKey) N+1 muammosini nima hal qiladi?',
    options: [
      'prefetch_related("kurslar")',
      'select_related("kurslar")',
      'only("id")',
      'defer("kurslar")',
    ],
    correctIndex: 0,
    explanation:
      'select_related() faqat ForeignKey va OneToOne ("bitta" tomon) uchun SQL JOIN qiladi; ko‘p tomonli bog‘lanishlarda (ManyToMany, reverse FK) prefetch_related() 2-so‘rov + Python bog‘lash bilan N+1 ni yo‘qotadi.',
  },
  {
    id: 'qz-dj-on-commit',
    scope: 'django',
    topicTag: 'Django · Tranzaksiyalar & Celery',
    prompt: 'Nima uchun transaction.atomic() ichida Celery taskini darhol task.delay(obj.id) qilib chaqirish xavfli?',
    options: [
      'Celery worker tranzaksiya COMMIT bo‘lishidan oldin ishga tushib, bazadan DoesNotExist xatosini olishi mumkin',
      'Celery atomic blok ichida umuman import bo‘lmaydi',
      'Redis faqat GET so‘rovlarni qabul qiladi',
      'obj.id har doim 0 bo‘lib qoladi',
    ],
    correctIndex: 0,
    explanation:
      'PostgreSQL tranzaksiya COMMIT bo‘lmaguncha yangi qatorni boshqa jarayonlarga (Celery workerga) ko‘rsatmaydi. Shu bois faqat transaction.on_commit(lambda: task.delay(obj.id)) ishlatiladi!',
  },
  {
    id: 'qz-dj-signals',
    scope: 'django',
    topicTag: 'Django · Signallar vs ORM',
    prompt: 'Qaysi Django ORM buyruqlari post_save va pre_save signallarini CHAQIRMAYDI?',
    options: [
      'QuerySet.update(), bulk_create() va bulk_update()',
      'Model.objects.create() va obj.save()',
      'get_or_create()',
      'update_or_create()',
    ],
    correctIndex: 0,
    explanation:
      'update() va bulk_* buyruqlar to‘g‘ridan-to‘g‘ri SQL ga tarjima qilinadi va Python model .save() metodini aylanib o‘tadi, shu sababli signallar ishlamaydi.',
  },
  {
    id: 'qz-dj-migration',
    scope: 'django',
    topicTag: 'Django · Zero-Downtime',
    prompt: '10 million qatorli production jadvalga AddIndexConcurrently qo‘shganda migratsiyada nima yozish shart?',
    options: [
      'Migration klassi ichida atomic = False yozish shart',
      'DEBUG = True yoqish kerak',
      'runserver ni qayta ishga tushirish kerak',
      'Jadvalni avval DROP TABLE qilish kerak',
    ],
    correctIndex: 0,
    explanation:
      'PostgreSQL CREATE INDEX CONCURRENTLY buyrug‘ini tranzaksiya (BEGIN/COMMIT) ichida bajarishga ruxsat bermaydi. Shuning uchun Django migratsiyasida atomic = False qo‘yiladi.',
  },

  // DRF & API (10 questions)
  {
    id: 'qz-api-mass-assignment',
    scope: 'api',
    topicTag: 'DRF · Xavfsizlik',
    prompt: 'ModelSerializer ichida Meta.fields = "__all__" yozish qanday jiddiy xavf tug‘diradi?',
    options: [
      'Mass Assignment: foydalanuvchi JSON da "is_admin": true yoki "balans": 999999 yuborib maydonlarni o‘zgartirib olishi mumkin',
      'JSON javob XML formatiga o‘tib ketadi',
      'Serializer endi faqat GET so‘rovlarni qabul qiladi',
      'PostgreSQL indekslari o‘chib ketadi',
    ],
    correctIndex: 0,
    explanation:
      'Har doim fields = ["id", "nomi", ...] aniq sanab o‘tilishi va user/role/status/balans kabi maydonlar read_only_fields da turishi shart.',
  },
  {
    id: 'qz-api-401-403',
    scope: 'api',
    topicTag: 'DRF · HTTP Statuslar',
    prompt: 'Foydalanuvchi tizimga valid JWT tokeni bilan kirdi, lekin boshqa foydalanuvchining shaxsiy chekini o‘chirmoqchi bo‘ldi. Qaysi status kod qaytadi?',
    options: [
      '403 Forbidden (autentifikatsiya bor, lekin huquq yo‘q)',
      '401 Unauthorized (token umuman yo‘q)',
      '201 Created',
      '502 Bad Gateway',
    ],
    correctIndex: 0,
    explanation:
      '401 — kimligingiz noma’lum (login qiling); 403 — kimligingiz aniq, lekin ushbu obyektga/amalga ruxsatingiz yo‘q.',
  },
  {
    id: 'qz-api-idor',
    scope: 'api',
    topicTag: 'DRF · IDOR Himoyasi',
    prompt:
      'GET /api/v1/orders/42/ endpointida bir foydalanuvchi boshqasining buyurtma ID sini terib ko‘ra olmasligi (IDOR) uchun nima qilinadi?',
    options: [
      'get_queryset() ni request.user bilan cheklash va has_object_permission() qo‘llash',
      'ID larni faqat frontendda yashirib qo‘yish',
      'CORS ni o‘chirish',
      'AllowAny permission qo‘yish',
    ],
    correctIndex: 0,
    explanation:
      'Xavfsizlik hech qachon frontendga ishonmaydi. Backendda queryset.filter(ega=request.user) va object-level permission IDOR hujumini butunlay yopadi.',
  },
  {
    id: 'qz-api-validation',
    scope: 'api',
    topicTag: 'DRF · Serializer Validatsiyasi',
    prompt: 'DRF da serializer.is_valid() chaqirilganda tekshiruvlar qaysi tartibda bajariladi?',
    options: [
      '1) Field tipi & validators → 2) validate_<maydon>() → 3) validate(attrs)',
      '1) validate(attrs) → 2) Field tipi → 3) validate_<maydon>()',
      'Faqat save() chaqirilgandan keyin tekshiriladi',
      'Faqat PostgreSQL CHECK constraint tekshiradi',
    ],
    correctIndex: 0,
    explanation:
      'Avval har bir maydon o‘z turi va validators=[] dan o‘tadi, so‘ng validate_<field>, eng oxirida barcha maydonlar o‘zaro validate(attrs) da solishtiriladi.',
  },
  {
    id: 'qz-api-pagination',
    scope: 'api',
    topicTag: 'DRF · Pagination',
    prompt: 'Millionlab yozuvli cheksiz lenta (feed) uchun nega PageNumberPagination o‘rniga CursorPagination afzal?',
    options: [
      'OFFSET katta raqamda sekinlashadi; CursorPagination oxirgi ko‘rilgan qiymatdan indeks bilan O(1) oladi va dublikat bermaydi',
      'CursorPagination faqat 5 ta qator saqlaydi',
      'PageNumberPagination JSON qaytarmaydi',
      'CursorPagination SQL ishlatmaydi',
    ],
    correctIndex: 0,
    explanation:
      'SQL "OFFSET 500000" 500 ming qatorni sanab tashlab yuboradi. CursorPagination esa "WHERE id < oxirgi_id LIMIT 20" qilib darhol indeksdan oladi.',
  },
  {
    id: 'qz-api-idempotency',
    scope: 'api',
    topicTag: 'DRF · To‘lov & Idempotency',
    prompt: 'Mobil ilovada internet uzilib qayta ulanganda POST /api/v1/pay/ so‘rovi 2 marta ketsa, ikki marta pul yechmaslik uchun nima ishlatiladi?',
    options: [
      'Headerda unikal Idempotency-Key (UUID) yuborib, bir xil kalitga avvalgi saqlangan javobni qaytarish',
      'So‘rovni GET metodiga almashtirish',
      'Throttling ni o‘chirib qo‘yish',
      'JWT muddatini 100 yil qilish',
    ],
    correctIndex: 0,
    explanation:
      'Idempotency-Key serverda unikal kalit sifatida saqlanadi: birinchi so‘rov natijasi yoziladi, xuddi shu kalit bilan kelgan qayta urinishga o‘sha natija qaytariladi.',
  },
  {
    id: 'qz-api-jwt',
    scope: 'api',
    topicTag: 'DRF · JWT Lifecycle',
    prompt: 'JWT tizimida Access token muddati nega qisqa (5–15 min) va Refresh token nega uzun (7 kun) qilinadi?',
    options: [
      'Access o‘g‘irlansa zarar vaqti qisqa bo‘ladi; Refresh esa Rotation + Blacklist bilan xavfsiz tarzda yangi Access beradi',
      'Access token bazada saqlanadi, Refresh saqlanmaydi',
      'JWT parollarni shifrsiz saqlash uchun ishlatiladi',
      'Refresh token har bir rasm yuklaganda yuboriladi',
    ],
    correctIndex: 0,
    explanation:
      'Stateless Access token har so‘rovda tekshiriladi va tez eskiradi; Refresh token esa kam ishlatilib, ROTATE_REFRESH_TOKENS=True bilan nazorat qilinadi.',
  },
  {
    id: 'qz-api-202',
    scope: 'api',
    topicTag: 'DRF · Asinxron API',
    prompt: 'Katta PDF hisobot generatsiya qiluvchi API endpointi foydalanuvchini 20 soniya kutdirmasdan qaysi HTTP statusni qaytarishi to‘g‘ri?',
    options: [
      '202 Accepted (vazifa Celery navbatiga qabul qilindi + task_id)',
      '200 OK (bo‘sh fayl bilan)',
      '404 Not Found',
      '500 Internal Server Error',
    ],
    correctIndex: 0,
    explanation:
      '202 Accepted — so‘rov qabul qilindi, lekin fon ishchisi (Celery) tomonidan bajarilmoqda; klient task_id orqali holatini tekshirishi mumkin.',
  },
];

export const BUG_HUNTER_CHALLENGES: BugHunterChallenge[] = [
  {
    id: 'bug-py-float-money',
    scope: 'python',
    siteName: 'Paimon Mini-Kassa',
    endpointOrFile: 'billing/checkout.py',
    symptomError: 'AssertionError: Mijoz balansi 0.30000000000000004 chiqib, to‘lov tasdiqlanmadi!',
    scenario:
      'Kichik savdo saytini ishga tushirishda bonus va to‘lov yig‘indisi 0.30 ga teng bo‘lishi kerak edi, lekin Python xato bermoqda. Qaysi qatorda xato bor va uni qanday tuzatamiz?',
    codeLines: [
      'def tekshir_tolov(bonus, karta):',
      '    jami = float(bonus) + float(karta)',
      '    if jami == 0.3:',
      '        return {"holat": "Tolandi"}',
      '    raise AssertionError(f"Mijoz balansi {jami} chiqdi!")',
    ],
    bugLineNumber: 2,
    fixChoices: [
      {
        label: 'Decimal(str(bonus)) + Decimal(str(karta)) == Decimal("0.30") ishlatish',
        isCorrect: true,
        feedback:
          '200 OK · Kassa to‘g‘ri ishladi! Decimal aniq o‘nlik arifmetika bilan 0.30 natija beradi.',
      },
      {
        label: 'float() o‘rniga int(bonus) + int(karta) qilish',
        isCorrect: false,
        feedback: 'int() kasr qismini (tiyinlarni) butunlay kesib tashlaydi (0.1 -> 0)!',
      },
      {
        label: 'jami ni list ichiga solib solishtirish',
        isCorrect: false,
        feedback: 'Ro‘yxat ichiga solish 0.1 + 0.2 ikkilik xatoligini tuzatmaydi.',
      },
    ],
    fixedLinePreview: '    jami = Decimal(str(bonus)) + Decimal(str(karta))  # Aniq: 0.30',
  },
  {
    id: 'bug-py-mutable-list',
    scope: 'python',
    siteName: 'Paimon Savatcha Servisi',
    endpointOrFile: 'cart/service.py',
    symptomError: 'Bug: 2-mijoz savatiga 1-mijozning mahsulotlari qo‘shilib ketmoqda!',
    scenario:
      'Ikki foydalanuvchi alohida savat ochmoqda, lekin barcha mijozlar bitta ro‘yxatni bo‘lishib qoldi. Muammo qaysi qatorda?',
    codeLines: [
      'def savatga_qosh(mahsulot, savat=[]):',
      '    savat.append(mahsulot)',
      '    return savat',
      '',
      'ali = savatga_qosh("Django kitob")',
      'vali = savatga_qosh("Python kurs")  # ["Django kitob", "Python kurs"]!',
    ],
    bugLineNumber: 1,
    fixChoices: [
      {
        label: 'def savatga_qosh(mahsulot, savat=None): va ichida if savat is None: savat = []',
        isCorrect: true,
        feedback:
          '200 OK · Har bir mijoz endi o‘z mustaqil savatiga ega! Mutable default tuzog‘i yopildi.',
      },
      {
        label: 'savat=[] o‘rniga savat={} (bo‘sh dict) qo‘yish',
        isCorrect: false,
        feedback: 'Dict ham mutable — xuddi shu muammo takrorlanadi!',
      },
      {
        label: 'return savat ni olib tashlash',
        isCorrect: false,
        feedback: 'Funksiya None qaytaradi va muammo hal bo‘lmaydi.',
      },
    ],
    fixedLinePreview: 'def savatga_qosh(mahsulot, savat=None):\n    if savat is None: savat = []',
  },
  {
    id: 'bug-dj-on-commit',
    scope: 'django',
    siteName: 'Paimon Buyurtma Sayti',
    endpointOrFile: 'orders/views.py',
    symptomError: 'Celery Error: Buyurtma.DoesNotExist: Buyurtma #88 bazadan topilmadi!',
    scenario:
      'Sayt yuqori tezlikda ishlaganda bazaga yozilgan buyurtmani Celery worker ba’zan topa olmay qulayapti. Xato qaysi qatorda?',
    codeLines: [
      'with transaction.atomic():',
      '    buyurtma = Buyurtma.objects.create(ega=request.user, summa=150000)',
      '    tasdiq_email_yubor.delay(buyurtma.id)',
      '    # ... keyingi ogir hisob-kitoblar (50ms)',
      'return Response({"id": buyurtma.id}, status=201)',
    ],
    bugLineNumber: 3,
    fixChoices: [
      {
        label: 'transaction.on_commit(lambda: tasdiq_email_yubor.delay(buyurtma.id))',
        isCorrect: true,
        feedback:
          '201 Created · Endi Celery taski faqat PostgreSQL COMMIT yakunlangandan keyingina navbatga tushadi!',
      },
      {
        label: 'time.sleep(5) qo‘yib keyin delay chaqirish',
        isCorrect: false,
        feedback: 'Atomic blok ichida hali ham COMMIT bo‘lmagan — worker baribir ko‘rmaydi, ustiga foydalanuvchi 5s kutadi!',
      },
      {
        label: 'transaction.atomic() ni olib tashlab xavfsizlikni o‘chirish',
        isCorrect: false,
        feedback: 'Atomarliksiz yarmi yozilgan buzilgan buyurtmalar bazada qolib ketadi.',
      },
    ],
    fixedLinePreview: '    transaction.on_commit(lambda: tasdiq_email_yubor.delay(buyurtma.id))',
  },
  {
    id: 'bug-dj-addindex',
    scope: 'django',
    siteName: 'Paimon Katalog Deploy',
    endpointOrFile: 'courses/migrations/0004_index.py',
    symptomError: 'psycopg2.errors.ActiveSqlTransaction: CREATE INDEX CONCURRENTLY cannot run inside a transaction block',
    scenario:
      'Saytga zero-downtime indeks migratsiyasi qo‘shildi, lekin `python manage.py migrate` paytida server yiqildi. Sababi nimada?',
    codeLines: [
      'from django.contrib.postgres.operations import AddIndexConcurrently',
      'from django.db import migrations, models',
      '',
      'class Migration(migrations.Migration):',
      '    dependencies = [("courses", "0003_initial")]',
      '    operations = [AddIndexConcurrently(model_name="kurs", index=models.Index(fields=["slug"], name="idx_slug"))]',
    ],
    bugLineNumber: 4,
    fixChoices: [
      {
        label: 'class Migration ichiga "atomic = False" qo‘shish',
        isCorrect: true,
        feedback:
          'Migrate OK · PostgreSQL CONCURRENTLY buyrug‘i tranzaksiyasiz ishlaydi va jadvalni bloklamaydi!',
      },
      {
        label: 'AddIndexConcurrently o‘rniga oddiy AddIndex qo‘yish (10M qatorni qulflash)',
        isCorrect: false,
        feedback: 'Oddiy AddIndex katta jadvalni yozish uchun butunlay qulflab saytni to‘xtatib qo‘yadi!',
      },
      {
        label: 'dependencies ni bo‘sh qoldirish',
        isCorrect: false,
        feedback: 'Migratsiya grafigi buziladi va ActiveSqlTransaction xatosi qoladi.',
      },
    ],
    fixedLinePreview: 'class Migration(migrations.Migration):\n    atomic = False',
  },
  {
    id: 'bug-api-mass-assign',
    scope: 'api',
    siteName: 'Paimon Profil API',
    endpointOrFile: 'users/serializers.py',
    symptomError: 'Security Alert: Oddiy foydalanuvchi PATCH /api/v1/profile/ orqali o‘zini is_staff=True qildi!',
    scenario:
      'Sayt API sini tekshirishda xavfsizlik teshigi (Mass Assignment) topildi. Qaysi qator xavfli?',
    codeLines: [
      'class ProfilSerializer(serializers.ModelSerializer):',
      '    class Meta:',
      '        model = TalabaUser',
      '        fields = "__all__"',
      '        extra_kwargs = {"email": {"required": True}}',
    ],
    bugLineNumber: 4,
    fixChoices: [
      {
        label: 'fields = ["id", "email", "first_name", "daraja"] deb aniq ruxsatli maydonlarni yozish (is_staff, password YO‘Q)',
        isCorrect: true,
        feedback:
          '200 OK · Mass Assignment yopildi! Endi foydalanuvchi faqat ruxsat etilgan profil maydonlarini tahrirlaydi.',
      },
      {
        label: 'exclude = ["first_name"] yozish',
        isCorrect: false,
        feedback: 'Yangi model maydonlari qo‘shilsa ular avtomatik ochilib qoladi — explicit fields har doim xavfsiz!',
      },
      {
        label: 'CORS_ALLOW_ALL_ORIGINS = True yoqish',
        isCorrect: false,
        feedback: 'CORS ni hamma saytga ochish xavfsizlikni yanada yomonlashtiradi.',
      },
    ],
    fixedLinePreview: '        fields = ["id", "email", "first_name"]\n        read_only_fields = ["id"]',
  },
  {
    id: 'bug-api-idor',
    scope: 'api',
    siteName: 'Paimon Sertifikat API',
    endpointOrFile: 'courses/views.py',
    symptomError: 'IDOR Vulnerability: Talaba #12 URL da /api/v1/certificates/99/ terib Talaba #45 ning chekini ko‘rdi!',
    scenario:
      'API ViewSet login qilgan foydalanuvchini tekshiryapti, lekin birovning hujjatini ko‘rishni to‘smayapti. Xato qaysi qatorda?',
    codeLines: [
      'class SertifikatViewSet(viewsets.ReadOnlyModelViewSet):',
      '    permission_classes = [IsAuthenticated]',
      '    serializer_class = SertifikatSerializer',
      '    queryset = Sertifikat.objects.all()',
      '    # GET /api/v1/certificates/99/ hamma uchun ochiq!',
    ],
    bugLineNumber: 4,
    fixChoices: [
      {
        label: 'get_queryset(self) da Sertifikat.objects.filter(talaba=self.request.user) qaytarish',
        isCorrect: true,
        feedback:
          '404 Not Found (boshqalar uchun) / 200 OK (egasi uchun) · IDOR himoyasi muvaffaqiyatli yoqildi!',
      },
      {
        label: 'permission_classes = [AllowAny] ga almashtirish',
        isCorrect: false,
        feedback: 'AllowAny hatto login qilmaganlarga ham ruxsat berib yuboradi!',
      },
      {
        label: 'queryset ni queryset.order_by("-id") qilish',
        isCorrect: false,
        feedback: 'Tartiblash IDOR muammosini to‘smaydi — ID=99 baribir ochiladi.',
      },
    ],
    fixedLinePreview: '    def get_queryset(self):\n        return Sertifikat.objects.filter(talaba=self.request.user)',
  },
  {
    id: 'bug-all-async-orm',
    scope: 'django',
    siteName: 'Paimon ASGI Server',
    endpointOrFile: 'courses/async_views.py',
    symptomError: 'django.core.exceptions.SynchronousOnlyOperation: You cannot call this from an async context',
    scenario:
      'Django ASGI (Uvicorn) da yozilgan yangi tezkor async view ishga tushganda darhol 500 xato qaytaryapti. Sababi nimada?',
    codeLines: [
      'async def kurs_detail_view(request, slug):',
      '    # Async funksiya ichida oddiy sinxron ORM:',
      '    kurs = Kurs.objects.get(slug=slug)',
      '    return JsonResponse({"nomi": kurs.sarlavha})',
    ],
    bugLineNumber: 3,
    fixChoices: [
      {
        label: 'await Kurs.objects.aget(slug=slug) (yoki sync_to_async) ishlatish',
        isCorrect: true,
        feedback:
          '200 OK · Django 4.1+ ning native async ORM metodi (aget) event loopni bloklamasdan ishladi!',
      },
      {
        label: 'async def so‘zidan "async" ni o‘chirib print() qo‘yish',
        isCorrect: false,
        feedback: 'Agar ASGI da yuqori concurrency kerak bo‘lsa, native aget() to‘g‘ri yechim.',
      },
      {
        label: 'DEBUG = False qilish',
        isCorrect: false,
        feedback: 'DEBUG=False xatoni yashiradi xolos, SynchronousOnlyOperation baribir 500 beradi.',
      },
    ],
    fixedLinePreview: '    kurs = await Kurs.objects.aget(slug=slug)',
  },
];

export const SEQUENCE_CHALLENGES: SequenceChallenge[] = [
  {
    id: 'seq-sql-exec',
    scope: 'django',
    title: 'PostgreSQL Mantiqiy Bajarilish Tartibi',
    description:
      'Biz SQL ni SELECT dan boshlab yozamiz, lekin PostgreSQL dvigateli uni boshqa tartibda bajaradi. Bosqichlarni to‘g‘ri ketma-ketlikda bosing!',
    stepsInOrder: [
      'FROM / JOIN (Jadvallarni birlashtirish)',
      'WHERE (Alohida qatorlarni filtrlash)',
      'GROUP BY (Qatorlarni guruhlash)',
      'HAVING (Guruhlangan natijani filtrlash)',
      'SELECT (Ustunlarni hisoblash)',
      'ORDER BY va LIMIT (Saralash va kesish)',
    ],
    explanation:
      'Shuning uchun WHERE ichida SELECT dagi alias ishlamaydi, ORDER BY da esa ishlaydi!',
  },
  {
    id: 'seq-drf-validation',
    scope: 'api',
    title: 'DRF Serializer 3-Bosqichli Validatsiya Tartibi',
    description:
      'serializer.is_valid(raise_exception=True) chaqirilganda tekshiruvlar qaysi aniq tartibda o‘tadi?',
    stepsInOrder: [
      '1. Field-level (tip, required, max_length va validators=[])',
      '2. validate_<maydon>(self, value) — yakka maydon mantiqi',
      '3. validate(self, attrs) — bir nechta maydonni o‘zaro tekshirish',
      '4. create() yoki update() — bazaga saqlash',
    ],
    explanation:
      'Maydon tipi xato bo‘lsa (masalan matn o‘rniga son kutilyapti), validate_<maydon> va validate() umuman chaqirilmaydi!',
  },
  {
    id: 'seq-dj-zero-downtime',
    scope: 'django',
    title: 'Zero-Downtime NOT NULL Ustun Qo‘shish Tartibi',
    description:
      'Million qatorli jadvalga saytni to‘xtatmasdan yangi majburiy (NOT NULL) ustun qo‘shish bosqichlarini tering:',
    stepsInOrder: [
      '1. Yangi ustunni null=True bilan qo‘shish (bloklamaydi)',
      '2. Kodni eski va yangi ustunga yozadigan qilib yangilash + eski qatorlarni batch backfill qilish',
      '3. CHECK (ustun IS NOT NULL) NOT VALID qo‘shib, keyin VALIDATE CONSTRAINT bajarish',
      '4. Nihoyat SET NOT NULL qo‘yish (0 ms blokirovka)',
    ],
    explanation:
      'Expand-Contract va NOT VALID tekshiruvi production jadvalini uzoq ACCESS EXCLUSIVE lock dan saqlaydi.',
  },
  {
    id: 'seq-py-try-flow',
    scope: 'python',
    title: 'Python Xato Boshqaruvi va Context Manager Oqimi',
    description:
      'with open(...) va try/except/else/finally ishlash ketma-ketligini to‘g‘ri joylashtiring:',
    stepsInOrder: [
      '1. __enter__() — fayl yoki resurs ochiladi',
      '2. try bloki — asosiy xavfli kod bajariladi',
      '3. except (xato bo‘lsa) YOKI else (xato bo‘lmasa)',
      '4. finally va __exit__() — resurs har qanday holatda yopiladi',
    ],
    explanation:
      'Hatto return qilinsa ham finally va Context Manager __exit__() har doim bajarilib, xotira va fayl deskriptorlarini yopadi.',
  },
  {
    id: 'seq-api-jwt-req',
    scope: 'api',
    title: 'Himoyalangan Django REST API So‘rov Zanjiri',
    description:
      'Mijoz Authorization: Bearer <JWT> bilan POST yuborganda so‘rov backendda qanday qatlamlardan o‘tadi?',
    stepsInOrder: [
      '1. Nginx SSL terminatsiyasi → Gunicorn WSGI/ASGI',
      '2. Django Middleware (Security → CORS → Common)',
      '3. DRF JWTAuthentication → Permission → ScopedRateThrottle',
      '4. Serializer.is_valid() → transaction.atomic() + on_commit()',
    ],
    explanation:
      'Authentication va Permission muvaffaqiyatli o‘tmaguncha View kodi va og‘ir SQL so‘rovlari umuman ishga tushmaydi!',
  },
];

// Fisher-Yates shuffle helper (returns new array)
export function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
