from django.urls import path
from .views import InitiateChapaTransactionView
from . import views

urlpatterns = [
    path('initiate-chapa-transaction/', InitiateChapaTransactionView.as_view(), name='initiate_chapa_transaction'),
    path('send-request/', views.send_request, name='send_request'),
    path('verify-payment/<int:transaction_id>/', views.verify_payment, name='verify_payment'),
    # path('transaction/verify/<str:tx_ref>/', views.verify_chapa_transaction, name='verify_transaction'),
]