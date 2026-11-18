from django.contrib import admin
from django.urls import include, path

from academy.views import spa_index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("academy.urls")),
    path("", spa_index, name="spa"),
]
