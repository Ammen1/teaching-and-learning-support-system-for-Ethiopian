from rest_framework import serializers
from .models import Question, Quiz, MCQuestion, Choice
from django.utils.translation import gettext_lazy as _

class ChoiceSerializer(serializers.Serializer):
    choice = serializers.CharField()
    correct = serializers.BooleanField()

class MCQuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = MCQuestion
        exclude = ()

class EssaySerializer(serializers.Serializer):
    answers = serializers.CharField(style={'base_template': 'textarea.html'})

class QuestionSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.CharField(), required=False
    )  # Assuming answers is a list of strings

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        exclude = []

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = super(QuizSerializer, self).create(validated_data)

        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = Question.objects.create(quiz=quiz, **question_data)
            question.answers.set(answers_data)

        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        instance = super(QuizSerializer, self).update(instance, validated_data)

        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = instance.question_set.create(**question_data)
            question.answers.set(answers_data)

        return instance
