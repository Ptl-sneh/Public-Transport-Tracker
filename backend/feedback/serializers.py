from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "username", "comment", "rating", "sentiment", "created_at"]
        read_only_fields = ["id", "username", "sentiment", "created_at"]
