from django.shortcuts import render
from rest_framework import generics
from .models import Feedback
from .serializers import FeedbackSerializer
# Create your views here.
class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


class RouteFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        route_id = self.kwargs['route_id']
        return Feedback.objects.filter(route_id=route_id)