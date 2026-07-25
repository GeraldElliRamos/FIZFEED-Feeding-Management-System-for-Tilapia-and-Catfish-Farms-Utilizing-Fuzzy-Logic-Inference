from __future__ import annotations

from .schemas import MembershipRuleSet, RecommendationRequest, RecommendationResponse


TEMPERATURE_RULES = {
    "cold": (18.0, 22.0, 26.0),
    "optimal": (24.0, 29.0, 33.0),
    "hot": (30.0, 34.0, 38.0),
}

AGE_RULES = {
    "young": (0.0, 4.0, 8.0),
    "growing": (6.0, 10.0, 16.0),
    "mature": (14.0, 20.0, 40.0),
}

WEIGHT_RULES = {
    "light": (0.0, 20.0, 60.0),
    "medium": (40.0, 120.0, 250.0),
    "heavy": (200.0, 400.0, 1200.0),
}


def triangular_membership(value: float, left: float, peak: float, right: float) -> float:
    if value <= left or value >= right:
        return 0.0
    if value == peak:
        return 1.0
    if value < peak:
        return (value - left) / (peak - left)
    return (right - value) / (right - peak)


def fuzzify(value: float, rules: dict[str, tuple[float, float, float]]) -> dict[str, float]:
    return {
        label: round(triangular_membership(value, *points), 4)
        for label, points in rules.items()
    }


def get_membership_rules() -> MembershipRuleSet:
    return MembershipRuleSet(
        temperature_c=TEMPERATURE_RULES,
        fish_age_weeks=AGE_RULES,
        average_fish_weight_g=WEIGHT_RULES,
    )


def infer_feed_rate(request: RecommendationRequest) -> RecommendationResponse:
    temperature = fuzzify(request.water_temperature_c, TEMPERATURE_RULES)
    age = fuzzify(request.fish_age_weeks, AGE_RULES)
    weight = fuzzify(request.average_fish_weight_g, WEIGHT_RULES)

    cold_young_light = min(temperature["cold"], age["young"], weight["light"])
    balanced_growth = max(temperature["optimal"], age["growing"], weight["medium"])
    warm_heavy = max(temperature["hot"], age["mature"], weight["heavy"])

    base_rate = (cold_young_light * 0.025) + (balanced_growth * 0.035) + (warm_heavy * 0.02)
    confidence_score = max(cold_young_light, balanced_growth, warm_heavy)

    if request.fish_species == "catfish":
        base_rate *= 1.05

    biomass_kg = request.current_biomass_kg or request.pond_stock_kg or 0.0
    if biomass_kg > 0:
        feed_kg_per_day = biomass_kg * base_rate
    else:
        feed_kg_per_day = base_rate * 10

    if confidence_score >= 0.7:
        confidence = "high"
    elif confidence_score >= 0.4:
        confidence = "medium"
    else:
        confidence = "low"

    if balanced_growth >= cold_young_light and balanced_growth >= warm_heavy:
        frequency = 4
        reasoning = ["Fish are in a balanced growth band, so frequent feeding is appropriate."]
    elif warm_heavy > balanced_growth:
        frequency = 2
        reasoning = ["The fish are heavier or warmer conditions are present, so feeding is reduced."]
    else:
        frequency = 3
        reasoning = ["Younger or lighter fish benefit from smaller, more frequent feedings."]

    if request.water_temperature_c < 22:
        reasoning.append("Cool water slows metabolism.")
    elif request.water_temperature_c > 33:
        reasoning.append("Warm water can stress fish and should reduce feed intensity.")

    return RecommendationResponse(
        recommended_feed_kg_per_day=round(max(feed_kg_per_day, 0.0), 2),
        feeding_frequency_per_day=frequency,
        confidence=confidence,
        reasoning=reasoning,
        inputs=request,
    )
