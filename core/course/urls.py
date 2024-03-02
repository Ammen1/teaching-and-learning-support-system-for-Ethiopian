
from django.urls import path
from .views import *

urlpatterns = [
    path('program/add/', ProgramAPIView.as_view(), name='program_add'),
    path('program/<int:pk>/', ProgramDetailView.as_view(), name='program_edit'),
    path('program/<int:pk>/edit/', ProgramEditView.as_view(), name='program_edit_api'),
    path('program/delete/<int:pk>/', ProgramDeleteView.as_view(), name='program_delete_api'),
    path('course/single/<slug:slug>/', CourseSingleAPIView.as_view(), name='course_single_api')

]
