from django.contrib import admin
from .models import Expense, Category

# Register your models here.

class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'amount', 'date', 'description')
    empty_value_display = '-empty-'
    list_per_page = 10

admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Category)