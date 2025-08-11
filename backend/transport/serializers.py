from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stop,BusRoute,Schedule,RouteStop,Fare,Feedback,BusTrip
from django.contrib.contenttypes.models import ContentType


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
        fields = ['id', 'name', 'latitude', 'longitude', 'type']


class RouteStopSerializer(serializers.ModelSerializer):
    stop = StopSerializer()

    class Meta:
        model = RouteStop
        fields = ['order', 'stop']


class BusTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusTrip
        fields = ['id', 'departure_time', 'arrival_times']


class BusRouteSerializer(serializers.ModelSerializer):
    stops = RouteStopSerializer(source='routestop_set', many=True)
    trips = BusTripSerializer(many=True)

    class Meta:
        model = BusRoute
        fields = ['id', 'name', 'stops', 'trips']

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
    route_type = serializers.CharField(write_only=True)  # 'bus' or 'metro'
    route_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'rating', 'comment', 'route_type', 'route_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        route_type = data.get('route_type')
        route_id = data.get('route_id')

        # Match model based on route_type
        if route_type == 'bus':
            model = BusRoute
        else:
            raise serializers.ValidationError({"route_type": "Must be 'bus' or 'metro'."})

        # Check if route exists
        if not model.objects.filter(id=route_id).exists():
            raise serializers.ValidationError({"route_id": "Route does not exist."})

        return data

    def create(self, validated_data):
        route_type = validated_data.pop('route_type')
        route_id = validated_data.pop('route_id')

        # Pick the correct model
        if route_type == 'bus':
            model = BusRoute

        content_type = ContentType.objects.get_for_model(model)
        validated_data['content_type'] = content_type
        validated_data['object_id'] = route_id

        return Feedback.objects.create(**validated_data)

