# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status



class ResultListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)

  
