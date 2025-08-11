from django.contrib import admin
from .models import Stop, BusRoute, Schedule, Fare, Feedback, RouteStop , BusTrip

admin.site.register(Stop)
admin.site.register(BusRoute)
admin.site.register(Schedule)
admin.site.register(Fare)
admin.site.register(Feedback)
admin.site.register(RouteStop)
admin.site.register(BusTrip)