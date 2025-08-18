from django.urls import path
from . import views

urlpatterns = [
    path("bus-schedules/", views.bus_schedules, name="bus_schedules"),
]