from django.db import models
from home.models import Stop  # reusing Stop from stops app

# ----------------------
# Bus Route Model
# ----------------------
class BusRoute(models.Model):
    name = models.CharField(max_length=100)
    start_stop = models.ForeignKey(Stop, related_name="routes_starting", on_delete=models.CASCADE)
    end_stop = models.ForeignKey(Stop, related_name="routes_ending", on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# ----------------------
# Trip Pattern & Stops
# ----------------------
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


# ----------------------
# Route Shape
# ----------------------
class RouteShape(models.Model):
    route = models.OneToOneField(BusRoute, related_name='shape', on_delete=models.CASCADE)
    coordinates = models.JSONField(help_text="List of [lat, lng] pairs representing route shape")

    def __str__(self):
        return f"Shape for {self.route.name}"


# ----------------------
# Fare Model
# ----------------------
class Fare(models.Model):
    route = models.ForeignKey(BusRoute, related_name="fares", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.route.name} - ₹{self.amount}"
