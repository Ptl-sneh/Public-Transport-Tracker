# from django.db import models
# from django.contrib.auth.models import User

# # ----------------------
# # Stop Model
# # ----------------------
# class Stop(models.Model):
#     name = models.CharField(max_length=100)
#     latitude = models.FloatField()
#     longitude = models.FloatField()

#     def __str__(self):
#         return self.name


# # ----------------------
# # Bus Route Model
# # ----------------------
# class BusRoute(models.Model):
#     name = models.CharField(max_length=100)
#     start_stop = models.ForeignKey(Stop, related_name="routes_starting", on_delete=models.CASCADE)
#     end_stop = models.ForeignKey(Stop, related_name="routes_ending", on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name


# # ----------------------
# # Trip Pattern & Stops
# # ----------------------
# class TripPattern(models.Model):
#     route = models.ForeignKey(BusRoute, related_name="trip_patterns", on_delete=models.CASCADE)
#     stops = models.ManyToManyField(Stop, through="TripPatternStop")

#     def __str__(self):
#         return f"{self.route.name} Pattern"


# class TripPatternStop(models.Model):
#     pattern = models.ForeignKey(TripPattern, related_name="pattern_stops", on_delete=models.CASCADE)
#     stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
#     stop_order = models.PositiveIntegerField()

#     class Meta:
#         ordering = ['stop_order']

#     def __str__(self):
#         return f"{self.pattern} - {self.stop.name} ({self.stop_order})"


# # ----------------------
# # Bus Trip & Stop Times
# # ----------------------
# class BusTrip(models.Model):
#     pattern = models.ForeignKey(TripPattern, related_name="trips", on_delete=models.CASCADE)
#     departure_time = models.TimeField()
#     arrival_time = models.TimeField()

#     def __str__(self):
#         return f"{self.pattern} Trip @ {self.departure_time}"


# class BusTripStopTime(models.Model):
#     trip = models.ForeignKey(BusTrip, related_name="stop_times", on_delete=models.CASCADE)
#     stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
#     arrival_time = models.TimeField()
#     departure_time = models.TimeField()
#     stop_order = models.PositiveIntegerField()

#     class Meta:
#         ordering = ['stop_order']

#     def __str__(self):
#         return f"{self.trip} - {self.stop.name} ({self.arrival_time}/{self.departure_time})"
    
# # ----------------------
# # Route Shape
# # ----------------------
# class RouteShape(models.Model):
#     route = models.OneToOneField(BusRoute, related_name='shape', on_delete=models.CASCADE)
#     coordinates = models.JSONField(help_text="List of [lat, lng] pairs representing route shape")

#     def __str__(self):
#         return f"Shape for {self.route.name}"


# # ----------------------
# # Fare Model
# # ----------------------
# class Fare(models.Model):
#     route = models.ForeignKey(BusRoute, related_name="fares", on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=5, decimal_places=2)

#     def __str__(self):
#         return f"{self.route.name} - ₹{self.amount}"


# # ----------------------
# # Feedback Model
# # ----------------------
# class Feedback(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     route = models.ForeignKey(BusRoute, on_delete=models.CASCADE, null=True, blank=True)
#     message = models.TextField()
#     sentiment = models.CharField(max_length=20, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Feedback by {self.user.username}"


# # ----------------------
# # Live Bus Location
# # ----------------------
# class LiveBusLocation(models.Model):
#     trip = models.ForeignKey(BusTrip, on_delete=models.CASCADE,null=True, blank=True)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     timestamp = models.DateTimeField(auto_now=True)



# # ----------------------
# # Favourites
# # ----------------------
# class Favourite(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     route_identifier = models.CharField(max_length=100)  # e.g. "1D" or "12U-RL"
#     source = models.CharField(max_length=255, null=True, blank=True)
#     destination = models.CharField(max_length=255, null=True, blank=True)

#     def __str__(self):
#         return f"{self.user.username} fav {self.route_identifier} ({self.source} → {self.destination})"



# # ----------------------
# # Service Alerts
# # ----------------------
# class ServiceAlert(models.Model):
#     message = models.TextField()
#     affected_routes = models.ManyToManyField(BusRoute, blank=True)
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()

#     def __str__(self):
#         return self.message
