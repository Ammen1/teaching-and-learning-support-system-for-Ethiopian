from rest_framework import serializers
from .models import TakenCourse, Result

class TakenCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TakenCourse
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
