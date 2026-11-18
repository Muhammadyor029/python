export type BackendCardId =
  | 'python'
  | 'postgres'
  | 'django'
  | 'auth'
  | 'celery'
  | 'deploy';

export interface BackendCardSpec {
  id: BackendCardId;
  moduleTag: string;
  labelUz: string;
  metricStart: number;
  metricEnd: number;
  metricUnit: string;
  fileUrl: string;
  code: string;
}

const assetBase = import.meta.env.BASE_URL;

export const BACKEND_ASSETS = {
  terminal: `${assetBase}src/assets/images/backend_python_terminal_1794930505576.jpg`,
  vault: `${assetBase}src/assets/images/backend_database_vault_1794930505890.jpg`,
  pipeline: `${assetBase}src/assets/images/backend_celery_pipeline_1794930506788.jpg`,
  deploy: `${assetBase}src/assets/images/backend_cloud_deploy_1794930507343.jpg`,
} as const;

export const BACKEND_CARDS: BackendCardSpec[] = [
  {
    id: 'python',
    moduleTag: '1-modul · Python',
    labelUz: 'Python 0 dan',
    metricStart: 0,
    metricEnd: 142,
    metricUnit: 'qator kod',
    fileUrl: 'main.py',
    code: [
      '# 01-dars: print("Salom, Dunyo!")',
      'ism = "Amir"',
      'kun = 1',
      '',
      'def salom_ber(foydalanuvchi: str) -> str:',
      '    return f"Salom, {foydalanuvchi}! Backendga xush kelibsiz."',
      '',
      'class Talaba:',
      '    def __init__(self, ism: str, daraja: int):',
      '        self.ism = ism',
      '        self.daraja = daraja',
      '',
      'print("Salom, Dunyo!")',
      'print(salom_ber(ism))',
    ].join('\n'),
  },
  {
    id: 'postgres',
    moduleTag: '2-modul · PostgreSQL',
    labelUz: 'PostgreSQL & ORM',
    metricStart: 0,
    metricEnd: 94,
    metricUnit: '% tezkor',
    fileUrl: 'models.py',
    code: [
      '# 02-dars: PostgreSQL jadvallar va ORM',
      'from django.db import models',
      '',
      'class Mijoz(models.Model):',
      '    ism = models.CharField(max_length=120)',
      '    email = models.EmailField(unique=True)',
      '',
      'class Buyurtma(models.Model):',
      '    mijoz = models.ForeignKey(Mijoz, on_delete=models.CASCADE)',
      '    summa = models.DecimalField(max_digits=10, decimal_places=2)',
      '    yaratildi = models.DateTimeField(auto_now_add=True)',
      '',
      '# Indeks va JOIN orqali N+1 muammosisiz so‘rov:',
      'qs = Buyurtma.objects.select_related("mijoz").filter(summa__gt=0)',
    ].join('\n'),
  },
  {
    id: 'django',
    moduleTag: '3-modul · Django API',
    labelUz: 'Django & DRF',
    metricStart: 0,
    metricEnd: 12,
    metricUnit: 'ms javob',
    fileUrl: 'views.py',
    code: [
      '# 03-dars: Django REST API endpoint',
      'from rest_framework.decorators import api_view',
      'from rest_framework.response import Response',
      'from .models import Mahsulot',
      '',
      '@api_view(["GET", "POST"])',
      'def mahsulotlar(request):',
      '    if request.method == "GET":',
      '        royxat = Mahsulot.objects.values("id", "nomi", "narx")',
      '        return Response(list(royxat), status=200)',
      '',
      '    yangi = Mahsulot.objects.create(**request.data)',
      '    return Response({"id": yangi.id, "holat": "Saqlandi"}, status=201)',
    ].join('\n'),
  },
  {
    id: 'auth',
    moduleTag: '4-modul · Xavfsizlik',
    labelUz: 'Auth & JWT',
    metricStart: 0,
    metricEnd: 256,
    metricUnit: 'bit shifr',
    fileUrl: 'auth.py',
    code: [
      '# 04-dars: Parol xeshlash va JWT himoyasi',
      'from django.contrib.auth.hashers import make_password',
      'from rest_framework.permissions import IsAuthenticated',
      'from rest_framework.views import APIView',
      '',
      '# Parol bazaga hech qachon ochiq yozilmaydi:',
      'xesh_parol = make_password("maxfiy_kalit_2026")',
      '',
      'class ShaxsiyKabinetAPI(APIView):',
      '    permission_classes = [IsAuthenticated]',
      '    def get(self, request):',
      '        return Response({"foydalanuvchi": request.user.username})',
    ].join('\n'),
  },
  {
    id: 'celery',
    moduleTag: '5-modul · Celery',
    labelUz: 'Redis & Celery',
    metricStart: 0,
    metricEnd: 4180,
    metricUnit: 'ms tejaldi',
    fileUrl: 'tasks.py',
    code: [
      '# 05-dars: Celery + Redis fon vazifalari',
      'from celery import shared_task',
      'from django.core.mail import send_mail',
      '',
      '@shared_task(bind=True, max_retries=3)',
      'def chek_yuborish(self, email: str, buyurtma_id: int):',
      '    try:',
      '        send_mail("Tasdiqlandi", f"Buyurtma #{buyurtma_id}", None, [email])',
      '    except Exception as xato:',
      '        raise self.retry(exc=xato, countdown=30)',
      '',
      '# Foydalanuvchi kutmaydi — vazifa navbatga tushadi:',
      'chek_yuborish.delay("ali@misol.uz", 4092)',
    ].join('\n'),
  },
  {
    id: 'deploy',
    moduleTag: '6-modul · Deploy',
    labelUz: 'Docker & Nginx',
    metricStart: 0,
    metricEnd: 99,
    metricUnit: '% barqaror',
    fileUrl: 'docker-compose.yml',
    code: [
      '# 06-dars: Production server tuzilmasi',
      'services:',
      '  django_web:',
      '    build: .',
      '    command: gunicorn core.wsgi:application --workers 4',
      '  postgres:',
      '    image: postgres:16-alpine',
      '  redis:',
      '    image: redis:7-alpine',
      '  celery_worker:',
      '    build: .',
      '    command: celery -A core worker -l info',
      '  nginx:',
      '    image: nginx:alpine',
    ].join('\n'),
  },
];
