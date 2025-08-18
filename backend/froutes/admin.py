from django.contrib import admin
from .models import BusTrip,BusTripStopTime,Favourite
# Register your models here.

admin.site.register(BusTrip)
admin.site.register(BusTripStopTime)
admin.site.register(Favourite)