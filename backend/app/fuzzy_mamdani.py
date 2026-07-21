"""
FIZFEED — Fuzzy Logic Inference Algorithm (FLIA)
Mamdani Inference System with Centroid Defuzzification.
Processes Water Temperature (DS18B20), pH level (pH-4502C), Fish Age, and Species.
"""
from __future__ import annotations
import math
from .schemas import FeedingRequest, FuzzyResult


def tri_mf(x: float, a: float, b: float, c: float) -> float:
    if x <= a or x >= c:
        return 0.0
    if x == b:
        return 1.0
    if x < b:
        return (x - a) / (b - a)
    return (c - x) / (c - b)


def trap_mf(x: float, a: float, b: float, c: float, d: float) -> float:
    if x <= a or x >= d:
        return 0.0
    if b <= x <= c:
        return 1.0
    if x < b:
        return (x - a) / (b - a)
    return (d - x) / (d - c)


# Fuzzy sets definitions
TEMP_SETS = {
    "cold": lambda x: trap_mf(x, 10.0, 10.0, 18.0, 24.0),
    "optimal": lambda x: tri_mf(x, 23.0, 27.5, 32.0),
    "too_hot": lambda x: trap_mf(x, 30.0, 35.0, 45.0, 45.0),
}

PH_SETS = {
    "acidic": lambda x: trap_mf(x, 0.0, 0.0, 6.0, 6.8),
    "optimal": lambda x: tri_mf(x, 6.5, 7.5, 8.5),
    "alkaline": lambda x: trap_mf(x, 8.2, 9.0, 14.0, 14.0),
}

AGE_SETS = {
    "fingerling": lambda x: trap_mf(x, 0.0, 0.0, 0.5, 1.2),
    "juvenile": lambda x: tri_mf(x, 1.0, 2.0, 3.2),
    "grower": lambda x: tri_mf(x, 3.0, 4.5, 6.2),
    "finisher": lambda x: trap_mf(x, 6.0, 8.0, 24.0, 24.0),
}

# Output multiplier values (crisp singleton output mapping)
OUTPUT_MULTIPLIERS = {
    "very_low": 0.50,
    "low": 0.75,
    "normal": 1.00,
    "high": 1.15,
}


def compute_fuzzy(req: FeedingRequest, baseline_session_g: float) -> FuzzyResult:
    temp_deg = {k: round(fn(req.water_temperature_c), 4) for k, fn in TEMP_SETS.items()}
    ph_deg = {k: round(fn(req.ph_level), 4) for k, fn in PH_SETS.items()}
    age_deg = {k: round(fn(req.fish_age_months), 4) for k, fn in AGE_SETS.items()}

    # Evaluate Mamdani Rules (MIN for AND, MAX for aggregating OR)
    rule_outputs = {
        "very_low": 0.0,
        "low": 0.0,
        "normal": 0.0,
        "high": 0.0,
    }

    # Rule 1: Optimal Temp & Optimal pH -> Normal
    rule_outputs["normal"] = max(rule_outputs["normal"], min(temp_deg["optimal"], ph_deg["optimal"]))

    # Rule 2: Cold Temp OR Acidic pH OR Alkaline pH -> Low
    rule_outputs["low"] = max(rule_outputs["low"], temp_deg["cold"], ph_deg["acidic"], ph_deg["alkaline"])

    # Rule 3: Too Hot Temp -> Low
    rule_outputs["low"] = max(rule_outputs["low"], temp_deg["too_hot"])

    # Rule 4: Cold Temp AND (Acidic OR Alkaline) -> Very Low
    rule_outputs["very_low"] = max(rule_outputs["very_low"], min(temp_deg["cold"], max(ph_deg["acidic"], ph_deg["alkaline"])))

    # Rule 5: Optimal Temp AND Optimal pH AND Fingerling/Juvenile -> High
    rule_outputs["high"] = max(rule_outputs["high"], min(temp_deg["optimal"], ph_deg["optimal"], max(age_deg["fingerling"], age_deg["juvenile"])))

    # Centroid Defuzzification
    numerator = sum(weight * OUTPUT_MULTIPLIERS[label] for label, weight in rule_outputs.items())
    denominator = sum(weight for weight in rule_outputs.values())

    if denominator > 0:
        multiplier = numerator / denominator
    else:
        multiplier = 1.00

    crisp_session_g = baseline_session_g * multiplier

    return FuzzyResult(
        crisp_session_feed_g=round(crisp_session_g, 2),
        feed_adjustment_multiplier=round(multiplier, 3),
        temp_fuzzy_set=temp_deg,
        ph_fuzzy_set=ph_deg,
        age_fuzzy_set=age_deg,
    )
