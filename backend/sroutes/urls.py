from django.urls import path
from . import views

urlpatterns = [
    path('bus-routes/', views.BusRouteListView.as_view(), name='bus-route-list'),
    path('bus-routes/<int:pk>/', views.BusRouteDetailView.as_view(), name='bus-route-detail'),
    # Fare & Passes
    path('fares/estimate/', views.fare_estimate, name='fare-estimate'),
    path('passes/options/', views.passes_options, name='passes-options'),
    path('passes/quote/', views.passes_quote, name='passes-quote'),
]
