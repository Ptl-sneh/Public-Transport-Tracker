from django.db import models
from django.db import models
from django.contrib.auth.models import User

# Stops for metro and brts routes

class Stop(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    TYPE_CHOICES = (
        ('bus','Bus'),
        ('metro','Metro')
    )
    stop_type = models.CharField(max_length=10,choices=TYPE_CHOICES)
    
    def __str__(self):
        return f"{self.name} {self.stop_type}"

# Bus Routes

class BusRoute(models.Model):
    route_name = models.CharField(max_length=100)
    stops = models.ManyToManyField(Stop, through='BusRouteStop', related_name='bus_routes')

    def __str__(self):
        return self.route_name


# Metro Routes
class MetroRoute(models.Model):
    route_name = models.CharField(max_length=100)
    stops = models.ManyToManyField(Stop, through='MetroBusStop', related_name='metro_routes')

    def __str__(self):
        return self.route_name

# To define brts stop in order
class BusRouteStop(models.Model):
    bus = models.ForeignKey(BusRoute,on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop,on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        

# To define metro stop in order      
class MetroRouteStop(models.Model):
    metro = models.ForeignKey(MetroRoute,on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop,on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    
    class Meta:
        ordering = ['order']


class BusTrip(models.Model):
    route = models.ForeignKey(BusRoute,on_delete=models.CASCADE)
    trip_number = models.IntegerField()
    
    def __str__(self):
        return f"{self.route.route_name} Trip {self.trip_number}"


class MetroTrip(models.Model):
    route = models.ForeignKey(MetroRoute,on_delete = models.CASCADE)
    trip_number = models.IntegerField()
    
    def __str__(self):
        return f"{self.route.route_name} Trip {self.trip_number}"

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
    

