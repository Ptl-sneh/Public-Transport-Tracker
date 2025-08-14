from datetime import datetime, timedelta
import os
import json
from django.core.management.base import BaseCommand
from transport.models import Stop, BusRoute, TripPattern, TripPatternStop, BusTrip, BusTripStopTime , RouteShape

class Command(BaseCommand):
    help = "Load route once, generate multiple trips with per-stop timings"

    def handle(self, *args, **kwargs):
        base_dir = os.path.join("transport", "data")
        file_path = os.path.join(base_dir, "s.json")  # Base file for stops

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            # print('HIiiiiiiiii', data['Data'])
            stops_data = sorted(data["Data"], key=lambda x: x["sequenceNumber"])
        
        
            
        # Create stops
        stop_objects = []
        for stop_info in stops_data:
            stop_obj, _ = Stop.objects.get_or_create(
                name=stop_info["stopName"],
                latitude=stop_info["position"]["stopLatitude"],
                longitude=stop_info["position"]["stopLongitude"]
            )
            stop_objects.append(stop_obj)

        # Create route
        route_code = stops_data[0]["routeCode"]
        route_obj, _ = BusRoute.objects.get_or_create(
            name=route_code,
            start_stop=stop_objects[0],
            end_stop=stop_objects[-1]
        )
        
        
        shape_coords = []    
        shape = data['Data'][0]['routeFlow']

        coords = shape[len('LINESTRING ('):-1]
        pair = coords.split(', ')
        for i in pair:
            lng, lat = i.split(' ')
            shape_coords.append([lat,lng])
            
        RouteShape.objects.update_or_create(
            route = route_obj,
            defaults={'coordinates':shape_coords}
        )
        

        # Create trip pattern
        pattern_obj, _ = TripPattern.objects.get_or_create(route=route_obj)
        TripPatternStop.objects.filter(pattern=pattern_obj).delete()
        for order, stop in enumerate(stop_objects, start=1):
            TripPatternStop.objects.create(
                pattern=pattern_obj,
                stop=stop,
                stop_order=order
            )

        # Timing configuration
        start_time = datetime.strptime("07:25", "%H:%M")
        trip_interval = timedelta(minutes=10)  # Every 10 minutes
        time_per_stop = timedelta(minutes=3)   # Example gap between stops
        dwell_time = timedelta(seconds=30)     # Stop waiting time

        total_stops_time = time_per_stop * (len(stop_objects) - 1) + dwell_time
        trip_duration = total_stops_time

        # Generate trips
        for i in range(50):  # 106 trips
            departure_time = (start_time + i * trip_interval).time()
            arrival_time = (datetime.combine(datetime.today(), departure_time) + trip_duration).time()

            trip, _ = BusTrip.objects.get_or_create(
                pattern=pattern_obj,
                departure_time=departure_time,
                arrival_time=arrival_time
            )

            # Clear any existing stop times for this trip (avoid duplicates if re-run)
            BusTripStopTime.objects.filter(trip=trip).delete()

            # Create stop-level times
            current_time = datetime.combine(datetime.today(), departure_time)
            for order, stop in enumerate(stop_objects, start=1):
                BusTripStopTime.objects.create(
                    trip=trip,
                    stop=stop,
                    stop_order=order,
                    arrival_time=current_time.time(),
                    departure_time=(current_time + dwell_time).time()
                )
                current_time += time_per_stop

        self.stdout.write(self.style.SUCCESS(f"✅ Created route {route_code} with 106 trips and stop-wise timings"))
