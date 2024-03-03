from django.urls import path
from .views import *

app_name = 'results'

urlpatterns = [
    path('add-score/', AddScoreAPIView.as_view(), name='add_score_api'),
    # Add other URL patterns as needed
]
