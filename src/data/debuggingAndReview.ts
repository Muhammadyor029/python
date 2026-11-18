export type DebugDomain = 'Python' | 'Django' | 'DRF' | 'PostgreSQL';

export interface DebugScenario {
  id: string;
  domain: DebugDomain;
  errorName: string;
  title: string;
  realisticScenario: string;
  errorMessage: string;
  stackTrace: string;
  diagnosticChoices: {
    label: string;
    isCorrect: boolean;
    hintFeedback: string;
  }[];
  rootCause: string;
  investigationSteps: string[];
  possibleSolutions: string[];
  bestSolution: string;
  prevention: string;
  practiceTask: {
    brokenCode: string;
    fixedCode: string;
    testCode: string;
  };
}

export const DEBUG_SCENARIOS: DebugScenario[] = [
  {
    id: 'dbg-py-recursion',
    domain: 'Python',
    errorName: 'RecursionError / KeyError',
    title: 'Katalog daraxtini aylanishda cheksiz rekursiya va yo‘q kalit',
    realisticScenario:
      'Kategoriyalar daraxtini (parent_id) rekursiv hisoblayotgan API endpoint birdaniga `500 Internal Server Error` bilan quladi.',
    errorMessage: 'RecursionError: maximum recursion depth exceeded',
    stackTrace: `Traceback (most recent call last):
  File "catalog/tree.py", line 14, in build_depth
    return 1 + build_depth(nodes, nodes[node_id]["parent"])
  File "catalog/tree.py", line 14, in build_depth
    return 1 + build_depth(nodes, nodes[node_id]["parent"])
  [Previous line repeated 996 more times]
RecursionError: maximum recursion depth exceeded`,
    diagnosticChoices: [
      {
        label: 'Bazada siklik bog‘lanish (A → B → A) bor va `visited` to‘plami bilan base case tekshirilmagan',
        isCorrect: true,
        hintFeedback: 'To‘g‘ri! Sikl (cycle) yoki base-case yo‘qligi funksiyani 1000 marta chaqirib yubordi.',
      },
      {
        label: 'Python RAM xotirasi 100% to‘lib qolgan (`MemoryError`)',
        isCorrect: false,
        hintFeedback: 'Stack trace aniq `maximum recursion depth exceeded` deb turibdi.',
      },
      {
        label: 'ImportError: catalog moduli topilmadi',
        isCorrect: false,
        hintFeedback: 'Fayl allaqachon ishga tushgan va 14-qatorda qotgan.',
      },
    ],
    rootCause:
      'Admin panelda kategoriya o‘zini-o‘zi yoki avlodini `parent` qilib belgilab qo‘ygan, kodda esa `visited` seti hamda iterativ sikl himoyasi yo‘q.',
    investigationSteps: [
      'Stack trace qatorini (`line 14`) tekshirish va kiruvchi `node_id` ma’lumotlarini log qilish.',
      'Model validatsiyasida `parent_id == self.id` taqiqlanganini tekshirish.',
    ],
    possibleSolutions: [
      '`sys.setrecursionlimit()` ni oshirish (YOMON — crashni kechiktiradi xolos!).',
      'Iterativ `while` + `visited: set` bilan siklni aniqlash.',
    ],
    bestSolution:
      'Iterativ `while` siklida `visited` set orqali siklni aniqlab `ValueError` chiqarish + Django `clean()` da `parent == self` ni taqiqlash.',
    prevention:
      'Graf/daraxt yurishlarida har doim `visited: set` saqlang va model `CheckConstraint` (`~Q(parent=F("id"))`) qo‘ying.',
    practiceTask: {
      brokenCode: `def get_depth(nodes: dict, node_id: int) -> int:
    parent = nodes[node_id]
    if parent is None:
        return 1
    return 1 + get_depth(nodes, parent)`,
      fixedCode: `def get_depth(nodes: dict, node_id: int) -> int:
    visited = set()
    depth = 0
    curr = node_id
    while curr is not None:
        if curr in visited:
            raise ValueError("Katalogda siklik bog'lanish aniqlandi!")
        visited.add(curr)
        depth += 1
        curr = nodes.get(curr)
    return depth`,
      testCode: `assert get_depth({1: None, 2: 1, 3: 2}, 3) == 3
try:
    get_depth({1: 2, 2: 1}, 1)
    assert False, "Siklik bog'lanishda ValueError chiqishi kerak"
except ValueError:
    pass`,
    },
  },
  {
    id: 'dbg-dj-integrity',
    domain: 'Django',
    errorName: 'IntegrityError / DoesNotExist',
    title: 'Django ro‘yxatdan o‘tishda dublikat email IntegrityError berishi',
    realisticScenario:
      'Ikki foydalanuvchi ayni millisekundda bir xil email bilan ro‘yxatdan o‘tishga urindi va ikkinchisida `500 IntegrityError` portladi.',
    errorMessage:
      'django.db.utils.IntegrityError: duplicate key value violates unique constraint "users_user_email_key"',
    stackTrace: `  File "accounts/views.py", line 27, in register
    user = User.objects.create_user(email=email, password=pwd)
  File "django/db/backends/postgresql/base.py", line 312, in _execute
IntegrityError: duplicate key value violates unique constraint`,
    diagnosticChoices: [
      {
        label: 'Faqat `if User.objects.filter(email=email).exists()` yetarli emas (Race Condition) — DB `IntegrityError` ushlanmagan',
        isCorrect: true,
        hintFeedback: 'Aniq! Ikki so‘rov bir vaqtda `exists() == False` o‘tib, bazaga urilganda `IntegrityError` chiqadi.',
      },
      {
        label: 'AppRegistryNotReady: Django settings yuklanmagan',
        isCorrect: false,
        hintFeedback: 'So‘rov viewgacha yetib borgan va PostgreSQL constraintidan xato qaytgan.',
      },
    ],
    rootCause:
      'Check-then-act (`exists()` keyin `create()`) poyga sharoiti (TOCTOU) ga uchraydi. PostgreSQL `UNIQUE` constraint himoya qildi, lekin kod `IntegrityError` ni tutib 400/409 JSON bermadi.',
    investigationSteps: [
      'PostgreSQL constraint nomini (`users_user_email_key`) o‘qish.',
      'View va Serializer’da `try ... except IntegrityError` bor-yo‘qligini tekshirish.',
    ],
    possibleSolutions: [
      'DB dan `unique=True` ni olib tashlash (HALOKATLI — dublikatlar ko‘payadi!).',
      '`transaction.atomic()` ichida `IntegrityError` ni ushlab chiroyli 409 Conflict qaytarish.',
    ],
    bestSolution:
      'Serializerda `UniqueValidator` + View/Service qatlamida `try ... except IntegrityError` orqali 409 Conflict qaytarish.',
    prevention:
      'Har doim DB darajasida `unique=True` saqlang va yozish amallarida `IntegrityError` ni biznes-xatoga aylantiring.',
    practiceTask: {
      brokenCode: `def create_account(existing_emails: set, email: str) -> dict:
    # Simulation: poygada IntegrityError tushsa 500 qulab tushadi
    if email in existing_emails:
        raise RuntimeError("IntegrityError: duplicate key")
    existing_emails.add(email)
    return {"status": 201, "email": email}`,
      fixedCode: `def create_account(existing_emails: set, email: str) -> dict:
    if email in existing_emails:
        return {"status": 409, "error": "Bu email allaqachon band"}
    existing_emails.add(email)
    return {"status": 201, "email": email}`,
      testCode: `emails = {"ali@paimon.uz"}
assert create_account(emails, "ali@paimon.uz")["status"] == 409
assert create_account(emails, "yangi@paimon.uz")["status"] == 201`,
    },
  },
  {
    id: 'dbg-drf-validation',
    domain: 'DRF',
    errorName: 'ValidationError / PermissionDenied',
    title: 'DRF API’da `serializer.data` ni `is_valid()` dan oldin chaqirish',
    realisticScenario:
      'Buyurtma yaratish POST endpointi har safar `AssertionError: You must call .is_valid() before accessing .validated_data` berib to‘xtab qolmoqda.',
    errorMessage:
      'AssertionError: Cannot access .validated_data before calling .is_valid()',
    stackTrace: `  File "orders/views.py", line 18, in post
    order = serializer.save(user=request.user)
AssertionError: You must call .is_valid() before calling .save()`,
    diagnosticChoices: [
      {
        label: '`serializer.is_valid(raise_exception=True)` chaqirilmasdan `.save()` / `.validated_data` ishlatilgan',
        isCorrect: true,
        hintFeedback: 'To‘g‘ri! DRF da validatsiya qilinmagan ma’lumotni bazaga saqlash qat’iy bloklanadi.',
      },
      {
        label: 'JWT token muddati tugagan (`AuthenticationFailed`)',
        isCorrect: false,
        hintFeedback: 'So‘rov view’ning `post()` metodiga kirib bo‘lgan.',
      },
    ],
    rootCause:
      'Dasturchi `serializer = OrderSerializer(data=request.data)` yaratib, to‘g‘ridan-to‘g‘ri `.save()` chaqirgan.',
    investigationSteps: [
      '`views.py` 18-qatorda `is_valid(raise_exception=True)` borligini tekshirish.',
    ],
    possibleSolutions: [
      '`if serializer.is_valid(): ... else: return Response(serializer.errors, 400)`',
      '`serializer.is_valid(raise_exception=True)` (eng toza va qisqa DRF usuli!).',
    ],
    bestSolution:
      '`serializer.is_valid(raise_exception=True)` ishlatish — xato bo‘lsa DRF avtomatik 400 Bad Request va maydon xatolarini JSONda qaytaradi.',
    prevention:
      'GenericAPIView (`CreateModelMixin`) yoki doim `is_valid(raise_exception=True)` shablonidan foydalaning.',
    practiceTask: {
      brokenCode: `def process_drf_post(payload: dict) -> dict:
    # TODO: Avval validatsiya qiling (amount > 0), bo'lmasa 400 qaytaring
    return {"status": 201, "saved": payload}`,
      fixedCode: `def process_drf_post(payload: dict) -> dict:
    amount = payload.get("amount", 0)
    if not isinstance(amount, (int, float)) or amount <= 0:
        return {"status": 400, "errors": {"amount": ["0 dan katta bo'lishi kerak"]}}
    return {"status": 201, "saved": {"amount": amount}}`,
      testCode: `assert process_drf_post({"amount": -10})["status"] == 400
assert process_drf_post({"amount": 50})["status"] == 201`,
    },
  },
  {
    id: 'dbg-pg-deadlock',
    domain: 'PostgreSQL',
    errorName: 'DeadlockDetected / LockTimeout',
    title: 'Ikki tranzaksiya o‘zaro bir-birini kutib Deadlockga tushishi',
    realisticScenario:
      'Katta chegirma paytida A→B va B→A hamyon o‘tkazmalari bir vaqtda ishlab, PostgreSQL `40P01: deadlock detected` xatosini otmoqda.',
    errorMessage:
      'psycopg.errors.DeadlockDetected: deadlock detected DETAIL: Process 412 waits for ShareLock on transaction 891',
    stackTrace: `  File "wallet/transfer.py", line 12, in transfer
    from_acc.save(); to_acc.save()
OperationalError: deadlock detected`,
    diagnosticChoices: [
      {
        label: 'Qatorlar (`from_id`, `to_id`) turlicha tartibda qulflangan — doim `ORDER BY id ASC` tartibida qulflash kerak',
        isCorrect: true,
        hintFeedback: 'Mutlaqo to‘g‘ri! 1-tranzaksiya (10 → 20), 2-tranzaksiya (20 → 10) tartibda qulflasa aylanma kutish yuz beradi.',
      },
      {
        label: 'UndefinedTable: hisoblar jadvali o‘chib ketgan',
        isCorrect: false,
        hintFeedback: 'Jadval mavjud, ikki jarayon Lock ustida to‘qnashgan.',
      },
    ],
    rootCause:
      'Tranzaksiya-1 avval 10-hisobni qulflab 20-ni kutmoqda; Tranzaksiya-2 esa avval 20-ni qulflab 10-ni kutmoqda.',
    investigationSteps: [
      'PostgreSQL `pg_stat_activity` va `pg_locks` dan kutayotgan PIDlarni ko‘rish.',
    ],
    possibleSolutions: [
      'Har doim `sorted([from_id, to_id])` tartibida `select_for_update()` olish.',
    ],
    bestSolution:
      'Kanoniq tartib (`order_by("id")` + `select_for_update()`) va `lock_timeout` belgilash.',
    prevention:
      'Ko‘p qatorli `UPDATE`/`FOR UPDATE` amallarida doim ID o‘sish tartibiga amal qiling.',
    practiceTask: {
      brokenCode: `def lock_order(from_id: int, to_id: int) -> list[int]:
    return [from_id, to_id]`,
      fixedCode: `def lock_order(from_id: int, to_id: int) -> list[int]:
    return sorted([from_id, to_id])`,
      testCode: `assert lock_order(10, 20) == [10, 20] and lock_order(20, 10) == [10, 20]`,
    },
  },
];

export interface CodeReviewCase {
  id: string;
  title: string;
  prSummary: string;
  badCode: string;
  expectedIssues: {
    id: string;
    category: string;
    label: string;
    isPresent: boolean;
    reason: string;
  }[];
  cleanCode: string;
}

export const CODE_REVIEW_CASES: CodeReviewCase[] = [
  {
    id: 'cr-order-view',
    title: 'PR #142 — Buyurtma ro‘yxati va yaratish ViewSet’i',
    prSummary: 'Yangi dasturchi yozgan kodni tekshiring va ichidagi muammolarni toping.',
    badCode: `class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

def get_orders(req):
    d = Order.objects.all()
    res = []
    for x in d:
        res.append({"id": x.id, "user": x.user.email, "sum": x.total})
    return JsonResponse(res, safe=False)`,
    expectedIssues: [
      {
        id: 'mass-assign',
        category: 'Security Issue',
        label: 'fields = "__all__" (Mass Assignment xavfi)',
        isPresent: true,
        reason: 'Foydalanuvchi `is_paid=True` yoki `total=0` yuborib buyurtmani tekinga o‘zgartira oladi.',
      },
      {
        id: 'n-plus-1',
        category: 'N+1 Query',
        label: 'x.user.email siklda N+1 SQL so‘rov chiqaradi',
        isPresent: true,
        reason: '`select_related("user")` qo‘yilmagan, 100 ta buyurtmada 101 ta SQL uriladi.',
      },
      {
        id: 'naming',
        category: 'Naming Problem',
        label: 'd, x, res kabi tushunarsiz qisqa nomlar',
        isPresent: true,
        reason: 'O‘zgaruvchi nomlari nima saqlayotganini anglatishi shart (`orders`, `order`).',
      },
      {
        id: 'idor',
        category: 'Security Issue',
        label: 'IDOR: barcha foydalanuvchilarning buyurtmalari filtrsiz qaytyapti',
        isPresent: true,
        reason: '`Order.objects.filter(user=req.user)` va pagination qo‘yilmagan!',
      },
    ],
    cleanCode: `class OrderSerializer(ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user_email", "total", "status"]
        read_only_fields = ["id", "total", "status"]

class OrderListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    pagination_class = CursorPagination

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related("user")`,
  },
  {
    id: 'cr-payment-service',
    title: 'PR #189 — To‘lovni tasdiqlash va Email yuborish servisi',
    prSummary: 'To‘lov funksiyasidagi arxitektura va xatolik ushlash muammolarini belgilang.',
    badCode: `def confirm_payment(order_id, amount):
    try:
        o = Order.objects.get(id=order_id)
        o.balance = o.balance + float(amount)
        o.save()
        send_heavy_smtp_email(o.user.email)
        return True
    except:
        return False`,
    expectedIssues: [
      {
        id: 'bare-except',
        category: 'Exception Handling',
        label: 'Bare `except:` barcha tizim xatolarini yutib yubormoqda',
        isPresent: true,
        reason: 'Baza uzilishi ham, sintaksis xatosi ham jim yutiladi. Aniq `Order.DoesNotExist` ushlash va log yozish kerak.',
      },
      {
        id: 'float-money',
        category: 'Poor Validation / Precision',
        label: 'Pulda `float()` ishlatilgan va race condition (`F()`) yo‘q',
        isPresent: true,
        reason: 'Pulda `Decimal` va `transaction.atomic()` + `F("balance")` shart.',
      },
      {
        id: 'blocking-io',
        category: 'Performance & Coupling',
        label: 'SMTP email tranzaksiyani va HTTP javobni bloklamoqda',
        isPresent: true,
        reason: '`transaction.on_commit(lambda: send_email_task.delay(o.id))` ishlatish shart.',
      },
    ],
    cleanCode: `def confirm_payment(order_id: int, amount: Decimal) -> Order:
    with transaction.atomic():
        order = Order.objects.select_for_update().get(id=order_id)
        order.balance = F("balance") + Decimal(amount)
        order.save(update_fields=["balance"])
        transaction.on_commit(lambda: send_receipt_task.delay(order.id))
    return order`,
  },
];

export interface IncidentStep {
  id: string;
  command: string;
  output: string;
  clue: string;
}

export interface ProductionIncident {
  id: string;
  title: string;
  severity: 'P1 CRITICAL' | 'P2 HIGH';
  symptom: string;
  initialLatencyMs: number;
  targetLatencyMs: number;
  steps: IncidentStep[];
  fixOptions: {
    id: string;
    label: string;
    isCorrect: boolean;
    resultingMs: number;
    explanation: string;
  }[];
}

export const PRODUCTION_INCIDENTS: ProductionIncident[] = [
  {
    id: 'inc-5sec-api',
    title: 'PAIMON API javob vaqti 200 ms dan 5,100 ms ga oshdi!',
    severity: 'P1 CRITICAL',
    symptom:
      'Foydalanuvchilar `/api/v1/lessons/` sahifasini ochganda 5 soniyadan ortiq kutib qolyapti. CPU 30%, lekin PostgreSQL I/O 95% ga chiqqan.',
    initialLatencyMs: 5100,
    targetLatencyMs: 28,
    steps: [
      {
        id: 'logs',
        command: 'docker compose logs --tail=20 django_web',
        output:
          '[WARNING] Slow request GET /api/v1/lessons/ 5112ms | queries=342 | cache=MISS',
        clue: 'Bitta HTTP so‘rovda 342 ta SQL ketmoqda va kesh ishlamayapti!',
      },
      {
        id: 'explain',
        command: 'EXPLAIN ANALYZE SELECT * FROM lessons WHERE domain = \'django\' ORDER BY created_at DESC;',
        output:
          'Seq Scan on lessons (cost=0.00..18420.00 rows=120000) Execution Time: 412.8 ms',
        clue: '`lessons(domain, created_at)` ustunida indeks yo‘q — Seq Scan ketyapti.',
      },
    ],
    fixOptions: [
      {
        id: 'add-workers-only',
        label: 'Faqat Gunicorn worker sonini 4 dan 32 ga oshirish',
        isCorrect: false,
        resultingMs: 4950,
        explanation: 'Worker ko‘paytirish 342 ta SQL va Seq Scan muammosini hal qilmaydi — aksincha DBni butunlay cho‘ktiradi!',
      },
      {
        id: 'orm-index-redis',
        label: '1) select_related/prefetch_related (342 → 2 SQL) + 2) Composite Index + 3) Redis Cache (60s)',
        isCorrect: true,
        resultingMs: 24,
        explanation: 'Ajoyib! N+1 bartaraf etildi, Index Scan 0.4ms ga tushdi va Redis Cache Hit bilan API 24 ms da javob bera boshladi!',
      },
    ],
  },
  {
    id: 'inc-port-env',
    title: 'Docker Deployda `django_web` konteyneri qayta-qayta o‘chyapti',
    severity: 'P2 HIGH',
    symptom:
      'Production deploydan keyin Nginx `502 Bad Gateway` bermoqda. Konteyner `CrashLoopBackOff` holatida.',
    initialLatencyMs: 0,
    targetLatencyMs: 18,
    steps: [
      {
        id: 'ps',
        command: 'docker compose ps && docker compose logs django_web --tail=5',
        output:
          'django.core.exceptions.ImproperlyConfigured: Set the SECRET_KEY environment variable | OperationalError: could not translate host name "localhost"',
        clue: '1) `.env` da `SECRET_KEY` berilmagan; 2) Konteyner ichida Postgres host `localhost` emas, servis nomi (`postgres`) bo‘lishi shart!',
      },
    ],
    fixOptions: [
      {
        id: 'hardcode-secret',
        label: 'settings.py ga SECRET_KEY va localhost ni qo‘lda yozib qo‘yish',
        isCorrect: false,
        resultingMs: 0,
        explanation: 'Xavfli va noto‘g‘ri: konteyner ichida `localhost` konteynerning o‘ziga qaraydi, Postgres konteyneriga emas!',
      },
      {
        id: 'env-service-name',
        label: '`.env` orqali SECRET_KEY berish + DATABASE_HOST=postgres (Docker tarmoq nomi) + `/healthz` tekshiruvi',
        isCorrect: true,
        resultingMs: 18,
        explanation: 'To‘g‘ri! Docker Compose bridge tarmog‘ida servislar bir-birini xizmat nomi (`postgres`, `redis`) orqali topadi.',
      },
    ],
  },
];
