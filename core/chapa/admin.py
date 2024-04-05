from django.contrib import admin
from .models import ChapaTransaction


class ChapaTransactionAdmin(admin.ModelAdmin):
    list_display = 'first_name', 'last_name', 'email', 'amount', 'currency', 'status', 'course'


admin.site.register(ChapaTransaction, ChapaTransactionAdmin)
