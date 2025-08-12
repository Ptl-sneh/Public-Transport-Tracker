from django.contrib import admin
from .models import Stop, BusRoute,Fare, Feedback, BusTrip,TripPattern,TripPatternStop, LiveBusLocation , BusTripStopTime

admin.site.register(Stop)
admin.site.register(BusRoute)
admin.site.register(TripPattern)
admin.site.register(Fare)
admin.site.register(Feedback)
admin.site.register(BusTrip)
admin.site.register(TripPatternStop)
admin.site.register(LiveBusLocation)
admin.site.register(BusTripStopTime)    