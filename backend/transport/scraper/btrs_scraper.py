import os
import sys
import django
import time
from bs4 import BeautifulSoup
from selenium import webdriver

# Step 1: Add path to /public_transport/backend to sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))                         # /public_transport/backend/transport/scraper/
BACKEND_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "../../"))              # /public_transport/backend/
sys.path.append(BACKEND_DIR)

# Step 2: Set the correct Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Step 3: Setup Django
django.setup()

# Step 4: Import model
from transport.models import BusRoute

# Step 5: Scrape
driver = webdriver.Chrome()
driver.get("https://www.ahmedabadbrts.org/time-table/")
time.sleep(5)

html = driver.page_source
soup = BeautifulSoup(driver.page_source, "html.parser")
routes = soup.find_all("div", class_="ng-binding")

for route in routes:
    route_name = route.text.strip()
    BusRoute.objects.update_or_create(
        route_name=route_name,
        defaults={"route_name": route_name}
    )

driver.quit()
print("✅ Scraping and saving completed.")
