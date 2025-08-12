from datetime import datetime, timedelta
import os
import json
from django.core.management.base import BaseCommand
from transport.models import Stop, BusRoute, TripPattern, TripPatternStop, BusTrip

class Command(BaseCommand):
    help = "Load all route JSONs in transport/data and auto-generate multiple trips"

    def handle(self, *args, **kwargs):
        base_dir = os.path.join("transport", "data")

        if not os.path.exists(base_dir):
            self.stderr.write(self.style.ERROR(f"❌ Data folder not found: {base_dir}"))
            return

        json_files = [f for f in os.listdir(base_dir) if f.endswith(".json")]

        if not json_files:
            self.stderr.write(self.style.ERROR("❌ No JSON files found in the data folder"))
            return

        for json_file in json_files:
            file_path = os.path.join(base_dir, json_file)
            with open(file_path, "r", encoding="utf-8") as f:
                stops_data = sorted(json.load(f)["Data"], key=lambda x: x["sequenceNumber"])

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

            # Create trip pattern
            pattern_obj, _ = TripPattern.objects.get_or_create(route=route_obj)
            TripPatternStop.objects.filter(pattern=pattern_obj).delete()
            for order, stop in enumerate(stop_objects, start=1):
                TripPatternStop.objects.create(
                    pattern=pattern_obj,
                    stop=stop,
                    stop_order=order
                )

            # Generate multiple trips
            start_time = datetime.strptime("05:00", "%H:%M")
            trip_interval = timedelta(minutes=10)  # Every 10 minutes
            trip_duration = timedelta(minutes=45)  # Example route takes 45 mins

            for i in range(120):  # 120 trips
                departure_time = (start_time + i * trip_interval).strftime("%H:%M")
                arrival_time = (start_time + i * trip_interval + trip_duration).strftime("%H:%M")

                BusTrip.objects.get_or_create(
                    pattern=pattern_obj,
                    departure_time=departure_time,
                    arrival_time=arrival_time
                )

            self.stdout.write(self.style.SUCCESS(f"✅ Created route {route_code} with 120 trips"))

        self.stdout.write(self.style.SUCCESS("🎉 All routes processed successfully!"))
