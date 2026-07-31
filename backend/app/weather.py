from __future__ import annotations

import urllib.request
import json
from typing import Any, Dict, Optional

# WMO Weather interpretation codes (WW)
WEATHER_CODES = {
    0: ("Clear Sky", "wb_sunny", 1.0),
    1: ("Mainly Clear", "wb_sunny", 1.0),
    2: ("Partly Cloudy", "wb_cloudy", 0.98),
    3: ("Overcast", "cloud", 0.95),
    45: ("Fog", "cloud", 0.90),
    48: ("Depositing Rime Fog", "cloud", 0.90),
    51: ("Light Drizzle", "grain", 0.92),
    53: ("Moderate Drizzle", "grain", 0.88),
    55: ("Dense Drizzle", "grain", 0.82),
    61: ("Slight Rain", "rainy", 0.85),
    63: ("Moderate Rain", "rainy", 0.75),
    65: ("Heavy Rain", "thunderstorm", 0.60),
    71: ("Slight Snow", "ac_unit", 0.80),
    73: ("Moderate Snow", "ac_unit", 0.70),
    75: ("Heavy Snow", "ac_unit", 0.50),
    80: ("Slight Rain Showers", "rainy", 0.80),
    81: ("Moderate Rain Showers", "rainy", 0.70),
    82: ("Violent Rain Showers", "thunderstorm", 0.50),
    95: ("Thunderstorm", "thunderstorm", 0.40),
    96: ("Thunderstorm with Slight Hail", "thunderstorm", 0.30),
    99: ("Thunderstorm with Heavy Hail", "thunderstorm", 0.20),
}


import time

_WEATHER_CACHE: Dict[str, tuple[float, Dict[str, Any]]] = {}
CACHE_TTL_SECONDS = 600  # 10 minute cache

def get_location_name(lat: float, lon: float) -> str:
    """
    Performs reverse geocoding to resolve human-readable city/region name.
    """
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": "FIZFEED-Backend/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            address = data.get("address", {})
            city = address.get("city") or address.get("town") or address.get("municipality") or address.get("city_district") or address.get("county") or "Quezon City"
            country = address.get("country", "Philippines")
            return f"{city}, {country}"
    except Exception:
        return "Quezon City, Philippines"


def fetch_weather(lat: float = 14.5995, lon: float = 120.9842) -> Dict[str, Any]:
    """
    Fetches real-time weather & 7-day forecast from Open-Meteo API with in-memory caching.
    Default coords: Philippines (14.5995 N, 120.9842 E).
    """
    cache_key = f"{round(lat, 3)}_{round(lon, 3)}"
    now = time.time()

    if cache_key in _WEATHER_CACHE:
        cached_time, cached_data = _WEATHER_CACHE[cache_key]
        if now - cached_time < CACHE_TTL_SECONDS:
            return cached_data
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m"
        f"&hourly=temperature_2m,precipitation_probability,weather_code"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code"
        f"&timezone=auto"
    )

    location_name = get_location_name(lat, lon)

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FIZFEED-Backend/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())

        current = data.get("current", {})
        code = current.get("weather_code", 0)
        desc, icon, feed_factor = WEATHER_CODES.get(code, ("Unknown", "wb_cloudy", 1.0))

        temp_c = current.get("temperature_2m", 28.0)
        humidity = current.get("relative_humidity_2m", 75)
        wind_kmh = current.get("wind_speed_10m", 5.0)
        precip_mm = current.get("precipitation", 0.0)

        # Aquaculture Weather Risk Assessment
        if code in [65, 82, 95, 96, 99]:
            risk_level = "HIGH"
            advisory = "Heavy Rain/Storm Alert: Dissolved Oxygen drops rapidly. Reduce feed by 30-50% to prevent water fouling."
        elif code in [61, 63, 80, 81, 53, 55]:
            risk_level = "MODERATE"
            advisory = "Rainy Conditions: Monitor surface behavior. Moderate feed reduction advised."
        elif temp_c > 34.0:
            risk_level = "MODERATE"
            advisory = "High Temperature Alert: Water warm, oxygen solubility drops in afternoon. Feed during cooler hours."
        elif temp_c < 22.0:
            risk_level = "MODERATE"
            advisory = "Low Temperature Alert: Fish metabolism slows down. Feed smaller portions."
        else:
            risk_level = "LOW"
            advisory = "Optimal Weather: Normal feeding schedule recommended."

        res = {
            "latitude": lat,
            "longitude": lon,
            "location_name": location_name,
            "temperature_c": temp_c,
            "feels_like_c": current.get("apparent_temperature", temp_c),
            "humidity_percent": humidity,
            "wind_speed_kmh": wind_kmh,
            "precipitation_mm": precip_mm,
            "weather_code": code,
            "condition": desc,
            "icon": icon,
            "weather_feed_factor": feed_factor,
            "risk_level": risk_level,
            "aquaculture_advisory": advisory,
            "daily_forecast": data.get("daily", {}),
        }
        _WEATHER_CACHE[cache_key] = (now, res)
        return res
    except Exception as e:
        # Check if expired cache exists
        if cache_key in _WEATHER_CACHE:
            return _WEATHER_CACHE[cache_key][1]

        # Fallback payload in case of offline/network issues
        return {
            "latitude": lat,
            "longitude": lon,
            "location_name": location_name,
            "temperature_c": 28.0,
            "feels_like_c": 29.5,
            "humidity_percent": 75,
            "wind_speed_kmh": 5.0,
            "precipitation_mm": 0.0,
            "weather_code": 0,
            "condition": "Clear Sky (Cached)",
            "icon": "wb_sunny",
            "weather_feed_factor": 1.0,
            "risk_level": "LOW",
            "aquaculture_advisory": "Weather service offline. Using default baseline conditions.",
            "daily_forecast": {},
        }

