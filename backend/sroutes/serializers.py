from rest_framework import serializers
from home.serializers import StopSerializer
from .models import BusRoute, TripPattern, TripPatternStop, RouteShape, Fare, PassPlan, UserTypeDiscount


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


class FareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fare
        fields = '__all__'


class RouteShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteShape
        fields = ['coordinates']


class PassPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassPlan
        fields = ['id', 'name', 'period', 'price']


class UserTypeDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypeDiscount
        fields = ['user_type', 'discount_pct']


class BusRouteSerializer(serializers.ModelSerializer):
    start_stop = StopSerializer(read_only=True)
    end_stop = StopSerializer(read_only=True)
    trip_patterns = TripPatternSerializer(many=True, read_only=True)
    shape = RouteShapeSerializer(read_only=True)
    fares = FareSerializer(many=True, read_only=True)

    class Meta:
        model = BusRoute
        fields = ['id', 'name', 'start_stop', 'end_stop', 'trip_patterns', 'shape', 'fares']
