from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='user-registration'),
    path('generate-otp/', views.GenerateOTP.as_view(), name='generate_otp'),
    path('verify-otp/', views.VerifyOTP.as_view(), name='verify_otp'),
   
]
