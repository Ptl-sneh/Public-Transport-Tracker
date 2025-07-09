from django.db import models
from django.db import models
from django.contrib.auth.models import User



class Stop(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    order = models.PositiveIntegerField(default=0)  # Lower = comes first

    class Meta:
        ordering = ['order']
    def __str__(self):
        return self.name


class BusRoute(models.Model):
    route_name = models.CharField(max_length=100)
    stops = models.ManyToManyField(Stop, related_name='bus_routes')

    def __str__(self):
        return self.route_name



class MetroRoute(models.Model):
    route_name = models.CharField(max_length=100)
    stops = models.ManyToManyField(Stop, related_name='metro_routes')

    def __str__(self):
        return self.route_name



class Schedule(models.Model):
    ROUTE_TYPE_CHOICES = [
        ('bus', 'Bus'),
        ('metro', 'Metro'),
    ]
    route_type = models.CharField(max_length=10, choices=ROUTE_TYPE_CHOICES)
    route_id = models.IntegerField()  # You will resolve this using the route_type
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    arrival_time = models.TimeField()
    departure_time = models.TimeField()

    def __str__(self):
        return f"{self.route_type.title()} {self.route_id} - {self.stop.name}"


class Fare(models.Model):
    ROUTE_TYPE_CHOICES = [
        ('bus', 'Bus'),
        ('metro', 'Metro'),
    ]
    route_type = models.CharField(max_length=10, choices=ROUTE_TYPE_CHOICES)
    route_id = models.IntegerField()
    start_stop = models.ForeignKey(Stop, related_name='start_fares', on_delete=models.CASCADE)
    end_stop = models.ForeignKey(Stop, related_name='end_fares', on_delete=models.CASCADE)
    fare_amount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.route_type.title()} {self.route_id}: {self.start_stop} ➔ {self.end_stop}"


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    route_type = models.CharField(max_length=10, choices=[('bus', 'Bus'), ('metro', 'Metro')])
    route_id = models.IntegerField()
    comment = models.TextField()
    sentiment = models.CharField(max_length=10, choices=[('Positive', 'Positive'), ('Negative', 'Negative'), ('Neutral', 'Neutral')], default='Neutral')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.route_type.title()} {self.route_id}: {self.sentiment}"
    
class BusStatus(models.Model):
    route = models.ForeignKey(BusRoute, on_delete = models.CASCADE)
    stop_index = models.IntegerField(default=0)
    direction = models.IntegerField(default=1)
    

