from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
import json
import logging
import uuid
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import ChapaTransaction
from .serializers import ChapaTransactionSerializer
from .api import ChapaAPI

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
        required_fields = ['amount', 'currency', 'email', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return Response({'error': f"Field '{field}' is missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Process the data and create a ChapaTransaction object
        transaction = ChapaTransaction.objects.create(
            amount=data['amount'],
            currency=data['currency'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],

        
        )

        # Send transaction request to Chapa API
        response = ChapaAPI.send_request(transaction)

        # Return response from Chapa API to the client
        return Response(response)

    except Exception as e:
        # Handle any exceptions and return an appropriate error response
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verify_payment(request, transaction_id):
    # Retrieve the ChapaTransaction object
    transaction = get_object_or_404(ChapaTransaction, id=transaction_id)

    # Verify the payment with Chapa API
    response = ChapaAPI.verify_payment(transaction)

    # Return the verification response to the client
    return Response(response)


class ChapaWebhookView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.decoder.JSONDecodeError as e:
            logger.error(f"Error decoding JSON: {e}")
            return JsonResponse({'error': "Invalid Json Body"}, status=status.HTTP_400_BAD_REQUEST)

        model_class = apps.get_model(app_label='chapa', model_name='ChapaTransaction')
        
        try:
            transaction_instance = model_class.objects.get(id=data.get('trx_ref'))
            transaction_instance.status = data.get('status')
            transaction_instance.response_dump = data
            transaction_instance.save()
            print(transaction_instance)
            return JsonResponse({'message': "Transaction updated successfully"})
        except model_class.DoesNotExist:
            return JsonResponse({'error': "Invalid Transaction"}, status=status.HTTP_400_BAD_REQUEST)
