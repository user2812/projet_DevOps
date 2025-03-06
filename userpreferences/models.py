from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserPreference(models.Model):
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    currency = models.CharField(max_length=255, blank=False, null=False, default="USD")

    def get_user_preference(self):
        return str(self.currency)

    def __str__(self) -> str:
        return f"{self.user}'s preferences"