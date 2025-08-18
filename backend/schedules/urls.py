from django.urls import path
from . import views

urlpatterns = [
    path("bus-schedules/", views.bus_schedules, name="bus_schedules"),
    path('bus-routes/<int:pk>/trips/', views.RouteTripsView.as_view(), name='route-trips'),

]