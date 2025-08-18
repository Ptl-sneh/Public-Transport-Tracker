from django.db import models
from home.models import Stop,User
from sroutes.models import TripPattern



# Create your models here.

class BusTrip(models.Model):
    pattern = models.ForeignKey(TripPattern, related_name="trips", on_delete=models.CASCADE)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()

    def __str__(self):
        return f"{self.pattern} Trip @ {self.departure_time}"
    
class BusTripStopTime(models.Model):
    trip = models.ForeignKey(BusTrip, related_name="stop_times", on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    arrival_time = models.TimeField()
    departure_time = models.TimeField()
    stop_order = models.PositiveIntegerField()

    class Meta:
        ordering = ['stop_order']

    def __str__(self):
        return f"{self.trip} - {self.stop.name} ({self.arrival_time}/{self.departure_time})"
    
    
class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    route_identifier = models.CharField(max_length=100)  # e.g. "1D" or "12U-RL"
    source = models.CharField(max_length=255, null=True, blank=True)
    destination = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} fav {self.route_identifier} ({self.source} → {self.destination})"