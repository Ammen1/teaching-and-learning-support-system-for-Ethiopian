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
from rest_framework import serializers
from django.utils.decorators import method_decorator
from django.views import View
from chapa.serializers import ChapaTransactionSerializer

logger = logging.getLogger(__name__)

class InitiateChapaTransactionView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        try:
            request_data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in request body'}, status=400)

        serializer = ChapaTransactionSerializer(data=request_data)
        
        if serializer.is_valid():
            serializer.save()
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
            serializer.save()

            if response.status_code == 200:
                return JsonResponse({'checkout_url': chapa_response_data.get('data', {}).get('checkout_url')})
            else:
                return JsonResponse({'error': chapa_response_data.get('message', 'Unknown error')}, status=response.status_code)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
