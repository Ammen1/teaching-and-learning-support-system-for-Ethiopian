from django.urls import path
from .views import semester_add_view ,session_list_view, session_add_view



urlpatterns = [
    path('semester/add/', semester_add_view, name='semester_add_api'),
    path('session/list/', session_list_view, name='session_list'),
    path('session/add/', session_add_view, name='session_add'),
    
    
    ]
