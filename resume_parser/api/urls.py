from django.urls import path
from .views import parse_resume

urlpatterns = [
    path('parse-resume/', parse_resume),
]
