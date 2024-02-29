from django.urls import path
from .views import StaffAddView, StudentAddView, EmailValidationOnForgotPasswordView, ParentAddView, ProfileUpdateView

app_name = 'account' 

urlpatterns = [
    path('staff/add/', StaffAddView.as_view(), name='staff-add'),
    path('student/add/', StudentAddView.as_view(), name='student-add'),
    path('profile/update/<int:pk>/', ProfileUpdateView.as_view(), name='profile-update'),
    path('forgot-password/', EmailValidationOnForgotPasswordView.as_view(), name='forgot-password'),
    path('parent/add/', ParentAddView.as_view(), name='parent-add'),
]
