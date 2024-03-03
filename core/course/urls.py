
from django.urls import path
from .views import *

urlpatterns = [
    path('program/add/', ProgramAPIView.as_view(), name='program_add'),
    path('program/<int:pk>/', ProgramDetailView.as_view(), name='program_edit'),
    path('program/<int:pk>/edit/', ProgramEditView.as_view(), name='program_edit_api'),
    path('program/delete/<int:pk>/', ProgramDeleteView.as_view(), name='program_delete_api'),
    path('course/single/<slug:slug>/', CourseSingleAPIView.as_view(), name='course_single_api'),
    path('course/add/', CourseAddAPIView.as_view(), name='course_add_api'),
    path('course/edit/<slug:slug>/', CourseEditAPIView.as_view(), name='course_edit_api'),
    path('course/delete/<slug:slug>/', CourseDeleteAPIView.as_view(), name='course_delete_api'),
    path('course/allocations/', CourseAllocationAPIView.as_view(), name='course_allocation_api'),
    path('course/allocated/edit/<int:pk>/', EditAllocatedCourseAPIView.as_view(), name='edit_allocated_course_api'),
    path('course/allocated/deallocate/<int:pk>/', DeallocateCourseAPIView.as_view(), name='deallocate_course_api'),
     path('course/course/allocations/', CourseAllocationFilterAPIView.as_view(), name='course_allocation_api'),

]
