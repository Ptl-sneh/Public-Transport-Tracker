from django.contrib import admin
from .models import BusRoute,TripPattern,TripPatternStop,Fare,RouteShape
# Register your models here.

admin.site.register(BusRoute)
admin.site.register(TripPattern)
admin.site.register(TripPatternStop)
admin.site.register(Fare)
admin.site.register(RouteShape)