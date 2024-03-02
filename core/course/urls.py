
from django.urls import path
from .views import ProgramAPIView, ProgramDetailView

urlpatterns = [
    path('program/add/', ProgramAPIView.as_view()),
    path('program/<int:pk>/', ProgramDetailView.as_view()),

]
