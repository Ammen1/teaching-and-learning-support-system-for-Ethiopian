from rest_framework import generics
from rest_framework.response import Response
from .models import User, Parent
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers, status
from course.models import Program
from .serializers import StaffAddSerializer, StudentAddSerializer, ProfileUpdateSerializer, EmailValidationOnForgotPasswordSerializer, ParentAddSerializer
from django.db import transaction

from rest_framework.views import APIView


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserLoginSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.get_user_role()
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]  # Allow any user to obtain a token

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        response_data = {
            'access_token': str(serializer.validated_data['access']),
            'refresh_token': str(serializer.validated_data['refresh']),
            'username': user.username,
            'role': user.get_user_role(),  # Custom method to get user role
        }
        return Response(response_data)



class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({"access_token": access_token}, status=status.HTTP_200_OK)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class StaffAddView(generics.CreateAPIView):
    serializer_class = StaffAddSerializer

class StudentAddView(generics.CreateAPIView):
    serializer_class = StudentAddSerializer

    def perform_create(self, serializer):
        program_id = self.request.data.get('program')  # Get the 'program' data from the request

        # Convert the program_id to a Program instance
        program_instance = Program.objects.get(pk=program_id)

        # Perform the create operation, passing the 'program' instance to the serializer
        serializer.save(program=program_instance)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Call perform_create to handle the 'program' field
        self.perform_create(serializer)

        return Response({"message": "User and Student created successfully."}, status=status.HTTP_201_CREATED)

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    queryset = User.objects.all()  



class EmailValidationOnForgotPasswordView(generics.CreateAPIView):
    serializer_class = EmailValidationOnForgotPasswordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            validated_email = serializer.validated_data['email']
            user = User.objects.get(email__iexact=validated_email)
        except User.DoesNotExist:
            raise serializers.ValidationError("There is no user registered with the specified E-mail address.")
        except User.MultipleObjectsReturned:
            raise serializers.ValidationError("Multiple users found with the specified E-mail address. Contact support.")

        # Generate a password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Save the token to the user model
        user.password_reset_token = token
        user.save()

        # frontend URL here or retrieve it dynamicallyss
        frontend_url = "http://127.0.0.1:8000/admin"  # Replace with your actual frontend URL

        # Create a reset link with the token
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

        # Send an email with the reset link
        send_mail(
            "Password Reset",
            f"Click the following link to reset your password: {reset_link}",
            settings.EMAIL_FROM_ADDRESS,
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Reset link sent to the provided email address."}, status=status.HTTP_200_OK)


class ParentAddView(generics.CreateAPIView):
    serializer_class = ParentAddSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Your logic to handle the serializer data and create a Parent instance
        with transaction.atomic():
            user_data = {
                'first_name': serializer.validated_data['first_name'],
                'last_name': serializer.validated_data['last_name'],
                'address': serializer.validated_data['address'],
                'phone': serializer.validated_data['phone'],
                'email': serializer.validated_data['email'],
                'is_parent': True
            }

            # Create User instance for the parent
            user = User.objects.create(**user_data)

            # Create Parent instance associated with User
            parent = Parent.objects.create(
                user=user,
                student=serializer.validated_data['student'],
                relation_ship=serializer.validated_data['relation_ship']
            )

        # Customize the response as needed
        response_data = {
            "message": "Parent created successfully.",
            "parent_id": parent.id,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
