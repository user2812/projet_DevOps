from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.index, name="expenses-index"),
    path('add-expenses', views.add_expenses, name="add-expenses"),
    path('edit-expenses/<int:id>', views.edit_expenses, name="edit-expenses"),
    path('delete-expenses/<int:id>', views.delete_expenses, name="delete-expenses"),
    path('search-expenses', csrf_exempt(views.search_expenses), name="search-expenses"),
    path('expenses-category-summary/<int:mths>', views.expenses_category_summary, name="expenses-category-summary"),
    path('expenses-amount-summary/<int:mths>', views.expenses_amount_summary, name="expenses-amount-summary"),
    path('expenses-statistics-view', views.expenses_statistics_view, name="expenses-statistics-view"),
    path('overview-chart', views.overview_chart, name="overview-chart"),
    path('export-csv-file', views.export_csv_file, name="export-csv-file-expenses"),
    path('export-xls-file', views.export_xls_file, name="export-xls-file-expenses"),
]

