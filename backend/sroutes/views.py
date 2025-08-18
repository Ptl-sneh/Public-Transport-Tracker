from rest_framework import generics
from .models import BusRoute
from .serializers import BusRouteSerializer


class BusRouteListView(generics.ListCreateAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


class BusRouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer
