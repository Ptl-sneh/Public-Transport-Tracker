from rest_framework import generics
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.response import Response
from geopy.distance import geodesic
from rest_framework.permissions import AllowAny , IsAuthenticated
from .models import Stop
from .serializers import StopSerializer,UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class StopListView(generics.ListCreateAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class StopDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

@api_view(['GET'])
def search_stops(request):
    query = request.GET.get('q', '')
    stops = Stop.objects.filter(name__icontains=query).distinct()
    return Response(StopSerializer(stops, many=True).data)

@api_view(['GET'])
def nearby_stops(request):
    try:
        lat = float(request.GET.get('lat'))
        lng = float(request.GET.get('lng'))
        radius = float(request.GET.get('radius', 1000))  # meters

        user_location = (lat, lng)
        stops = []

        for stop in Stop.objects.all():
            stop_location = (stop.latitude, stop.longitude)
            distance = geodesic(user_location, stop_location).meters
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    print(user)
    return Response({
        "username": user.username,
        "email": user.email,
        # add more if needed
    })
