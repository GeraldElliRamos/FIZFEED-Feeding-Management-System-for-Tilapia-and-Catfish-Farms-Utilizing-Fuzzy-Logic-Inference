# FIZFEED Python API

Starter FastAPI service for fuzzy feeding recommendations.

## Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /`
- `GET /health`
- `GET /rules`
- `POST /recommendation`

## Example request

```json
{
  "fish_species": "tilapia",
  "water_temperature_c": 29,
  "fish_age_weeks": 10,
  "average_fish_weight_g": 120,
  "pond_stock_kg": 25
}
```

## Response shape

The recommendation endpoint returns:

- `recommended_feed_kg_per_day`
- `feeding_frequency_per_day`
- `confidence`
- `reasoning`
- `inputs`
