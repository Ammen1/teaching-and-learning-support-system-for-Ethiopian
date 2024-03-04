from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .models import Course, Quiz
from .serializers import QuizSerializer
from django.shortcuts import get_object_or_404

class QuizCreateAPIView(CreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer

    def get_queryset(self):
        course = get_object_or_404(Course, slug=self.kwargs["slug"])
        return Quiz.objects.filter(course=course)

    def perform_create(self, serializer):
        course = get_object_or_404(Course, slug=self.kwargs["slug"])
        serializer.save(course=course)
