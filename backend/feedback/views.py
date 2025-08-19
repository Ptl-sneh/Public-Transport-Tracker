from django.shortcuts import render
from rest_framework import generics
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg
from .sentiment import analyze_sentiment

# Create your views here.

class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        comment = self.request.data.get("comment", "")
        sentiment = analyze_sentiment(comment)
        serializer.save(user=self.request.user, sentiment=sentiment)


class RecentFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all().order_by('-created_at')[:5]


class FeedbackStatsView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        total_feedback = Feedback.objects.count()
        avg_rating = Feedback.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        positive_feedback = Feedback.objects.filter(sentiment='Positive').count()
        positive_percentage = (positive_feedback / total_feedback * 100) if total_feedback > 0 else 0

        return Response({
            'total_feedback': total_feedback,
            'average_rating': round(avg_rating, 1),
            'positive_percentage': round(positive_percentage, 1),
        })


class UserFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user).order_by('-created_at')