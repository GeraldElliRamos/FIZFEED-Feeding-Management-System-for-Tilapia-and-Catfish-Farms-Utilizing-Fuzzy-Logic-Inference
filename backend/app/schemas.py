from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    fish_species: Literal["tilapia", "catfish"] = "tilapia"
    water_temperature_c: float = Field(..., ge=0, le=45)
    fish_age_weeks: float = Field(..., ge=0)
    average_fish_weight_g: float = Field(..., ge=0)
    pond_stock_kg: float | None = Field(default=None, ge=0)
    current_biomass_kg: float | None = Field(default=None, ge=0)


class RecommendationResponse(BaseModel):
    recommended_feed_kg_per_day: float
    feeding_frequency_per_day: int
    confidence: str
    reasoning: list[str]
    inputs: RecommendationRequest


class MembershipRuleSet(BaseModel):
    temperature_c: dict[str, tuple[float, float, float]]
    fish_age_weeks: dict[str, tuple[float, float, float]]
    average_fish_weight_g: dict[str, tuple[float, float, float]]
