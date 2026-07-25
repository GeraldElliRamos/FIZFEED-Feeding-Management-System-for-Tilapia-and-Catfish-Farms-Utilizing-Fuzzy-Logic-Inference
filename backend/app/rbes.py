"""
FIZFEED — Rule-Based Expert System (RBES)
Empirical feeding rate parameters derived from BFAR standards & Literature Review.
Query lookup tables based on Species, Age, and Water Temperature.
"""
from __future__ import annotations
from typing import Literal
from .schemas import FeedingRequest, RBESResult

SpeciesType = Literal["tilapia", "catfish"]

# Growth curve interpolation: (age_months, avg_weight_g)
TILAPIA_GROWTH = [(0.0, 0.5), (0.5, 2.0), (1.0, 5.0), (2.0, 20.0), (3.0, 50.0), (4.0, 100.0), (6.0, 200.0), (12.0, 500.0)]
CATFISH_GROWTH = [(0.0, 0.5), (0.5, 1.0), (1.0, 3.0), (2.0, 15.0), (3.0, 35.0), (4.0, 70.0), (6.0, 160.0), (12.0, 400.0)]

# BFAR Feeding Rates (% of Body Weight / day)
BFAR_RATES = {
    "tilapia": {"fingerling": 0.12, "juvenile": 0.07, "grower": 0.04, "finisher": 0.025},
    "catfish": {"fingerling": 0.10, "juvenile": 0.06, "grower": 0.04, "finisher": 0.025},
}


def get_growth_stage(age_months: float) -> str:
    if age_months < 1.0:
        return "fingerling"
    elif age_months < 3.0:
        return "juvenile"
    elif age_months < 6.0:
        return "grower"
    return "finisher"


def estimate_weight_g(species: SpeciesType, age_months: float) -> float:
    curve = TILAPIA_GROWTH if species == "tilapia" else CATFISH_GROWTH
    if age_months <= curve[0][0]:
        return curve[0][1]
    if age_months >= curve[-1][0]:
        return curve[-1][1]
    for i in range(len(curve) - 1):
        x0, y0 = curve[i]
        x1, y1 = curve[i + 1]
        if x0 <= age_months <= x1:
            return y0 + (age_months - x0) * (y1 - y0) / (x1 - x0)
    return curve[-1][1]


def calculate_temp_factor(temp_c: float, species: SpeciesType) -> float:
    opt_low, opt_high = (25.0, 30.0) if species == "tilapia" else (23.0, 28.0)
    if temp_c < opt_low - 5.0 or temp_c > opt_high + 5.0:
        return 0.65
    elif temp_c < opt_low or temp_c > opt_high:
        return 0.85
    return 1.0


def compute_rbes(req: FeedingRequest) -> RBESResult:
    stage = get_growth_stage(req.fish_age_months)
    avg_weight_g = req.avg_weight_g if req.avg_weight_g and req.avg_weight_g > 0 else estimate_weight_g(req.fish_species, req.fish_age_months)
    rate_percent = BFAR_RATES[req.fish_species][stage]
    temp_factor = calculate_temp_factor(req.water_temperature_c, req.fish_species)

    total_biomass_g = avg_weight_g * req.fish_count
    daily_feed_g = total_biomass_g * rate_percent * temp_factor
    session_feed_g = daily_feed_g / max(req.sessions_per_day, 1)

    return RBESResult(
        growth_stage=stage,
        estimated_avg_weight_g=round(avg_weight_g, 2),
        feeding_rate_percent=round(rate_percent * 100, 2),
        baseline_daily_feed_g=round(daily_feed_g, 2),
        baseline_session_feed_g=round(session_feed_g, 2),
        temp_factor=temp_factor,
    )
