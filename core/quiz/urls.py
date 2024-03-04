from django.urls import path
from .views import *

urlpatterns = [
    path('<slug:slug>/quiz/create/', QuizCreateAPIView.as_view(), name='quiz-create'),
    path('quizzes/<int:pk>/', QuizUpdateAPIView.as_view(), name='quiz-update-api'),
    path('quizzes/<int:pk>/delete/', QuizDeleteAPIView.as_view(), name='quiz-delete-api'),
    path('mc-questions/create/', MCQuestionCreateAPIView.as_view(), name='mc-question-create-api'),
    path('choices/create/', ChoiceCreateAPIView.as_view(), name='choice-create-api'),
]
