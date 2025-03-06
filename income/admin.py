from django.contrib import admin


from .models import Income, IncomeStream

# Register your models here.

class IncomeAdmin(admin.ModelAdmin):
    list_display = ('user', 'income_stream', 'amount', 'date', 'description')
    empty_value_display = '-empty-'
    list_per_page = 10


admin.site.register(Income, IncomeAdmin)
admin.site.register(IncomeStream)
