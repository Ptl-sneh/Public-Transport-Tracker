from django.urls import path
from . import views

urlpatterns = [
    # ----------------------
    # Stops
    # ----------------------
    path('stops/', views.StopListView.as_view(), name='stop-list'),
    path('stops/<int:pk>/', views.StopDetailView.as_view(), name='stop-detail'),
    path('stops/search/', views.search_stops, name='search-stops'),
    path('stops/nearby/', views.nearby_stops, name='nearby-stops'),
    path('stops/<int:stop_id>/eta/', views.stop_eta, name='stop-eta'),

    # ----------------------
    # Bus Routes
    # ----------------------
    path('bus-routes/', views.BusRouteListView.as_view(), name='bus-route-list'),
    path('bus-routes/<int:pk>/', views.BusRouteDetailView.as_view(), name='bus-route-detail'),
    path('bus-routes/<int:pk>/trips/', views.RouteTripsView.as_view(), name='route-trips'),

    # ----------------------
    # Bus Trip Stop Times
    # ----------------------
    path('trips/<int:trip_id>/stop-times/', views.TripStopTimesView.as_view(), name='trip-stop-times'),

    # ----------------------
    # Fares
    # ----------------------
    path('fares/', views.FareListView.as_view(), name='fare-list'),

    # ----------------------
    # Feedback
    # ----------------------
    path('feedback/', views.FeedbackCreateView.as_view(), name='create-feedback'),
    path('feedback/route/<int:route_id>/', views.RouteFeedbackListView.as_view(), name='route-feedback'),

    # ----------------------
    # User Registration
    # ----------------------
    path('register/', views.RegisterView.as_view(), name='register-user'),

    # ----------------------
    # Live Bus Location
    # ----------------------
    path('bus-location/', views.live_bus_location, name='bus-location'),

    # ----------------------
    # Favourites
    # ----------------------
    path('favourites/', views.FavouriteListCreateView.as_view(), name='favourites-list-create'),
    path('favourites/<int:pk>/', views.FavouriteDetailView.as_view(), name='favourites-detail'),

    # ----------------------
    # Service Alerts
    # ----------------------
    path('alerts/', views.ActiveServiceAlertsView.as_view(), name='active-alerts'),

    # ----------------------
    # Route Finder (Source → Destination)
    # ----------------------
    path('find_route/', views.find_routes, name='find_route'),
    
    path('coordinates/', views.all_stops_coordinates, name='all-stop-coordinates'),
]
