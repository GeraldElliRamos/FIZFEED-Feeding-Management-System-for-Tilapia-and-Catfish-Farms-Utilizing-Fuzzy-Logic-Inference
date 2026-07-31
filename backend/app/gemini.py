from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# Automatically locate and load backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

try:
    from groq import Groq

    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


def is_ai_engine_on() -> bool:
    return bool(GROQ_API_KEY and HAS_GROQ)


def generate_ai_insight(
    species: str,
    temp_c: float,
    ph: float,
    fish_count: int,
    growth_stage: str,
    recommended_g_per_session: float,
    recommended_g_per_day: float,
    weather_condition: str,
    weather_advisory: str,
) -> str:
    """
    Generate a short, human-sounding feeding advisory.
    Falls back to a plain-language summary if Groq is unavailable.
    """
    weather_lower = weather_condition.lower()
    weather_hint = ""

    if any(word in weather_lower for word in ("rain", "storm", "thunder")):
        weather_hint = (
            "Because the weather is unsettled, it is safer to feed a bit more carefully and watch for leftover feed."
        )
    elif any(word in weather_lower for word in ("clear", "sunny", "fine")):
        weather_hint = "The weather looks calm, so normal feeding should be fine if the fish are active."

    fallback = (
        f"Feed about {recommended_g_per_session}g per session, or {recommended_g_per_day}g per day. "
        f"Water is around {temp_c}°C with pH {ph}, so watch how the fish respond while feeding. "
        f"{weather_hint} {weather_advisory}"
    ).strip()

    if not GROQ_API_KEY or not HAS_GROQ:
        return fallback

    prompt = f"""Write a short, friendly feeding advisory for a fish farmer in the Philippines.

Use natural language, not robotic wording. Keep it to 2-3 sentences. Make the weather connection obvious and practical.

Farm details:
- Fish species: {species} ({growth_stage} stage)
- Fish count: {fish_count}
- Water temperature: {temp_c}°C
- Water pH: {ph}
- Recommended feed per session: {recommended_g_per_session} grams
- Recommended feed per day: {recommended_g_per_day} grams
- Weather condition: {weather_condition}
- Weather advisory: {weather_advisory}

If weather is rainy or stormy, mention feeding more carefully or reducing feed. If weather is calm or clear, say normal feeding is okay. Mention the feed amount naturally. No markdown."""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a friendly aquaculture advisor for tilapia and catfish farms in the Philippines. "
                        "Respond in plain text only. Sound natural, practical, and human."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=180,
        )
        result = chat_completion.choices[0].message.content
        if result:
            return result.strip()
    except Exception as e:
        print(f"Groq AI call failed: {e}")

    return fallback
