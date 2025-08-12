from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Stop, BusRoute, TripPattern, BusTrip, Fare, Feedback, LiveBusLocation
from .serializers import StopSerializer, BusRouteSerializer, TripPatternSerializer, BusTripSerializer, FareSerializer, FeedbackSerializer, LiveBusLocationSerializer, UserSerializer


# ========================
# Stops
# ========================
class StopListView(generics.ListCreateAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class StopDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


@api_view(['GET'])
def search_stops(request):
    query = request.GET.get('q', '')
    stops = Stop.objects.filter(name__icontains=query)
    return Response(StopSerializer(stops, many=True).data)


# ========================
# Bus Routes
# ========================
class BusRouteListView(generics.ListCreateAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer

class BusRouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


# ========================
# Trips for a Route
# ========================
class RouteTripsView(generics.ListAPIView):
    serializer_class = BusTripSerializer

    def get_queryset(self):
        route_id = self.kwargs['pk']
        return BusTrip.objects.filter(pattern__route_id=route_id)


# ========================
# Fares
# ========================
class FareListView(generics.ListCreateAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer


# ========================
# Feedback
# ========================
class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


# ========================
# User Registration
# ========================
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ========================
# Live Bus Location
# ========================
@api_view(['GET'])
def live_bus_location(request):
    locations = LiveBusLocation.objects.all()
    return Response(LiveBusLocationSerializer(locations, many=True).data)


@api_view(['GET'])
def all_stops_coordinates(request):
    stops = Stop.objects.all()
    return Response(StopSerializer(stops, many=True).data)


# ========================
# Route Finder
# ========================
@api_view(['GET'])
def find_routes(request):
    source = request.GET.get('source')
    destination = request.GET.get('destination')
    # Simplified logic: find routes having both stops
    routes = BusRoute.objects.filter(
        trip_patterns__stop_sequence__name__icontains=source
    ).filter(
        trip_patterns__stop_sequence__name__icontains=destination
    ).distinct()
    return Response(BusRouteSerializer(routes, many=True).data)
