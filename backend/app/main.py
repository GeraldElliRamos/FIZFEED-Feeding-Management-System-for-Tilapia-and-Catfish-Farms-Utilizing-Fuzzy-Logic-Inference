from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .fuzzy import get_membership_rules, infer_feed_rate
from .schemas import RecommendationRequest, RecommendationResponse


app = FastAPI(
    title="FIZFEED Fuzzy Logic API",
    version="0.1.0",
    description="Starter Python API for fuzzy feeding recommendations.",
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
    return {"status": "ok"}


@app.get("/rules")
def rules() -> dict[str, object]:
    return get_membership_rules().model_dump()


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "FIZFEED Fuzzy Logic API", "version": "0.1.0"}


@app.post("/recommendation", response_model=RecommendationResponse)
def recommendation(request: RecommendationRequest) -> RecommendationResponse:
    return infer_feed_rate(request)
