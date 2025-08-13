from django.contrib import admin
from .models import Stop,BusRoute,TripPattern,TripPatternStop,BusTrip,BusTripStopTime,Fare,Feedback,LiveBusLocation,RouteShape,Favourite,ServiceAlert

admin.site.register(Stop)
admin.site.register(BusRoute)
admin.site.register(TripPattern)
admin.site.register(TripPatternStop)
admin.site.register(BusTrip)
admin.site.register(BusTripStopTime)
admin.site.register(Fare)
admin.site.register(Feedback)   
admin.site.register(LiveBusLocation)
admin.site.register(RouteShape)
admin.site.register(Favourite)
admin.site.register(ServiceAlert)