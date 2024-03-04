from rest_framework import serializers
from .models import Question, Quiz, MCQuestion, Choice

class QuestionSerializer(serializers.Serializer):
    answers = serializers.ChoiceField()

class EssaySerializer(serializers.Serializer):
    answers = serializers.CharField()

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['choice', 'correct']

class MCQuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = MCQuestion
        fields = '__all__'

class QuizAddSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all().select_subclasses(),
        many=True,
        required=False
    )

    class Meta:
        model = Quiz
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = super().create(validated_data)
        quiz.question_set.set(questions_data)
        return quiz

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = '__all__'
