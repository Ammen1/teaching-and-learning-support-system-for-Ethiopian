from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import UserRegistrationSerializer,TeacherSerializer,StudentSerializer
from.models import UserAccount, TeacherProfile,StudentProfile
import random
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser




otp_storage = {}
class GenerateOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        print(email,1111111111111111111111111)
        if email:
            if UserAccount.objects.filter(email=email).exists():
                return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            otp = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            otp_storage[email] = otp 
            print(otp,555555555555555555555555555555555)
            Send the OTP to the user's email
            send_mail('OTP Verification', f'Your OTP is: {otp}', 'amenguda@gmail.com', [email])
            print(777777777777777)
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        entered_otp = request.data.get('otp')

        if email in otp_storage:
            stored_otp = otp_storage[email]
            if entered_otp == stored_otp:
                del otp_storage[email]  # remove the otps from the dictionary
                return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'OTP verification failed'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class UserRegister(APIView):
    permission_classes = []
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        print(request.data,2222222) 
        serializer = UserRegistrationSerializer(data=request.data)
        print(serializer,4444444)
        if serializer.is_valid():
            print(23232323232)
            user = serializer.save()
            print(user)
            return Response({"message": "User registration successful."}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        users = UserAccount.objects.all()
        serializer = UserRegistrationSerializer(users, many=True)
        return Response(serializer.data)
