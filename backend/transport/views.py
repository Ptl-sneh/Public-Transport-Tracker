from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from geopy.distance import geodesic
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

from geopy.distance import geodesic

def get_shape_segment(shape_coords, source_coord, dest_coord):
    # Find index of the shape point closest to source
    start_idx = min(range(len(shape_coords)), key=lambda i: geodesic(shape_coords[i], source_coord).meters)
    # Find index of the shape point closest to destination
    end_idx = min(range(len(shape_coords)), key=lambda i: geodesic(shape_coords[i], dest_coord).meters)

    if start_idx > end_idx:
        start_idx, end_idx = end_idx, start_idx

    return shape_coords[start_idx:end_idx + 1]

@api_view(['GET'])
def find_routes(request):
    source_name = request.GET.get('source', '').strip()
    destination_name = request.GET.get('destination', '').strip()

    if not source_name or not destination_name:
        return Response({"error": "Source and destination are required."}, status=400)

    valid_routes = []

    try:
        # STEP 1 — DIRECT ROUTES
        routes = BusRoute.objects.filter(
            trip_patterns__pattern_stops__stop__name__icontains=source_name
        ).filter(
            trip_patterns__pattern_stops__stop__name__icontains=destination_name
        ).distinct()

        for route in routes:
            for pattern in route.trip_patterns.all():
                stops = list(pattern.pattern_stops.order_by('stop_order'))

                try:
                    source_index = next(i for i, ps in enumerate(stops) if ps.stop.name.lower() == source_name.lower())
                    dest_index = next(i for i, ps in enumerate(stops) if ps.stop.name.lower() == destination_name.lower())
                except StopIteration:
                    continue

                if source_index < dest_index:
                    shape_coords = []
                    if getattr(route, 'shape', None) and getattr(route.shape, 'coordinates', None):
                        try:
                            shape_coords = get_shape_segment(
                                route.shape.coordinates,
                                [stops[source_index].stop.latitude, stops[source_index].stop.longitude],
                                [stops[dest_index].stop.latitude, stops[dest_index].stop.longitude]
                            )
                        except Exception:
                            pass

                    valid_routes.append({
                        "id": route.id,
                        "name": route.name,
                        "fare": route.fares.first().amount if route.fares.exists() else 20.00,
                        "has_transfer": False,
                        "source_coordinates": [stops[source_index].stop.latitude, stops[source_index].stop.longitude],
                        "destination_coordinates": [stops[dest_index].stop.latitude, stops[dest_index].stop.longitude],
                        "shape": shape_coords,
                        "transfer_point": None
                    })
                    break

        # STEP 2 — ONE TRANSFER
        if not valid_routes:
            source_routes = BusRoute.objects.filter(
                trip_patterns__pattern_stops__stop__name__icontains=source_name
            ).distinct()

            dest_routes = BusRoute.objects.filter(
                trip_patterns__pattern_stops__stop__name__icontains=destination_name
            ).distinct()

            found_transfer = False

            for sr in source_routes:
                for sp in sr.trip_patterns.all():
                    source_stops = list(sp.pattern_stops.order_by('stop_order'))

                    try:
                        source_idx = next(i for i, ps in enumerate(source_stops) if ps.stop.name.lower() == source_name.lower())
                    except StopIteration:
                        continue

                    for ps in source_stops[source_idx + 1:]:
                        transfer_stop_name = ps.stop.name.lower()

                        for dr in dest_routes:
                            for dp in dr.trip_patterns.all():
                                dest_stops = list(dp.pattern_stops.order_by('stop_order'))

                                try:
                                    transfer_idx = next(i for i, dps in enumerate(dest_stops) if dps.stop.name.lower() == transfer_stop_name)
                                    final_idx = next(i for i, dps in enumerate(dest_stops) if dps.stop.name.lower() == destination_name.lower())
                                except StopIteration:
                                    continue

                                if transfer_idx < final_idx:
                                    # Get shapes for both legs
                                    leg1_shape, leg2_shape = [], []

                                    if getattr(sr, 'shape', None) and getattr(sr.shape, 'coordinates', None):
                                        try:
                                            leg1_shape = get_shape_segment(
                                                sr.shape.coordinates,
                                                [source_stops[source_idx].stop.latitude, source_stops[source_idx].stop.longitude],
                                                [ps.stop.latitude, ps.stop.longitude]
                                            )
                                        except Exception:
                                            pass

                                    if getattr(dr, 'shape', None) and getattr(dr.shape, 'coordinates', None):
                                        try:
                                            leg2_shape = get_shape_segment(
                                                dr.shape.coordinates,
                                                [dest_stops[transfer_idx].stop.latitude, dest_stops[transfer_idx].stop.longitude],
                                                [dest_stops[final_idx].stop.latitude, dest_stops[final_idx].stop.longitude]
                                            )
                                        except Exception:
                                            pass

                                    valid_routes.append({
                                        "id": f"{sr.id}-{dr.id}",
                                        "name": f"{sr.name} → {dr.name}",
                                        "fare": 40.00,
                                        "has_transfer": True,
                                        "source_coordinates": [source_stops[source_idx].stop.latitude, source_stops[source_idx].stop.longitude],
                                        "destination_coordinates": [dest_stops[final_idx].stop.latitude, dest_stops[final_idx].stop.longitude],
                                        "transfer_coordinates": [ps.stop.latitude, ps.stop.longitude],
                                        "shape": [leg1_shape, leg2_shape],  # send both legs
                                        "transfer_point": ps.stop.name
                                    })
                                    found_transfer = True
                                    break
                            if found_transfer:
                                break
                        if found_transfer:
                            break
                    if found_transfer:
                        break

        return Response(valid_routes)

    except Exception as e:
        import traceback
        print("ERROR in find_routes:", str(e))
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)



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


@api_view(['GET'])
def nearby_stops(request):
    try:
        lat = float(request.GET.get('lat'))
        lng = float(request.GET.get('lng'))
        radius = float(request.GET.get('radius', 1000))  # default radius in meters

        user_location = (lat, lng)
        stops = []

        for stop in Stop.objects.all():
            stop_location = (stop.latitude, stop.longitude)
            distance = geodesic(user_location, stop_location).meters  # distance in meters
            if distance <= radius:
                stops.append({
                    'stop': StopSerializer(stop).data,
                    'distance_m': round(distance)
                })

        return Response(stops)

    except Exception as e:
        return Response({'error': str(e)}, status=400)


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
