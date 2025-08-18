from django.shortcuts import render
from rest_framework import generics
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Count

# Create your views here.

class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RecentFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all().order_by('-created_at')[:5]  # Get 5 most recent feedbacks


class FeedbackStatsView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        total_feedback = Feedback.objects.count()
        avg_rating = Feedback.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        positive_feedback = Feedback.objects.filter(sentiment='Positive').count()
        positive_percentage = (positive_feedback / total_feedback * 100) if total_feedback > 0 else 0
        
        return Response({
            'total_feedback': total_feedback,
            'average_rating': round(avg_rating, 1),
            'positive_percentage': round(positive_percentage, 1)
        })