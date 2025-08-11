from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,permissions,status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer,StopSerializer,BusRouteSerializer,ScheduleSerializer,FareSerializer,FeedbackSerializer,RouteStopSerializer
from .models import Stop,BusRoute,Schedule,Fare,Feedback,BusStatus,RouteStop,BusTrip
from textblob import TextBlob
import random
from django.contrib.contenttypes.models import ContentType

# Signup View
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BusRouteList(generics.ListAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer
    
class StopList(generics.ListAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    
class ScheduleList(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
class FareList(generics.ListAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer
    
class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer
    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_feedback(request):
    comment = request.data.get('comment', '')
    route_type = request.data.get('route_type')
    route_id = request.data.get('route_id')

    # Sentiment Analysis
    sentiment_analysis = TextBlob(comment)
    polarity = sentiment_analysis.sentiment.polarity
    if polarity > 0:
        sentiment = 'Positive'
    elif polarity < 0:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    # Determine route model
    if route_type == 'bus':
        model = BusRoute
    else:
        return Response({'error': 'Invalid route_type'}, status=400)

    if not model.objects.filter(id=route_id).exists():
        return Response({'error': 'Route not found'}, status=404)

    content_type = ContentType.objects.get_for_model(model)
    feedback = Feedback.objects.create(
        user=request.user,
        content_type=content_type,
        object_id=route_id,
        rating=request.data.get('rating', 0),
        comment=comment
    )

    serializer = FeedbackSerializer(feedback)
    return Response(serializer.data)


@api_view(['GET'])
def find_routes(request):
    source = request.GET.get('source')
    destination = request.GET.get('destination')
    
    if not source or not destination:
        return Response({'error': 'Source and destination are required'}, status=status.HTTP_404_NOT_FOUND)

    try:
        source_stop = Stop.objects.get(name__iexact=source)
        destination_stop = Stop.objects.get(name__iexact=destination)
    except Stop.DoesNotExist:
        return Response({'error': 'Source or destination stop not found'}, status=status.HTTP_404_NOT_FOUND)

    bus_routes = BusRoute.objects.filter(stops=source_stop).filter(stops=destination_stop)
    bus_serializer = BusRouteSerializer(bus_routes, many = True)
    
    return Response({
        'bus_routes' : bus_serializer.data,
    })
    
@api_view(['GET'])
def route_schedule(request,route_type,route_id):
    try:
        if route_type == 'bus':
            route = BusRoute.objects.get(id = route_id)
        else:
            return Response({'error':'Invalid Route type'},status = 400)

        schedules = Schedule.objects.filter(route_type=route_type,route_id=route_id).select_related('stop')
        schedule_data = ScheduleSerializer(schedules,many = True).data
        
        return Response({
            'route_name' : route.route_name,
            'schedules' : schedule_data
        })
    except(BusRoute.DoesNotExist):
        return Response({'error':'Not Found'},status=400)


@api_view(['GET'])
def live_bus_location(request):
    buses = []
    bus_routes = BusRoute.objects.all()

    for route in bus_routes:
        bus_status, created = BusStatus.objects.get_or_create(route=route)

        stops = [brs.stop for brs in RouteStop.objects.filter(bus=route).order_by('order')]

        if not stops:
            continue


        current_stop = stops[bus_status.stop_index]


        latitude = current_stop.latitude + random.uniform(-0.0005, 0.0005)
        longitude = current_stop.longitude + random.uniform(-0.0005, 0.0005)

        buses.append({
            'route_name': route.route_name,
            'current_stop': current_stop.name,
            'latitude': latitude,
            'longitude': longitude,
        })


        next_index = bus_status.stop_index + bus_status.direction

        if next_index >= len(stops):
            bus_status.direction = -1
            next_index = len(stops) - 2
        elif next_index < 0:
            bus_status.direction = 1
            next_index = 1

        bus_status.stop_index = next_index
        bus_status.save()

    return Response({'buses': buses})

@api_view(['GET'])
def all_stops_coordinates(request):
    stops = Stop.objects.all()
    serializer = StopSerializer(stops, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_stops(request):
    query = request.GET.get('q', '')
    stops = Stop.objects.filter(name__icontains=query)
    serializer = StopSerializer(stops, many=True)
    return Response(serializer.data)