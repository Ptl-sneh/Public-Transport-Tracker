from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Stops and brts routes

class Stop(models.Model): 
    STOP_CHOICES = (
        ('bus','Bus Stop'),
    )
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    stop_type = models.CharField(max_length=10,choices=STOP_CHOICES,default='bus')
    
    def __str__(self):
        return f"{self.name}"

# Bus Routes

class Stop(models.Model):
    BUS = 'bus'
    TYPE_CHOICES = [
        (BUS, 'Bus'),
    ]

    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=BUS)

    def __str__(self):
        return self.name


class BusRoute(models.Model):
    name = models.CharField(max_length=100)
    stops = models.ManyToManyField(Stop, through='RouteStop')

    def __str__(self):
        return self.name


class RouteStop(models.Model):
    route = models.ForeignKey(BusRoute, on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()  # stop order in the route

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.route.name} - {self.stop.name} ({self.order})"


class BusTrip(models.Model):
    route = models.ForeignKey(BusRoute, on_delete=models.CASCADE, related_name='trips')
    departure_time = models.TimeField()
    arrival_times = models.JSONField(default=dict)  
    # Example: {"Stop A": "06:30", "Stop B": "06:40"}

    def __str__(self):
        return f"{self.route.name} @ {self.departure_time}"

class Schedule(models.Model):
    ROUTE_TYPE_CHOICES = [
        ('bus', 'Bus'),
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
    rating = models.IntegerField()
    comment = models.TextField()

    # This part allows linking to either BusRoute
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)  
    object_id = models.PositiveIntegerField()
    route = GenericForeignKey('content_type', 'object_id')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.route} ({self.rating}⭐)"


    
class BusStatus(models.Model):
    route = models.ForeignKey(BusRoute, on_delete=models.CASCADE, related_name="statuses")
    current_stop = models.ForeignKey(Stop, on_delete=models.SET_NULL, null=True, related_name="bus_statuses")
    direction = models.IntegerField(default=1)
    timestamp = models.DateTimeField(auto_now=True)
    stop_index = models.PositiveIntegerField(default=0)