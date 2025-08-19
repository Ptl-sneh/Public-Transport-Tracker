from rest_framework import serializers
from .models import Favourite , BusTrip ,BusTripStopTime
from home.serializers import StopSerializer


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

class FavouriteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Favourite
        fields = ["id", "username", "route_identifier", "source", "destination"]
        read_only_fields = ["id", "username"]