from django.urls import path
from . import views


urlpatterns = [
     path('find_route/', views.find_routes, name='find_route'),
]