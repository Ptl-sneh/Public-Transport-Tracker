from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Stop, BusRoute, TripPattern, TripPatternStop, BusTrip,
    BusTripStopTime, Fare, Feedback, LiveBusLocation, RouteShape,
    Favourite, ServiceAlert
)


# ----------------------
# Stop Serializer
# ----------------------
class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'


# ----------------------
# Trip Pattern Serializers
# ----------------------
class TripPatternStopSerializer(serializers.ModelSerializer):
    stop = StopSerializer(read_only=True)

    class Meta:
        model = TripPatternStop
        fields = ['stop_order', 'stop']


class TripPatternSerializer(serializers.ModelSerializer):
    stops = TripPatternStopSerializer(source='pattern_stops', many=True, read_only=True)

    class Meta:
        model = TripPattern
        fields = ['id', 'route', 'stops']


# ----------------------
# Bus Trip Serializers
# ----------------------
class BusTripStopTimeSerializer(serializers.ModelSerializer):
    stop = StopSerializer(read_only=True)

    class Meta:
        model = BusTripStopTime
        fields = ['stop_order', 'stop', 'arrival_time', 'departure_time']


class BusTripSerializer(serializers.ModelSerializer):
    stop_times = BusTripStopTimeSerializer(many=True, read_only=True)

    class Meta:
        model = BusTrip
        fields = '__all__'


# ----------------------
# Fare Serializer
# ----------------------
class FareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fare
        fields = '__all__'


# ----------------------
# Route Shape Serializer
# ----------------------
class RouteShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteShape
        fields = ['coordinates']


# ----------------------
# Bus Route Serializer
# ----------------------
class BusRouteSerializer(serializers.ModelSerializer):
    start_stop = StopSerializer(read_only=True)
    end_stop = StopSerializer(read_only=True)
    trip_patterns = TripPatternSerializer(many=True, read_only=True)
    shape = RouteShapeSerializer(read_only=True)
    fares = FareSerializer(many=True, read_only=True)

    class Meta:
        model = BusRoute
        fields = ['id', 'name', 'start_stop', 'end_stop', 'trip_patterns', 'shape', 'fares']


# ----------------------
# Feedback Serializer
# ----------------------
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


# ----------------------
# Live Bus Location Serializer
# ----------------------
class LiveBusLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveBusLocation
        fields = '__all__'


# ----------------------
# User Serializer
# ----------------------
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


# ----------------------
# Favourite Serializer
# ----------------------
class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = '__all__'


# ----------------------
# Service Alert Serializer
# ----------------------
class ServiceAlertSerializer(serializers.ModelSerializer):
    affected_routes = BusRouteSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceAlert
        fields = '__all__'
