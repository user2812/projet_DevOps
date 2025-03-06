from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="user-preferences"),
    path('change-currency', views.change_currency, name="change-currency"),
    path('change-personal-particulars', views.change_personal_particulars, name="change-personal-particulars"),
]