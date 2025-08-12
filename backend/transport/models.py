from django.db import models
from django.contrib.auth.models import User

class Stop(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name


class BusRoute(models.Model):
    name = models.CharField(max_length=100)
    start_stop = models.ForeignKey(Stop, related_name="routes_starting", on_delete=models.CASCADE)
    end_stop = models.ForeignKey(Stop, related_name="routes_ending", on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TripPattern(models.Model):
    route = models.ForeignKey(BusRoute, related_name="trip_patterns", on_delete=models.CASCADE)
    stops = models.ManyToManyField(Stop, through="TripPatternStop")

    def __str__(self):
        return f"{self.route.name} Pattern"


class TripPatternStop(models.Model):
    pattern = models.ForeignKey(TripPattern, related_name="pattern_stops", on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    stop_order = models.PositiveIntegerField()

    class Meta:
        ordering = ['stop_order']

    def __str__(self):
        return f"{self.pattern} - {self.stop.name} ({self.stop_order})"


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
        return f"{self.trip} - {self.stop.name} ({self.arrival_time} / {self.departure_time})"


class Fare(models.Model):
    route = models.ForeignKey(BusRoute, related_name="fares", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.route.name} - ₹{self.amount}"


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    sentiment = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.user.username}"


class LiveBusLocation(models.Model):
    trip = models.ForeignKey(BusTrip, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)
