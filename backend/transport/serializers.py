from rest_framework import serializers
from .models import Stop, BusRoute, TripPattern, TripPatternStop, BusTrip, Fare , Feedback ,LiveBusLocation, BusTripStopTime
from django.contrib.auth.models import User


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'


class TripPatternStopSerializer(serializers.ModelSerializer):
    stop = StopSerializer()

    class Meta:
        model = TripPatternStop
        fields = ['stop_order', 'stop']


class TripPatternSerializer(serializers.ModelSerializer):
    stops = TripPatternStopSerializer(source='pattern_stops', many=True, read_only=True)

    class Meta:
        model = TripPattern
        fields = ['id', 'route', 'stops']



class BusTripStopTimeSerializer(serializers.ModelSerializer):
    stop = StopSerializer()

    class Meta:
        model = BusTripStopTime
        fields = ['stop_order', 'stop', 'arrival_time', 'departure_time']
        
        
class BusTripSerializer(serializers.ModelSerializer):
    stop_times = BusTripStopTimeSerializer(many=True, read_only=True)

    class Meta:
        model = BusTrip
        fields = '__all__'
        
        
class FareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fare
        fields = '__all__'


class BusRouteSerializer(serializers.ModelSerializer):
    start_stop = StopSerializer()
    end_stop = StopSerializer()
    trip_patterns = TripPatternSerializer(many=True, read_only=True)

    class Meta:
        model = BusRoute
        fields = ['id', 'name', 'start_stop', 'end_stop', 'trip_patterns']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class LiveBusLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveBusLocation
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
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
