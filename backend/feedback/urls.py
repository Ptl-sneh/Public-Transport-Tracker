from django.urls import path
from . import views

urlpatterns = [
    path('feedback/', views.FeedbackCreateView.as_view(), name='create-feedback'),
    path('feedback/route/<int:route_id>/', views.RouteFeedbackListView.as_view(), name='route-feedback'),
]