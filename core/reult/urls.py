from django.urls import path
from .views import *

app_name = 'results'

urlpatterns = [
    path('add-score/', AddScoreAPIView.as_view(), name='add_score_api'),
    path('add_score_for/<int:id>/', AddScoreForAPIView.as_view(), name='add_score_for_api'),
    path('grade_result/', GradeResultAPIView.as_view(), name='grade_result_api'),
]
