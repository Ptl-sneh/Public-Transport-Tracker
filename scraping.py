# tracker/scraping/scrape_routes_and_stops.py

from selenium import webdriver
from bs4 import BeautifulSoup
import time
import json
import requests

# 🔐 Replace with your real Google Maps API Key
# GOOGLE_API_KEY = "AIzaSyBvy3o7PZVfa5bHQ-R6Pfd00MoR5XEvE00"

# def geocode_stop(stop_name):
#     """Geocode a stop using Google Maps API."""
#     url = "https://maps.googleapis.com/maps/api/geocode/json"
#     params = {
#         "address": f"{stop_name}, Ahmedabad",
#         "key": GOOGLE_API_KEY
#     }
#     response = requests.get(url, params=params).json()
#     if response['status'] == 'OK':
#         location = response['results'][0]['geometry']['location']
#         return location['lat'], location['lng']
#     return None, None

def scrape_brts_routes():
    # Start Chrome browser
    driver = webdriver.Chrome()
    driver.get("https://www.ahmedabadbrts.org/time-table/")

    time.sleep(3)  # Wait for JavaScript content to load
    first_route = driver.find_element("css selector", ".ng-scope .gridHead")
    first_route.click()

    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    # This selector might need adjustment based on actual structure
    # table_rows = soup.find_all("div",class_= "ng-binding")  # Skip header row
    modal = soup.find("div", class_="modal-dialog")   
    routes_data = []
    
    print(modal)
    
    stops = modal.find_all("div",class_="ng-binding")
    print (stops)
    stop_names = [stop.text.strip() for stop in stops]
    print("Stops:")
    for name in stop_names:
        print("-", name)

    # for row in table_rows:
    #     if len(row) >= 2:
    #         route_name = row.text.strip()
    #         stops_text = row[1].text.strip()

    #         stop_names = [s.strip() for s in stops_text.split("↔") if s.strip()]
    #         stops = []

    #         for stop in stop_names:
    #             lat, lng = geocode_stop(stop)
    #             stops.append({
    #                 "name": stop,
    #                 "latitude": lat,
    #                 "longitude": lng
    #             })
    #             time.sleep(0.1)  # prevent API quota issues

    #         routes_data.append({
    #             "route_name": route_name,
    #             "stops": stops
    #         })

    driver.quit()

    # Save to JSON
    # with open("transport/scraper/routes_data.json", "w", encoding="utf-8") as f:
    #     json.dump(routes_data, f, indent=2, ensure_ascii=False)

    print("✅ Successfully scraped BRTS route + stop data!")

scrape_brts_routes()
# lat , lon = geocode_stop("Maninagar")
# print(lat,lon)