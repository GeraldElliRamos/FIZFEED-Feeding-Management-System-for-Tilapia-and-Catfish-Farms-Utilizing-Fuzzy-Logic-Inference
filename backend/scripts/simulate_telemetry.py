"""
FIZFEED Virtual Telemetry Simulator
------------------------------------
Simulates physical IoT device hardware sending periodic sensor telemetry payload
(DS18B20 water temp, pH-4502C probe, load cell feed weight, battery voltage).
"""

import time
import random
import argparse
from datetime import datetime, timezone
import urllib.request
import json

DEFAULT_ENDPOINT = "http://127.0.0.1:8000/telemetry"

DEVICE_PROFILES = [
    {
        "device_id": "FIZFEED-DEV-001",
        "pond_id": "Pond-1-Tilapia",
        "temp_base": 28.5,
        "ph_base": 7.4,
        "feed_base_kg": 15.0,
        "battery_base": 95,
    },
    {
        "device_id": "FIZFEED-DEV-002",
        "pond_id": "Pond-2-Catfish",
        "temp_base": 27.0,
        "ph_base": 6.8,
        "feed_base_kg": 8.5,
        "battery_base": 88,
    },
]


def send_telemetry(endpoint: str, device: dict):
    # Add random realistic telemetry noise
    temp = round(device["temp_base"] + random.uniform(-0.8, 0.8), 2)
    ph = round(device["ph_base"] + random.uniform(-0.15, 0.15), 2)
    feed_kg = max(0.0, round(device["feed_base_kg"] - random.uniform(0.0, 0.1), 2))
    device["feed_base_kg"] = feed_kg
    battery = max(5, device["battery_base"] - random.randint(0, 1))
    device["battery_base"] = battery

    payload = {
        "device_id": device["device_id"],
        "pond_id": device["pond_id"],
        "temperature_c": temp,
        "ph_level": ph,
        "feed_weight_kg": feed_kg,
        "feed_dispensed_kg": 0.25,
        "device_status": "online",
        "battery_percent": battery,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "FIZFEED-IoT-Simulator/1.0"},
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_body = json.loads(response.read().decode())
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Sent telemetry for {device['device_id']}: {payload['temperature_c']}°C, pH {payload['ph_level']} -> Status 200 OK")
            if res_body.get("alerts"):
                print(f"   ⚠️ ALERTS: {res_body['alerts']}")
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Failed sending telemetry for {device['device_id']}: {e}")


def main():
    parser = argparse.ArgumentParser(description="FIZFEED Virtual Telemetry Simulator")
    parser.add_argument("--url", default=DEFAULT_ENDPOINT, help="Telemetry API Endpoint")
    parser.add_argument("--interval", type=int, default=5, help="Simulation loop interval in seconds")
    parser.add_argument("--once", action="store_true", help="Send single burst of telemetry and exit")

    args = parser.parse_args()

    print(f"🚀 FIZFEED Telemetry Simulator Started")
    print(f"Target URL: {args.url}")
    print(f"Simulated Devices: {len(DEVICE_PROFILES)}")
    print("-" * 50)

    if args.once:
        for dev in DEVICE_PROFILES:
            send_telemetry(args.url, dev)
        return

    while True:
        for dev in DEVICE_PROFILES:
            send_telemetry(args.url, dev)
        time.sleep(args.interval)


if __name__ == "__main__":
    main()
