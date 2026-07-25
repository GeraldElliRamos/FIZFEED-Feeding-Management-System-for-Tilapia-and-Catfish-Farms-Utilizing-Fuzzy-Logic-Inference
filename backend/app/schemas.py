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
    reasoning: list[str]
    inputs: FeedingRequest
