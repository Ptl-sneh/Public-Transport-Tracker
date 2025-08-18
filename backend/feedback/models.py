from django.db import models
from home.models import User
from sroutes.models import BusRoute

# Create your models here.

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    route = models.ForeignKey(BusRoute, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    sentiment = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.user.username}"