from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('bus-routes/', views.BusRouteList.as_view(), name='bus_route_list'),
    path('metro-routes/', views.MetroRouteList.as_view(), name='metro_route_list'),
    path('stops/', views.StopList.as_view(), name='stop_list'),
    path('schedules/', views.ScheduleList.as_view(), name='schedule_list'),
    path('fares/', views.FareList.as_view(), name='fare_list'),
    path('feedbacks/', views.FeedbackList.as_view(), name='feedback_list'),
    path('feedback/', views.create_feedback, name='create-feedback'),
    path('register/',views.register_user,name = "register_user")
]
