from rest_framework import serializers
from .models import User, Student, Parent, GENDERS, LEVEL, RELATION_SHIP
from course.models import Program

class StaffAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'address', 'phone', 'email')
    
    def create(self, validated_data):
        user = User.objects.create_lecturer(**validated_data)
        return user

class StudentAddSerializer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=LEVEL)
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    gender = serializers.ChoiceField(choices=GENDERS)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'gender', 'address', 'phone', 'email', 'level', 'program')

    def create(self, validated_data):
        user = User.objects.create_student(**validated_data)
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'gender', 'email', 'phone', 'address', 'picture')

class ParentAddSerializer(serializers.ModelSerializer):
    relation_ship = serializers.ChoiceField(choices=RELATION_SHIP)
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'address', 'phone', 'email', 'username', 'password', 'student', 'relation_ship')

    def create(self, validated_data):
        user = User.objects.create_parent(**validated_data)
        return user
