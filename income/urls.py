from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.index, name="income-index"),
    path('add-income', views.add_income, name="add-income"),
    path('edit-income/<int:id>', views.edit_income, name="edit-income"),
    path('delete-income/<int:id>', views.delete_income, name="delete-income"),
    path('search-income', csrf_exempt(views.search_income), name="search-income"),
    path('income-category-summary/<int:mths>', views.income_category_summary, name="income-category-summary"),
    path('income-amount-summary/<int:mths>', views.income_amount_summary, name="income-amount-summary"),
    path('income-statistics-view', views.income_statistics_view, name="income-statistics-view"),
    path('export-csv-file', views.export_csv_file, name="export-csv-file-income"),
    path('export-xls-file', views.export_xls_file, name="export-xls-file-income"),
]