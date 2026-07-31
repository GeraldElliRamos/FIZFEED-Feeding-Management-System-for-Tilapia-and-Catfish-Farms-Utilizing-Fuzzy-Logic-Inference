from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field


class FeedingRequest(BaseModel):
    fish_species: Literal["tilapia", "catfish"] = "tilapia"
    water_temperature_c: float = Field(..., ge=0, le=50, description="Temperature in °C from DS18B20")
    ph_level: float = Field(default=7.0, ge=0, le=14, description="pH level from pH-4502C")
    fish_age_months: float = Field(..., ge=0, description="Fish age in months")
    fish_count: int = Field(default=100, ge=1, description="Total number of fish in pond")
    avg_weight_g: float | None = Field(default=None, ge=0, description="Average weight per fish in grams (optional)")
    cumulative_feed_g: float | None = Field(default=None, ge=0, description="Cumulative feed consumed from load cell")
    sessions_per_day: int = Field(default=3, ge=1, le=6, description="Feeding sessions per day")
    latitude: float | None = Field(default=14.5995, description="Latitude for weather location")
    longitude: float | None = Field(default=120.9842, description="Longitude for weather location")


class DeviceTelemetry(BaseModel):
    device_id: str = Field(..., description="Unique device identifier")
    pond_id: str | None = Field(default=None, description="Associated pond identifier")
    temperature_c: float | None = Field(default=None, ge=-20, le=80, description="Water temperature in Celsius")
    ph_level: float | None = Field(default=None, ge=0, le=14, description="Water pH level")
    feed_weight_kg: float | None = Field(default=None, ge=0, description="Remaining feed weight in kilograms")
    feed_dispensed_kg: float | None = Field(default=None, ge=0, description="Feed dispensed in kilograms")
    device_status: Literal["online", "offline", "syncing", "maintenance"] = "online"
    battery_percent: int | None = Field(default=None, ge=0, le=100, description="Battery percentage")
    last_dispensed_at: str | None = Field(default=None, description="ISO timestamp of last feeding event")
    timestamp: str | None = Field(default=None, description="ISO timestamp of this telemetry reading")


class DeviceTelemetryResponse(BaseModel):
    ok: bool = True
    message: str
    telemetry: DeviceTelemetry
    alerts: list[str] = []


class DeviceStatusResponse(BaseModel):
    device_id: str
    status: str
    last_seen_at: str | None = None
    temperature_c: float | None = None
    ph_level: float | None = None
    feed_weight_kg: float | None = None
    battery_percent: int | None = None
    alerts: list[str] = []


class DeviceHealthResponse(BaseModel):
    status: str = Field(..., description="'ok' if registry contains device telemetry, 'no_data' otherwise")
    registered_devices_count: int
    active_devices_count: int
    devices: list[DeviceStatusResponse] = []



class WeatherInfo(BaseModel):
    latitude: float
    longitude: float
    location_name: str = "Quezon City, Philippines"
    temperature_c: float
    feels_like_c: float
    humidity_percent: float
    wind_speed_kmh: float
    precipitation_mm: float
    weather_code: int
    condition: str
    icon: str
    weather_feed_factor: float
    risk_level: str
    aquaculture_advisory: str



class RBESResult(BaseModel):
    growth_stage: str
    estimated_avg_weight_g: float
    feeding_rate_percent: float
    baseline_daily_feed_g: float
    baseline_session_feed_g: float
    temp_factor: float


class FuzzyResult(BaseModel):
    crisp_session_feed_g: float
    feed_adjustment_multiplier: float
    temp_fuzzy_set: dict[str, float]
    ph_fuzzy_set: dict[str, float]
    age_fuzzy_set: dict[str, float]


class ANFISResult(BaseModel):
    predicted_session_feed_g: float
    adaptation_factor: float
    status: str


class ThreeLayerRecommendationResponse(BaseModel):
    final_recommended_feed_g_per_session: float
    final_recommended_feed_g_per_day: float
    rbes: RBESResult
    fuzzy: FuzzyResult
    anfis: ANFISResult
    weather: WeatherInfo | None = None
    reasoning: list[str]
    ai_advisory: str | None = None
    ai_engine_on: bool = False
    inputs: FeedingRequest


