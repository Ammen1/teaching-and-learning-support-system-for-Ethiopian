from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers, status
from course.models import Program
from . models import *
from django.utils import timezone
from .serializers import *
from django.db import transaction
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserLoginSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializers


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         token['username'] = user.username
#         return token

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['user_role'] = user.get_user_role  

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom fields to the response data
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['user_role'] = self.user.get_user_role
        print(data)
        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    # permission_classes = [AllowAny]  # Allow any user to obtain a token

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = {
            'access_token': str(serializer.validated_data['access']),
            'refresh_token': str(serializer.validated_data['refresh']),
            'user_role': str(serializer.validated_data['user_role']),
            'email': str(serializer.validated_data['email']),
       
        }
        print(response_data)
        return Response(response_data)
    



class SignUpView(APIView):
    def post(self, request):
        # Modify request data to set is_student to True
        request.data['is_student'] = True

        serializer = UserSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({"access_token": access_token}, status=status.HTTP_200_OK)



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
        frontend_url = "http://127.0.0.1:8000/api/account"  

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


class DashboardAPI(APIView):
    def get(self, request, *args, **kwargs):
        all_users = User.objects.all()
        student_count = Student.objects.count()
        instructor_count = DepartmentHead.objects.count()
        parent_count = Parent.objects.count()
        admin_count = User.objects.filter(is_superuser=True).count()
        current_month_users = User.objects.filter(date_joined__month=timezone.now().month).count()
        last_month_users = User.objects.filter(date_joined__month=timezone.now().month - 1).count()
        recent_users = User.objects.order_by('-date_joined')[:5]

        user_serializer = UserSerializer(all_users, many=True)
        student_serializer = StudentSerializer(student_count, many=True)
        instructor_serializer = DepartmentHeadSerializer(instructor_count, many=False)
        parent_serializer = ParentSerializer(parent_count, many=False)

        data = {
                'all_users': user_serializer.data,
                'student_count': student_count,
                'instructor_count': instructor_count,
                'parent_count': parent_count,
                'admin_count': admin_count,
                'current_month_users': current_month_users,
                'last_month_users': last_month_users,
                'recent_users': recent_users,
                }
        return Response(data, status=status.HTTP_200_OK)
    
    
    
class UserListView(APIView):
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)    