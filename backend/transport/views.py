from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
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

from datetime import datetime


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
    print('query',query)
    stops = Stop.objects.filter(name__icontains=query).distinct()
    print(stops)
    return Response(StopSerializer(stops, many=True).data)


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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favourite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # ✅ source & destination come from frontend

class FavouriteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FavouriteSerializer
    queryset = Favourite.objects.all()
    
class FavouriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favourite.objects.filter(user=self.request.user)


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


def get_shape_segment(shape_coords, source_coord, dest_coord):
    start_idx = min(range(len(shape_coords)), key=lambda i: geodesic(shape_coords[i], source_coord).meters)
    end_idx = min(range(len(shape_coords)), key=lambda i: geodesic(shape_coords[i], dest_coord).meters)
    if start_idx > end_idx:
        start_idx, end_idx = end_idx, start_idx
    return shape_coords[start_idx:end_idx + 1]

@api_view(['GET'])
def find_routes(request):
    source_name = request.GET.get('source', '').strip()
    destination_name = request.GET.get('destination', '').strip()
    selected_time_str = request.GET.get('time', '')  # HH:MM
    
    print(selected_time_str)

    if not source_name or not destination_name:
        return Response({"error": "Source and destination are required."}, status=400)

    # Parse user-selected time
    try:
        if selected_time_str:
            selected_time = datetime.strptime(selected_time_str, '%H:%M').time()
            print('if st',selected_time)
        else:
            selected_time = timezone.localtime(timezone.now()).time()
            print('else st',selected_time)
    except:
        selected_time = timezone.localtime(timezone.now()).time()
        print('except st',selected_time)
        

    print('st',selected_time)
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
                    # Find next 2–3 buses after selected_time
                    upcoming_trips = BusTripStopTime.objects.filter(
                        trip__pattern=pattern,
                        stop=stops[source_index].stop,
                        departure_time__gte=selected_time
                    ).order_by('departure_time')[:3]

                    next_buses = [
                        {
                            'trip_id': trip.trip.id,
                            'departure_time': trip.departure_time.strftime('%H:%M'),
                            'arrival_time': trip.arrival_time.strftime('%H:%M')
                        } for trip in upcoming_trips
                    ]

                    shape_coords = []
                    if getattr(route, 'shape', None) and getattr(route.shape, 'coordinates', None):
                        try:
                            shape_coords = get_shape_segment(
                                route.shape.coordinates,
                                [stops[source_index].stop.latitude, stops[source_index].stop.longitude],
                                [stops[dest_index].stop.latitude, stops[dest_index].stop.longitude]
                            )
                        except:
                            pass

                    valid_routes.append({
                        "id": route.id,
                        "name": route.name,
                        "fare": route.fares.first().amount if route.fares.exists() else 20.00,
                        "has_transfer": False,
                        "source_coordinates": [stops[source_index].stop.latitude, stops[source_index].stop.longitude],
                        "destination_coordinates": [stops[dest_index].stop.latitude, stops[dest_index].stop.longitude],
                        "shape": shape_coords,
                        "transfer_point": None,
                        "next_buses": next_buses
                    })
                    break

        # STEP 2 — ONE TRANSFER ROUTES
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
                                    # Find next buses for first leg
                                    leg1_trips = BusTripStopTime.objects.filter(
                                        trip__pattern=sp,
                                        stop=source_stops[source_idx].stop,
                                        departure_time__gte=selected_time
                                    ).order_by('departure_time')[:3]

                                    leg1_buses = [
                                        {
                                            'trip_id': t.trip.id,
                                            'departure_time': t.departure_time.strftime('%H:%M'),
                                            'arrival_time': t.arrival_time.strftime('%H:%M')
                                        } for t in leg1_trips
                                    ]

                                    # Find next buses for second leg
                                    leg2_trips = BusTripStopTime.objects.filter(
                                        trip__pattern=dp,
                                        stop=dest_stops[transfer_idx].stop,
                                        departure_time__gte=selected_time
                                    ).order_by('departure_time')[:3]

                                    leg2_buses = [
                                        {
                                            'trip_id': t.trip.id,
                                            'departure_time': t.departure_time.strftime('%H:%M'),
                                            'arrival_time': t.arrival_time.strftime('%H:%M')
                                        } for t in leg2_trips
                                    ]

                                    # Shapes for both legs
                                    leg1_shape, leg2_shape = [], []
                                    if getattr(sr, 'shape', None) and getattr(sr.shape, 'coordinates', None):
                                        try:
                                            leg1_shape = get_shape_segment(
                                                sr.shape.coordinates,
                                                [source_stops[source_idx].stop.latitude, source_stops[source_idx].stop.longitude],
                                                [ps.stop.latitude, ps.stop.longitude]
                                            )
                                        except:
                                            pass

                                    if getattr(dr, 'shape', None) and getattr(dr.shape, 'coordinates', None):
                                        try:
                                            leg2_shape = get_shape_segment(
                                                dr.shape.coordinates,
                                                [dest_stops[transfer_idx].stop.latitude, dest_stops[transfer_idx].stop.longitude],
                                                [dest_stops[final_idx].stop.latitude, dest_stops[final_idx].stop.longitude]
                                            )
                                        except:
                                            pass

                                    valid_routes.append({
                                        "id": sr.id,
                                        "second_leg_id": dr.id,
                                        "name": f"{sr.name} → {dr.name}",
                                        "fare": 40.00,
                                        "has_transfer": True,
                                        "source_coordinates": [source_stops[source_idx].stop.latitude, source_stops[source_idx].stop.longitude],
                                        "destination_coordinates": [dest_stops[final_idx].stop.latitude, dest_stops[final_idx].stop.longitude],
                                        "transfer_coordinates": [ps.stop.latitude, ps.stop.longitude],
                                        "transfer_point": ps.stop.name,
                                        "shape": [leg1_shape, leg2_shape],
                                        "next_buses": leg1_buses + leg2_buses  # combined list
                                    })
                                    found_transfer = True
                                    break
                            if found_transfer: break
                        if found_transfer: break
                    if found_transfer: break

        return Response(valid_routes)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)



# ----------------------
# ETA for a Stop
# ----------------------


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
