from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .models import Course, Quiz, MCQuestion, Choice
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework import generics, status

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


class QuizUpdateAPIView(generics.UpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]  # Adjust as needed

    def perform_update(self, serializer):
        serializer.save()

    def get_object(self):
        quiz_id = self.kwargs['pk']
        return Quiz.objects.get(pk=quiz_id)

class QuizDeleteAPIView(generics.DestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]  # Adjust as needed

    def destroy(self, request, *args, **kwargs):
        quiz = self.get_object()
        quiz.delete()
        return Response({'detail': 'Successfully deleted.'}, status=status.HTTP_204_NO_CONTENT)
    
    
class MCQuestionCreateAPIView(generics.CreateAPIView):
    queryset = MCQuestion.objects.all()
    serializer_class = MCQuestionSerializer
    permission_classes = [IsAuthenticated]  # Adjust as needed

    def perform_create(self, serializer):
        # Set the quiz field based on the URL parameter
        quiz_id = self.kwargs.get('quiz_id')
        serializer.save(quiz_id=quiz_id)

class ChoiceCreateAPIView(generics.CreateAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [IsAuthenticated]  # Adjust as needed

    