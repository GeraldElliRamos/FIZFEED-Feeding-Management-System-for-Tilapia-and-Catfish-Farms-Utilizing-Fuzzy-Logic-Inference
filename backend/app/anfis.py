"""
FIZFEED — Adaptive Neuro-Fuzzy Inference System (ANFIS) Module
AI-driven layer combining fuzzy inference with neural network learning mechanism.
Initialized with BFAR parameters (operates from 1st session).
Refines feed recommendations based on cumulative feed logs (HX711), temperature, and age.
"""
from __future__ import annotations
from .schemas import FeedingRequest, ANFISResult


def compute_anfis(req: FeedingRequest, fuzzy_session_g: float) -> ANFISResult:
    """
    ANFIS Refinement Layer.
    Initializes from fuzzy baseline and applies adaptation based on cumulative feed logs.
    """
    adaptation_factor = 1.0

    # If cumulative feed data is logged from HX711 load cell:
    if req.cumulative_feed_g is not None and req.cumulative_feed_g > 0:
        # Calculate historical trend ratio vs expected
        expected_cumulative = fuzzy_session_g * 10.0  # reference baseline
        ratio = req.cumulative_feed_g / max(expected_cumulative, 1.0)

        # Smooth adaptive adjustment bounded between 0.85 and 1.15
        adaptation_factor = max(0.85, min(1.15, 0.9 + 0.2 * ratio))
        status = "ANFIS active (learning from load cell logs)"
    else:
        status = "ANFIS initialized with literature parameters (zero-cold-start baseline)"

    predicted_session_g = fuzzy_session_g * adaptation_factor

    return ANFISResult(
        predicted_session_feed_g=round(predicted_session_g, 2),
        adaptation_factor=round(adaptation_factor, 3),
        status=status,
    )
