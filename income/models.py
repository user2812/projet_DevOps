from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

# Create your models here.
class Income(models.Model):
    user = models.ForeignKey(to=User, blank=False, null=False, on_delete=models.CASCADE)
    amount = models.FloatField()
    date = models.DateField(default=now)
    income_stream = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Income'
    
    def __str__(self) -> str:
        return f"{self.user} earned ${self.amount} from {self.income_stream}"

class IncomeStream(models.Model):
    income_stream = models.CharField(max_length=255, blank=False, null=False)

    class Meta:
        verbose_name = 'Income Stream'
        verbose_name_plural = 'Income Streams'

    def __str__(self) -> str:
        return self.income_stream
