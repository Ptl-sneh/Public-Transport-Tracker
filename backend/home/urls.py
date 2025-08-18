from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register-user'),
    path('', views.StopListView.as_view(), name='stop-list'),
    path('stops/<int:pk>/', views.StopDetailView.as_view(), name='stop-detail'),
    path('stops/search/', views.search_stops, name='search-stops'),
    path('stops/nearby/', views.nearby_stops, name='nearby-stops'),
    path('stops/coordinates/', views.all_stops_coordinates, name='all-stops-coordinates'),
    path("auth/me/", views.get_user_profile, name="get_user_profile"),
]
