from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

# Create your models here.
class Expense(models.Model):
    user = models.ForeignKey(to=User, blank=False, null=False, on_delete=models.CASCADE)
    amount = models.FloatField()
    date = models.DateField(default=now)
    category = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self) -> str:
        return f"{self.user} spent ${self.amount} on {self.category}"

class Category(models.Model):
    category = models.CharField(max_length=255, blank=False, null=False)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self) -> str:
        return self.category

