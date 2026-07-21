from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import FeedingRequest, ThreeLayerRecommendationResponse
from .rbes import compute_rbes
from .fuzzy_mamdani import compute_fuzzy
from .anfis import compute_anfis

app = FastAPI(
    title="FIZFEED Intelligent Feeding Decision API",
    version="1.0.0",
    description="Three-component decision-making API combining Rule-Based Expert System (RBES), Mamdani Fuzzy Logic (FLIA), and ANFIS Prediction Module.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "system": "FIZFEED 3-Layer Decision Engine"}


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "FIZFEED Intelligent Feeding Decision API",
        "components": ["Rule-Based Expert System (RBES)", "Fuzzy Logic Inference Algorithm (FLIA)", "ANFIS Prediction Module"],
        "version": "1.0.0",
    }


@app.post("/recommendation", response_model=ThreeLayerRecommendationResponse)
def get_recommendation(request: FeedingRequest) -> ThreeLayerRecommendationResponse:
    # Layer 1: Rule-Based Expert System (RBES)
    rbes_res = compute_rbes(request)

    # Layer 2: Fuzzy Logic Inference Algorithm (Mamdani + Centroid)
    fuzzy_res = compute_fuzzy(request, rbes_res.baseline_session_feed_g)

    # Layer 3: ANFIS Prediction Module
    anfis_res = compute_anfis(request, fuzzy_res.crisp_session_feed_g)

    final_session_g = anfis_res.predicted_session_feed_g
    final_daily_g = round(final_session_g * request.sessions_per_day, 2)

    # Build human-readable biological reasoning
    reasoning = [
        f"Fish classified as '{rbes_res.growth_stage}' stage with estimated avg weight of {rbes_res.estimated_avg_weight_g}g per fish.",
        f"RBES baseline feed rate: {rbes_res.feeding_rate_percent}% body weight ({rbes_res.baseline_session_feed_g}g/session).",
        f"Mamdani Fuzzy Inference applied multiplier of {fuzzy_res.feed_adjustment_multiplier}x based on temp={request.water_temperature_c}°C and pH={request.ph_level}.",
        f"ANFIS module status: {anfis_res.status}.",
    ]

    return ThreeLayerRecommendationResponse(
        final_recommended_feed_g_per_session=final_session_g,
        final_recommended_feed_g_per_day=final_daily_g,
        rbes=rbes_res,
        fuzzy=fuzzy_res,
        anfis=anfis_res,
        reasoning=reasoning,
        inputs=request,
    )
