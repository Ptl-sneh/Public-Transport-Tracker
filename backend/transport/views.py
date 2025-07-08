from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,permissions,status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer,StopSerializer,BusRouteSerializer,MetroRouteSerializer,ScheduleSerializer,FareSerializer,FeedbackSerializer
from .models import Stop,BusRoute,MetroRoute,Schedule,Fare,Feedback
from textblob import TextBlob


# Signup View
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    

class BusRouteList(generics.ListAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer

class MetroRouteList(generics.ListAPIView):
    queryset = MetroRoute.objects.all()
    print("MetroRoute queryset:", queryset)
    serializer_class = MetroRouteSerializer
    
class StopList(generics.ListAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    
class ScheduleList(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
class FareList(generics.ListAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer
    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_feedback(request):
    comment = request.data.get('comment', '')
    route_type = request.data.get('route_type')
    route_id = request.data.get('route_id')

    # Sentiment Analysis using TextBlob
    sentiment_analysis = TextBlob(comment)
    polarity = sentiment_analysis.sentiment.polarity
    if polarity > 0:
        sentiment = 'Positive'
    elif polarity < 0:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    feedback = Feedback.objects.create(
        user=request.user,
        route_type=route_type,
        route_id=route_id,
        comment=comment,
        sentiment=sentiment
    )

    serializer = FeedbackSerializer(feedback)
    return Response(serializer.data)


class FeedbackList(generics.ListAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error":"username and password is required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def find_routes(request):
    source = request.GET.get('source')
    destination = request.GET.get('destination')
    
    if not source or not destination:
        return Response({'error': 'Source and destination are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        source_stop = Stop.objects.get(name__icontains = source)
        destination_stop = Stop.objects.get(name__icontains = destination)
    except Stop.DoesNotExist:
        return Response({'error': 'Source or destination stop not found'}, status=status.HTTP_404_NOT_FOUND)

    bus_routes = BusRoute.objects.filter(stops=source_stop).filter(stops=destination_stop)
    bus_serializer = BusRouteSerializer(bus_routes, many = True)
    
    metro_routes = MetroRoute.objects.filter(stops = source_stop).filter(stops = destination_stop)
    metro_serializer  = MetroRouteSerializer(metro_routes , many = True)
    
    return Response({
        'bus_routes' : bus_serializer.data,
        'metro_routes' : metro_serializer.data
    })
    

    
    