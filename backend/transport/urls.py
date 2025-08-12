from django.urls import path
from . import views

urlpatterns = [
    # Stops
    path('stops/', views.StopListView.as_view(), name='stop-list'),
    path('stops/<int:pk>/', views.StopDetailView.as_view(), name='stop-detail'),
    path('stops/search/', views.search_stops, name='search-stops'),

    # Routes & Trips
    path('bus-routes/', views.BusRouteListView.as_view(), name='bus-route-list'),
    path('bus-routes/<int:pk>/', views.BusRouteDetailView.as_view(), name='bus-route-detail'),
    path('bus-routes/<int:pk>/trips/', views.RouteTripsView.as_view(), name='route-trips'),

    # Live Data
    path('bus-location/', views.live_bus_location, name='live-bus-location'),
    path('coordinates/', views.all_stops_coordinates, name='all-stop-coordinates'),

    # Fares
    path('fares/', views.FareListView.as_view(), name='fare-list'),

    # Feedback
    path('feedback/', views.FeedbackCreateView.as_view(), name='create-feedback'),

    # Auth
    path('register/', views.RegisterView.as_view(), name='register-user'),

    # Route Finder
    path('find-route/', views.find_routes, name='find-route'),
]
