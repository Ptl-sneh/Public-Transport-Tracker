from django.contrib import admin
from .models import Stop, BusRoute, MetroRoute, Schedule, Fare, Feedback

admin.site.register(Stop)
admin.site.register(BusRoute)
admin.site.register(MetroRoute)
admin.site.register(Schedule)
admin.site.register(Fare)
admin.site.register(Feedback)


