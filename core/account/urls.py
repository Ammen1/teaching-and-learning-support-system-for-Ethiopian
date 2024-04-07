from django.urls import path
from .views import *
from .views import UserLoginView, MyTokenObtainPairView
from django.contrib.auth.views import PasswordResetConfirmView
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('staff/add/', StaffAddView.as_view(), name='staff-add'),
    path('student/add/', StudentAddView.as_view(), name='student-add'),
    path('profile/update/<int:pk>/', ProfileUpdateView.as_view(), name='profile-update'),
    path('forgot-password/', EmailValidationOnForgotPasswordView.as_view(), name='forgot-password'),
    # path('api/account/reset-password/<uidb64>/<token>/', PasswordResetView.as_view(), name='password_reset_confirm'),
    path('reset-password/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('admin/login/', auth_views.LoginView.as_view(), name='login'),
    path('parent/add/', ParentAddView.as_view(), name='parent-add'),
    path('getusers/', UserListView.as_view(), name='getusers'),
]
