from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stop,BusRoute,MetroRoute,Schedule,Fare,Feedback

# User Registration Serializer
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'
        
class BusRouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many = True,read_only = True)
    
    class Meta:
        model = BusRoute
        fields = '__all__'
        
class MetroRouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many = True,read_only = True)
    
    class Meta:
        model = MetroRoute
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    stop = StopSerializer()
    
    class Meta:
        model = Schedule
        fields = '__all__'
        
class FareSerializer(serializers.ModelSerializer):
    start_stop = StopSerializer()
    end_stop = StopSerializer()

    class Meta:
        model = Fare
        fields = '__all__'
        
        
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

