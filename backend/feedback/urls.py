from django.urls import path
from . import views

urlpatterns = [
    path('feedback/', views.FeedbackCreateView.as_view(), name='create-feedback'),
    path('feedback/recent/', views.RecentFeedbackListView.as_view(), name='recent-feedback'),
    path('feedback/stats/', views.FeedbackStatsView.as_view(), name='feedback-stats'),
    path('feedback/user/', views.UserFeedbackView.as_view(), name='user-feedback'),
]