from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import (
    Stop, BusRoute, TripPattern, BusTrip, BusTripStopTime, Fare,
    Feedback, LiveBusLocation, Favourite, ServiceAlert,TripPatternStop
)
from .serializers import (
    StopSerializer, BusRouteSerializer, TripPatternSerializer, BusTripSerializer,
    BusTripStopTimeSerializer, FareSerializer, FeedbackSerializer,
    LiveBusLocationSerializer, UserSerializer, FavouriteSerializer,
    ServiceAlertSerializer
)
from django.contrib.auth.models import User
import math

# ----------------------
# Stops
# ----------------------
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


# ----------------------
# Nearby Stops
# ----------------------
@api_view(['GET'])
def nearby_stops(request):
    try:
        lat = float(request.GET.get('lat'))
        lng = float(request.GET.get('lng'))
        radius = float(request.GET.get('radius', 500))  # meters

        stops = []
        for stop in Stop.objects.all():
            distance = haversine(lng, lat, stop.longitude, stop.latitude)
            if distance <= radius:
                stops.append(stop)

        serializer = StopSerializer(stops, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def haversine(lon1, lat1, lon2, lat2):
    # Haversine formula to calculate distance in meters
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


# ----------------------
# Bus Routes
# ----------------------
class BusRouteListView(generics.ListCreateAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


class BusRouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


# ----------------------
# Trips for a Route
# ----------------------
class RouteTripsView(generics.ListAPIView):
    serializer_class = BusTripSerializer

    def get_queryset(self):
        route_id = self.kwargs['pk']
        return BusTrip.objects.filter(pattern__route_id=route_id)


class TripStopTimesView(generics.ListAPIView):
    serializer_class = BusTripStopTimeSerializer

    def get_queryset(self):
        trip_id = self.kwargs['trip_id']
        return BusTripStopTime.objects.filter(trip_id=trip_id).order_by('stop_order')


# ----------------------
# Fares
# ----------------------
class FareListView(generics.ListCreateAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer


# ----------------------
# Feedback
# ----------------------
class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


class RouteFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        route_id = self.kwargs['route_id']
        return Feedback.objects.filter(route_id=route_id)


# ----------------------
# User Registration
# ----------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ----------------------
# Live Bus Location
# ----------------------
@api_view(['GET'])
def live_bus_location(request):
    locations = LiveBusLocation.objects.all()
    return Response(LiveBusLocationSerializer(locations, many=True).data)


# ----------------------
# Favourites
# ----------------------
class FavouriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavouriteSerializer

    def get_queryset(self):
        return Favourite.objects.filter(user=self.request.user)


class FavouriteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FavouriteSerializer
    queryset = Favourite.objects.all()


# ----------------------
# Service Alerts
# ----------------------
class ActiveServiceAlertsView(generics.ListAPIView):
    serializer_class = ServiceAlertSerializer

    def get_queryset(self):
        now = timezone.now()
        return ServiceAlert.objects.filter(start_time__lte=now, end_time__gte=now)


# ----------------------
# Route Finder (Source → Destination)
# ----------------------
@api_view(['GET'])
def find_routes(request):
    source_name = request.GET.get('source')
    destination_name = request.GET.get('destination')

    try:
        # Filter routes that contain both source and destination
        routes = BusRoute.objects.filter(
            trip_patterns__pattern_stops__stop__name__icontains=source_name
        ).filter(
            trip_patterns__pattern_stops__stop__name__icontains=destination_name
        ).distinct()

        valid_routes = []

        for route in routes:
            # Check order: source should come before destination in any pattern
            for pattern in route.trip_patterns.all():
                try:
                    stops = list(pattern.pattern_stops.order_by('stop_order'))
                    source_index = next(i for i, ps in enumerate(stops) if ps.stop.name.lower() == source_name.lower())
                    dest_index = next(i for i, ps in enumerate(stops) if ps.stop.name.lower() == destination_name.lower())

                    if source_index < dest_index:
                        valid_routes.append({
                            "id": route.id,
                            "name": route.name,
                            "fare": route.fares.first().amount if route.fares.exists() else 20.00,
                            "has_transfer": False,  # You can extend transfer logic later
                            "source_coordinates": [stops[source_index].stop.latitude, stops[source_index].stop.longitude],
                            "destination_coordinates": [stops[dest_index].stop.latitude, stops[dest_index].stop.longitude],
                            "shape": route.shape.coordinates if hasattr(route, 'shape') else [],
                            "transfer_point": None
                        })
                        break  # Only add one pattern per route that satisfies source->destination

                except Stop.DoesNotExist:
                    continue

        return Response(valid_routes)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ----------------------
# ETA for a Stop
# ----------------------
@api_view(['GET'])
def stop_eta(request, stop_id):
    try:
        now = timezone.now().time()
        stop_times = BusTripStopTime.objects.filter(stop_id=stop_id, departure_time__gte=now).order_by('departure_time')
        serializer = BusTripStopTimeSerializer(stop_times, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_stops_with_routes(request):
    """
    Search stops by name and return all routes passing through them
    """
    query = request.GET.get('q', '')
    stops = Stop.objects.filter(name__icontains=query)
    data = []

    for stop in stops:
        routes = BusRoute.objects.filter(
            trip_patterns__pattern_stops__stop=stop
        ).distinct()

        stop_serializer = StopSerializer(stop)
        route_serializer = BusRouteSerializer(routes, many=True)

        data.append({
            'stop': stop_serializer.data,
            'routes': route_serializer.data
        })

    return Response(data)


@api_view(['GET'])
def find_direct_routes(request):
    """
    Return direct bus routes where source stop comes before destination stop
    """
    source_name = request.GET.get('source')
    dest_name = request.GET.get('destination')

    trip_patterns = TripPattern.objects.filter(
        pattern_stops__stop__name__icontains=source_name
    ).filter(
        pattern_stops__stop__name__icontains=dest_name
    ).distinct()

    direct_routes = []

    for pattern in trip_patterns:
        try:
            source_order = pattern.pattern_stops.get(stop__name__icontains=source_name).stop_order
            dest_order = pattern.pattern_stops.get(stop__name__icontains=dest_name).stop_order

            if source_order < dest_order:
                direct_routes.append(pattern.route)
        except TripPatternStop.DoesNotExist:
            continue

    serializer = BusRouteSerializer(direct_routes, many=True)
    return Response(serializer.data)

import math

@api_view(['GET'])
def nearby_stops(request):
    """
    Return stops within a given radius from provided latitude & longitude
    """
    try:
        lat = float(request.GET.get('lat'))
        lng = float(request.GET.get('lng'))
        radius = float(request.GET.get('radius', 500))  # meters

        stops = []
        for stop in Stop.objects.all():
            distance = haversine(lng, lat, stop.longitude, stop.latitude)
            if distance <= radius:
                stops.append({
                    'stop': StopSerializer(stop).data,
                    'distance_m': round(distance, 2)
                })

        return Response(stops)

    except Exception as e:
        return Response({'error': str(e)}, status=400)


def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate distance in meters between two coordinates using Haversine formula
    """
    R = 6371000  # radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


@api_view(['GET'])
def find_routes_with_transfer(request):
    """
    Find routes from source to destination using 1 transfer if needed
    """
    source_name = request.GET.get('source')
    dest_name = request.GET.get('destination')

    # Direct routes first
    direct_trip_patterns = TripPattern.objects.filter(
        pattern_stops__stop__name__icontains=source_name
    ).filter(
        pattern_stops__stop__name__icontains=dest_name
    ).distinct()

    direct_routes = []
    for pattern in direct_trip_patterns:
        try:
            source_order = pattern.pattern_stops.get(stop__name__icontains=source_name).stop_order
            dest_order = pattern.pattern_stops.get(stop__name__icontains=dest_name).stop_order
            if source_order < dest_order:
                direct_routes.append(pattern.route)
        except TripPatternStop.DoesNotExist:
            continue

    # Routes with 1 transfer
    transfer_routes = []
    source_patterns = TripPattern.objects.filter(pattern_stops__stop__name__icontains=source_name)
    dest_patterns = TripPattern.objects.filter(pattern_stops__stop__name__icontains=dest_name)

    for src_pattern in source_patterns:
        for dst_pattern in dest_patterns:
            # find common stop for transfer
            src_stops = set(src_pattern.stops.values_list('id', flat=True))
            dst_stops = set(dst_pattern.stops.values_list('id', flat=True))
            common_stops = src_stops.intersection(dst_stops)

            if common_stops:
                transfer_stop_id = list(common_stops)[0]
                transfer_routes.append({
                    'source_route': src_pattern.route.name,
                    'transfer_stop': Stop.objects.get(id=transfer_stop_id).name,
                    'destination_route': dst_pattern.route.name
                })

    return Response({
        'direct_routes': [route.name for route in direct_routes],
        'transfer_routes': transfer_routes
    })


from django.utils import timezone
from datetime import datetime, timedelta

@api_view(['GET'])
def stop_eta(request, stop_id):
    """
    Returns estimated arrival times (ETA) for all upcoming buses at a given stop.
    Uses both scheduled BusTripStopTime and live bus locations if available.
    """
    try:
        stop = Stop.objects.get(id=stop_id)
        now = timezone.localtime(timezone.now()).time()

        # 1️⃣ Scheduled trips
        upcoming_trips = BusTripStopTime.objects.filter(
            stop=stop,
            arrival_time__gte=now
        ).order_by('arrival_time')[:5]  # next 5 arrivals

        scheduled_eta = []
        for trip_time in upcoming_trips:
            scheduled_eta.append({
                'trip_id': trip_time.trip.id,
                'route': trip_time.trip.pattern.route.name,
                'scheduled_arrival': trip_time.arrival_time.strftime('%H:%M'),
                'scheduled_departure': trip_time.departure_time.strftime('%H:%M')
            })

        # 2️⃣ Live bus location adjustment (if available)
        live_locations = LiveBusLocation.objects.filter(
            trip__in=[trip_time.trip for trip_time in upcoming_trips]
        )

        live_eta = []
        for location in live_locations:
            trip = location.trip
            # Find the stop order for this stop
            try:
                stop_order = BusTripStopTime.objects.get(trip=trip, stop=stop).stop_order
            except BusTripStopTime.DoesNotExist:
                continue

            # Find the nearest stop ahead of current bus location
            upcoming_stops = BusTripStopTime.objects.filter(trip=trip, stop_order__gte=stop_order).order_by('stop_order')
            if upcoming_stops.exists():
                next_stop = upcoming_stops.first()
                # Simple ETA calculation: assume average speed ~30km/h
                distance = estimate_distance(location.latitude, location.longitude, next_stop.stop.latitude, next_stop.stop.longitude)
                eta_minutes = max(int(distance / 500), 1)  # 500 m per minute approximation
                eta_time = (datetime.combine(timezone.localtime(timezone.now()), now) + timedelta(minutes=eta_minutes)).time()
                live_eta.append({
                    'trip_id': trip.id,
                    'route': trip.pattern.route.name,
                    'estimated_arrival': eta_time.strftime('%H:%M')
                })

        return Response({
            'stop': StopSerializer(stop).data,
            'scheduled': scheduled_eta,
            'live_estimates': live_eta
        })

    except Stop.DoesNotExist:
        return Response({'error': 'Stop not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def estimate_distance(lat1, lon1, lat2, lon2):
    """
    Returns approximate distance in meters between two coordinates
    using Haversine formula.
    """
    import math
    R = 6371000  # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@api_view(['GET'])
def all_stops_coordinates(request):
    """
    Returns all stops with their names and coordinates.
    """
    stops = Stop.objects.all()
    data = [
        {
            'id': stop.id,
            'name': stop.name,
            'latitude': stop.latitude,
            'longitude': stop.longitude
        }
        for stop in stops
    ]
    return Response(data)
