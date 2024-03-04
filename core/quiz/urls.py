from django.urls import path
from .views import *

urlpatterns = [
    path('<slug:slug>/quiz/create/', QuizCreateAPIView.as_view(), name='quiz-create'),
]
