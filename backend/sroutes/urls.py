from django.urls import path
from . import views

urlpatterns = [
    path('bus-routes/', views.BusRouteListView.as_view(), name='bus-route-list'),
    path('bus-routes/<int:pk>/', views.BusRouteDetailView.as_view(), name='bus-route-detail'),
]
