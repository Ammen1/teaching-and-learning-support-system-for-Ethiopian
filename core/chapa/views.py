import json
import logging
import uuid
import requests

from django.apps import apps
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .api import ChapaAPI
from .models import ChapaTransaction
from .serializers import ChapaTransactionSerializer
from course.models import Course, UploadVideo


logger = logging.getLogger(__name__)


class InitiateChapaTransactionView(APIView):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        try:
            request_data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in request body'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ChapaTransactionSerializer(data=request_data)
        
        if serializer.is_valid():
            tx_ref = str(uuid.uuid4())  # Generate a new UUID for tx_ref
            payload = serializer.validated_data
            payload['tx_ref'] = tx_ref
            
            url = "https://api.chapa.co/v1/transaction/initialize"
            headers = {
                'Authorization': 'Bearer CHASECK_TEST-WLA5A4peABCYzMIKSaze3aYnfRBlpWDk',
                'Content-Type': 'application/json'
            }

            response = requests.post(url, json=payload, headers=headers)
            chapa_response_data = response.json()

            if response.status_code == 200:
                return JsonResponse({'checkout_url': chapa_response_data.get('data', {}).get('checkout_url')})
            else:
                return JsonResponse({'error': chapa_response_data.get('message', 'Unknown error')}, status=response.status_code)
        else:
            return JsonResponse({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def send_request(request):
    try:
        data = request.data
        
        # Ensure all required fields are present
        required_fields = ['amount', 'currency', 'email', 'first_name', 'last_name', 'course_id']
        for field in required_fields:
            if field not in data:
                return Response({'error': f"Field '{field}' is missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the course associated with the payment
        course = get_object_or_404(Course, id=data['course_id'])

        # Process the data and create a ChapaTransaction object
        transaction = ChapaTransaction.objects.create(
            amount=data['amount'],
            currency=data['currency'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            course=course,
            # Other necessary fields...
        )

        # Send transaction request to Chapa API
        response = ChapaAPI.send_request(transaction)

        # Check if the payment request was successful
        if response.get('success'):
            # Fetch course details and include them in the response
            course_details = {
                'title': course.title,
                'summary': course.summary,
                # Include other course details as needed
            }
            response['course_details'] = course_details

            # Return success response along with course details to the client
            return Response(response)
        else:
            # Return response from Chapa API to the client
            return Response(response)

    except Exception as e:
        # Handle any exceptions and return an appropriate error response
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def verify_payment(request, transaction_id):
    try:
        # Retrieve the ChapaTransaction object
        transaction = get_object_or_404(ChapaTransaction, id=transaction_id)

        # Retrieve the associated course for the transaction
        course = transaction.course

        # Retrieve course uploads
        uploads = course.upload_set.all()

        # Retrieve course videos
        course_videos = course.uploadvideo_set.all()

        # Verify the payment with Chapa API
        response = ChapaAPI.verify_payment(transaction)

        # Check if the payment verification was successful
        if response.get('status') == 'success':
            # Construct course details dictionary
            course_details = {
                'title': course.title,
                'summary': course.summary,
                'lecturer': {
                    'username': course.lecturer.username,
                    'email': course.lecturer.email,
                    'picture': course.lecturer.picture.url if course.lecturer.picture else None,
                },
                'uploads': [
                    {
                        'id': upload.id,
                        'title': upload.title,
                        'file': upload.file.url,
                        'updated_date': upload.updated_date,
                    }
                    for upload in uploads
                ],
                'course_videos': [
                    {
                        'id': video.id,
                        'title': video.title,
                        'video': video.video.url,
                        'summary': video.summary,
                        'timestamp': video.timestamp,
                    }
                    for video in course_videos
                ],
            }

            # Add course details to the response
            response['course_details'] = course_details

        return Response(response)

    except Exception as e:
        # Handle any exceptions and return an appropriate error response
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class ChapaWebhookView(APIView):
    def get(self, request):
        try:
            # Extract query parameters from the request
            callback = request.query_params.get('callback')
            trx_ref = request.query_params.get('trx_ref')
            status = request.query_params.get('status')

            # Validate the presence of required parameters
            if not callback or not trx_ref or not status:
                return JsonResponse({'error': "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)

            # Handle the webhook data
            model_class = apps.get_model(app_label='chapa', model_name='ChapaTransaction')
            transaction_instance = model_class.objects.get(id=trx_ref)
            transaction_instance.status = status
            transaction_instance.save()

            # Respond with a success message
            return JsonResponse({'message': "Transaction updated successfully"})

        except model_class.DoesNotExist:
            return JsonResponse({'error': "Invalid Transaction"}, status=status.HTTP_400_BAD_REQUEST)
