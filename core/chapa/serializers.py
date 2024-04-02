from rest_framework import serializers
from .models import ChapaTransaction

class ChapaTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapaTransaction
        fields = '__all__'
