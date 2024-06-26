from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from course.models import Program
from .models import Student, Parent, RELATION_SHIP, LEVEL, GENDERS
from datetime import datetime
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .models import DepartmentHead

User = get_user_model()


class UserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'is_student', 'is_lecturer', 'is_parent', 'is_dep_head', 'gender', 'phone', 'address', 'picture')


class UserSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    lecturer_count = serializers.SerializerMethodField()
    superuser_count = serializers.SerializerMethodField()
    totalusers = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user_role'] = instance.get_user_role
        representation['picture_url'] = instance.get_picture()
        return representation
    
    def get_totalusers(self, instance):
        return instance.get_totalusers()
    
    def get_student_count(self, instance):
        return instance.get_student_count()

    def get_lecturer_count(self, instance):
        return instance.get_lecturer_count()

    def get_superuser_count(self, instance):
        return instance.get_superuser_count()


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'

class DepartmentHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentHead
        fields = '__all__'

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class StaffAddSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    address = serializers.CharField(max_length=30)
    phone = serializers.CharField(max_length=30)
    email = serializers.CharField(max_length=30)

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create(
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                address=validated_data['address'],
                phone=validated_data['phone'],
                email=validated_data['email'],
                is_lecturer=True
            )

            registration_date = datetime.now().strftime("%Y")
            total_lecturers_count = User.objects.filter(is_lecturer=True).count()
            generated_username = (
                f"{settings.LECTURER_ID_PREFIX}-{registration_date}-{total_lecturers_count}"
            )
            generated_password = User.objects.make_random_password()

            user.username = generated_username
            user.set_password(generated_password)
            user.save()

            send_mail(
                "Your account credentials",
                f"Your username: {generated_username}\nYour password: {generated_password}",
                "e-learning@gooderash.com",  # Use the e-learning account to send emails
                [user.email],
                fail_silently=False,
            )

            return user



class StudentAddSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    gender = serializers.ChoiceField(choices=GENDERS)
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)

    def create(self, validated_data):
        with transaction.atomic():
            # Create User instance
            user = User.objects.create(
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                gender=validated_data['gender'],
                phone=validated_data['phone'],
                email=validated_data['email'],
                is_student=True
            )

            # Generate student ID
            registration_date = datetime.now().strftime("%Y")
            total_students_count = Student.objects.count()
            generated_username = (
                f"{settings.STUDENT_ID_PREFIX}-{registration_date}-{total_students_count}"
            )

            # Generate a password
            generated_password = User.objects.make_random_password()

            # Set username, password, and save User
            user.username = generated_username
            user.set_password(generated_password)
            user.save()

            # Create Student instance associated with User
            student = Student.objects.create(
                student=user,
                level=validated_data.get('level', None),
                program=validated_data['program']
            )

            # Send email with generated credentials
            send_mail(
                "Your account credentials",
                f"Your ID: {generated_username}\nYour password: {generated_password}",
                settings.EMAIL_FROM_ADDRESS,
                [user.email],
                fail_silently=False,
            )

            return user


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    gender = serializers.ChoiceField(choices=GENDERS)
    email = serializers.EmailField()
    phone = serializers.CharField()
    address = serializers.CharField()

    def update(self, instance, validated_data):
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.gender = validated_data['gender']
        instance.email = validated_data['email']
        instance.phone = validated_data['phone']
        instance.address = validated_data['address']
        instance.save()
        return instance


class EmailValidationOnForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email__iexact=value, is_active=True).exists():
            raise serializers.ValidationError("There is no active user registered with the specified E-mail address.")
        return value

    def create(self, validated_data):
        validated_email = validated_data['email']
        user = User.objects.get(email__iexact=validated_email)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        user.password_reset_token = token
        user.save()

        frontend_url = "http://localhost:5173/dashboard?tab=addstudents/"  # Adjust the frontend URL

        reset_link = f"{frontend_url}{uid}/{token}/"
        send_mail(
            "Password Reset",
            f"Click the following link to reset your password: {reset_link}",
            settings.EMAIL_FROM_ADDRESS,
            [user.email],
            fail_silently=False,
        )

        return {"message": "Reset link sent to the provided email address."}


class ParentAddSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    address = serializers.CharField(max_length=30)
    phone = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    relation_ship = serializers.ChoiceField(choices=RELATION_SHIP)

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create(
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                address=validated_data['address'],
                phone=validated_data['phone'],
                email=validated_data['email'],
                is_parent=True
            )

            parent = Parent.objects.create(
                user=user,
                student=validated_data['student'],
                relation_ship=validated_data['relation_ship']
            )

        return user
