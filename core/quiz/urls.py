from django.urls import path
from .views import *

urlpatterns = [
    path('example/', ResultListAPIView.as_view(), name='example'),
    # Add your URL patterns here
]
