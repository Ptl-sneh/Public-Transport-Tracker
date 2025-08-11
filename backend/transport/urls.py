from django.urls import path
from . import views

urlpatterns = [
    path('bus-routes/', views.BusRouteList.as_view(), name='bus_route_list'),
    path('stops/', views.StopList.as_view(), name='stop_list'),
    path('schedules/', views.ScheduleList.as_view(), name='schedule_list'),
    path('fares/', views.FareList.as_view(), name='fare_list'),
    path('route-schedule/<str:route_type>/<int:route_id>/',views.route_schedule,name = 'route_schedule'),
    path('feedback/', views.create_feedback, name='create-feedback'),
    path('register/', views.register_user,name = "register_user"),
    path('find-route/', views.find_routes , name = 'find-route'),
    path('bus-location/', views.live_bus_location, name = 'live-bus-location'),
    path('coordinates/', views.all_stops_coordinates, name = 'all_stop_coordinates'),
    path('search-stops/', views.search_stops, name = 'search-stops'),
]   
