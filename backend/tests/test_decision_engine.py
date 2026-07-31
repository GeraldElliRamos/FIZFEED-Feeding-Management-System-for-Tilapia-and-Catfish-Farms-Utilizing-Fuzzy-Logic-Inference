"""
FIZFEED Decision Engine Unit Test Suite
----------------------------------------
Tests for RBES, Mamdani Fuzzy Logic, ANFIS module, Weather fallback, and API endpoints.
"""

import pytest
from app.schemas import FeedingRequest
from app.rbes import compute_rbes
from app.fuzzy_mamdani import compute_fuzzy
from app.anfis import compute_anfis
from app.weather import fetch_weather, _WEATHER_CACHE


def test_rbes_tilapia_fingerling():
    req = FeedingRequest(
        fish_species="tilapia",
        water_temperature_c=28.0,
        ph_level=7.2,
        fish_age_months=0.5,
        fish_count=500,
        sessions_per_day=4,
    )
    res = compute_rbes(req)
    assert res.growth_stage == "fingerling"
    assert res.feeding_rate_percent > 0
    assert res.baseline_session_feed_g > 0


def test_rbes_catfish_adult():
    req = FeedingRequest(
        fish_species="catfish",
        water_temperature_c=27.5,
        ph_level=7.0,
        fish_age_months=7.0,
        fish_count=200,
        sessions_per_day=3,
    )
    res = compute_rbes(req)
    assert res.growth_stage == "finisher"
    assert res.baseline_session_feed_g > 0


def test_fuzzy_mamdani_temperature_extremes():
    req_cold = FeedingRequest(
        fish_species="tilapia",
        water_temperature_c=18.0,  # Cold stress
        ph_level=7.2,
        fish_age_months=3.0,
        fish_count=100,
    )
    rbes_cold = compute_rbes(req_cold)
    fuzzy_cold = compute_fuzzy(req_cold, rbes_cold.baseline_session_feed_g)

    # Multiplier should be reduced due to cold stress
    assert fuzzy_cold.feed_adjustment_multiplier <= 0.85
    assert fuzzy_cold.crisp_session_feed_g <= rbes_cold.baseline_session_feed_g


def test_anfis_fallback():
    req = FeedingRequest(
        fish_species="tilapia",
        water_temperature_c=28.5,
        ph_level=7.5,
        fish_age_months=2.5,
        fish_count=300,
    )
    anfis_res = compute_anfis(req, 150.0)
    assert anfis_res.predicted_session_feed_g > 0
    assert "ANFIS" in anfis_res.status or "Fallback" in anfis_res.status or "Rule-based" in anfis_res.status or "crisp" in anfis_res.status.lower()


def test_weather_caching():
    _WEATHER_CACHE.clear()
    data1 = fetch_weather(14.5995, 120.9842)
    assert "temperature_c" in data1
    assert len(_WEATHER_CACHE) == 1

    # Second call should use cache
    data2 = fetch_weather(14.5995, 120.9842)
    assert data2["temperature_c"] == data1["temperature_c"]
