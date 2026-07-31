from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    DeviceHealthResponse,
    DeviceStatusResponse,
    DeviceTelemetry,
    DeviceTelemetryResponse,
    FeedingRequest,
    ThreeLayerRecommendationResponse,
    WeatherInfo,
)
from .rbes import compute_rbes
from .fuzzy_mamdani import compute_fuzzy
from .anfis import compute_anfis
from .weather import fetch_weather
from .gemini import generate_ai_insight, is_ai_engine_on

DEVICE_REGISTRY: dict[str, DeviceTelemetry] = {}

app = FastAPI(
    title="FIZFEED Intelligent Feeding Decision API",
    version="1.2.0",
    description="Four-component decision-making API combining Rule-Based Expert System (RBES), Mamdani Fuzzy Logic (FLIA), ANFIS Prediction Module, Real-Time Weather Intelligence, and Gemini AI Advisory.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_device_alerts(telemetry: DeviceTelemetry) -> list[str]:
    alerts: list[str] = []

    if telemetry.temperature_c is not None and (telemetry.temperature_c < 22 or telemetry.temperature_c > 34):
        alerts.append("Water temperature is outside the preferred feeding range.")

    if telemetry.ph_level is not None and (telemetry.ph_level < 6.5 or telemetry.ph_level > 8.5):
        alerts.append("pH is outside the preferred range and should be checked.")

    if telemetry.feed_weight_kg is not None and telemetry.feed_weight_kg < 2:
        alerts.append("Feed stock is low. Consider refilling soon.")

    if telemetry.battery_percent is not None and telemetry.battery_percent <= 20:
        alerts.append("Device battery is low.")

    if telemetry.device_status != "online":
        alerts.append(f"Device is currently marked as {telemetry.device_status}.")

    return alerts


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "system": "FIZFEED 4-Component Decision Engine + Weather Engine"}


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "FIZFEED Intelligent Feeding Decision API",
        "components": [
            "Rule-Based Expert System (RBES)",
            "Fuzzy Logic Inference Algorithm (FLIA)",
            "ANFIS Prediction Module",
            "Weather Engine",
        ],
        "version": "1.2.0",
    }


@app.get("/devices/health", response_model=DeviceHealthResponse)
def devices_health() -> DeviceHealthResponse:
    devices_list: list[DeviceStatusResponse] = []
    active_count = 0

    for dev_id, telemetry in DEVICE_REGISTRY.items():
        is_online = telemetry.device_status == "online"
        if is_online:
            active_count += 1

        devices_list.append(
            DeviceStatusResponse(
                device_id=dev_id,
                status=telemetry.device_status,
                last_seen_at=telemetry.timestamp,
                temperature_c=telemetry.temperature_c,
                ph_level=telemetry.ph_level,
                feed_weight_kg=telemetry.feed_weight_kg,
                battery_percent=telemetry.battery_percent,
                alerts=build_device_alerts(telemetry),
            )
        )

    has_data = len(DEVICE_REGISTRY) > 0
    return DeviceHealthResponse(
        status="ok" if has_data else "no_data",
        registered_devices_count=len(DEVICE_REGISTRY),
        active_devices_count=active_count,
        devices=devices_list,
    )


@app.get("/weather")
def get_weather_endpoint(
    lat: float = Query(default=14.5995, description="Latitude"),
    lon: float = Query(default=120.9842, description="Longitude"),
) -> dict:
    return fetch_weather(lat, lon)


@app.post("/telemetry", response_model=DeviceTelemetryResponse)
def post_telemetry(payload: DeviceTelemetry) -> DeviceTelemetryResponse:
    DEVICE_REGISTRY[payload.device_id] = payload
    alerts = build_device_alerts(payload)

    return DeviceTelemetryResponse(
        message="Telemetry received successfully.",
        telemetry=payload,
        alerts=alerts,
    )


@app.get("/devices/{device_id}/status", response_model=DeviceStatusResponse)
def get_device_status(device_id: str) -> DeviceStatusResponse:
    telemetry = DEVICE_REGISTRY.get(device_id)
    if telemetry is None:
        return DeviceStatusResponse(device_id=device_id, status="offline")

    return DeviceStatusResponse(
        device_id=device_id,
        status=telemetry.device_status,
        last_seen_at=telemetry.timestamp,
        temperature_c=telemetry.temperature_c,
        ph_level=telemetry.ph_level,
        feed_weight_kg=telemetry.feed_weight_kg,
        battery_percent=telemetry.battery_percent,
        alerts=build_device_alerts(telemetry),
    )


@app.post("/recommendation", response_model=ThreeLayerRecommendationResponse)
def get_recommendation(request: FeedingRequest) -> ThreeLayerRecommendationResponse:
    # Layer 1: Rule-Based Expert System (RBES)
    rbes_res = compute_rbes(request)

    # Layer 2: Fuzzy Logic Inference Algorithm (Mamdani + Centroid)
    fuzzy_res = compute_fuzzy(request, rbes_res.baseline_session_feed_g)

    # Layer 3: ANFIS Prediction Module
    anfis_res = compute_anfis(request, fuzzy_res.crisp_session_feed_g)

    # Layer 4: Weather Engine Adjustment
    lat = request.latitude or 14.5995
    lon = request.longitude or 120.9842
    weather_data = fetch_weather(lat, lon)
    weather_info = WeatherInfo(**{k: v for k, v in weather_data.items() if k != "daily_forecast"})

    # Apply weather feeding factor adjustment
    weather_adjusted_session_g = round(anfis_res.predicted_session_feed_g * weather_info.weather_feed_factor, 2)
    final_session_g = max(0.0, weather_adjusted_session_g)
    final_daily_g = round(final_session_g * request.sessions_per_day, 2)

    # Build human-readable biological reasoning
    reasoning = [
        f"Fish classified as '{rbes_res.growth_stage}' stage with estimated avg weight of {rbes_res.estimated_avg_weight_g}g per fish.",
        f"RBES baseline feed rate: {rbes_res.feeding_rate_percent}% body weight ({rbes_res.baseline_session_feed_g}g/session).",
        f"Mamdani Fuzzy Inference applied multiplier of {fuzzy_res.feed_adjustment_multiplier}x based on temp={request.water_temperature_c}°C and pH={request.ph_level}.",
        f"ANFIS module status: {anfis_res.status}.",
        f"Weather Factor ({weather_info.condition}): {weather_info.weather_feed_factor}x multiplier applied. Advisory: {weather_info.aquaculture_advisory}",
    ]

    # Generate Groq AI Advisory
    ai_advisory = generate_ai_insight(
        species=request.fish_species,
        temp_c=request.water_temperature_c,
        ph=request.ph_level,
        fish_count=request.fish_count,
        growth_stage=rbes_res.growth_stage,
        recommended_g_per_session=final_session_g,
        recommended_g_per_day=final_daily_g,
        weather_condition=weather_info.condition,
        weather_advisory=weather_info.aquaculture_advisory,
    )

    return ThreeLayerRecommendationResponse(
        final_recommended_feed_g_per_session=final_session_g,
        final_recommended_feed_g_per_day=final_daily_g,
        rbes=rbes_res,
        fuzzy=fuzzy_res,
        anfis=anfis_res,
        weather=weather_info,
        reasoning=reasoning,
        ai_advisory=ai_advisory,
        ai_engine_on=is_ai_engine_on(),
        inputs=request,
    )
