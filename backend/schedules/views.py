from django.shortcuts import render
from rest_framework.decorators import api_view
from sroutes.models import BusRoute
from froutes.models import BusTrip
from rest_framework.response import Response



# Create your views here.
@api_view(['GET'])
def bus_schedules(request):
    """
    Returns bus schedule with routeNo, startTime, endTime, frequency
    """
    schedules = []

    routes = BusRoute.objects.all()

    for route in routes:
        # Fetch all trips for this route
        trips = BusTrip.objects.filter(pattern__route=route).order_by("departure_time")

        if trips.exists():
            first_trip = trips.first()
            last_trip = trips.last()

            # Calculate frequency (rough estimate: total duration / number of trips)
            total_trips = trips.count()
            if total_trips > 1:
                start = first_trip.departure_time
                end = last_trip.departure_time
                total_minutes = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute)
                frequency = f"{round(total_minutes / (total_trips - 1))} mins"
            else:
                frequency = "N/A"
            schedules.append({
                'route_id':route.id,
                "routeNo": route.name,
                "startTime": first_trip.departure_time.strftime("%H:%M"),
                "endTime": last_trip.arrival_time.strftime("%H:%M"),
                "frequency": frequency
            })

    return Response(schedules)