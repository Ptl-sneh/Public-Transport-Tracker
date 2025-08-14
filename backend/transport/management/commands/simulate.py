from django.core.management.base import BaseCommand
from transport.models import LiveBusLocation
from django.utils import timezone
import random
import time

class Command(BaseCommand):
    help = "Simulates bus movement in Ahmedabad without trip linking"

    def handle(self, *args, **kwargs):
        # Starting point: Ahmedabad
        lat, lon = 23.0225, 72.5714

        self.stdout.write(self.style.SUCCESS("Starting bus movement simulation..."))
        try:
            while True:
                # Random small movement
                lat += random.uniform(-0.001, 0.001)
                lon += random.uniform(-0.001, 0.001)

                # Create new location record
                LiveBusLocation.objects.create(
                    latitude=lat,
                    longitude=lon,
                    timestamp=timezone.now()
                )

                self.stdout.write(self.style.SUCCESS(f"Added bus location: {lat}, {lon}"))
                time.sleep(5)  # update every 5 sec

        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("\nSimulation stopped."))
