from django.urls import path
from . import views


urlpatterns = [
     path('find_route/', views.find_routes, name='find_route'),
     path('favourites/', views.FavouriteListCreateView.as_view(), name='favourites-list-create'),
     path('favourites/<int:pk>/', views.FavouriteDetailView.as_view(), name='favourites-detail'),
]