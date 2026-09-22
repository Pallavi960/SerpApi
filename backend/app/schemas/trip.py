from pydantic import BaseModel, Field
from typing import List


class TripPreferencesRequest(BaseModel):
    origin: str = Field(..., min_length=2, examples=["Mumbai, India"])
    budget: int = Field(..., gt=0, examples=[15000])
    days: int = Field(..., gt=0, le=90, examples=[3])
    travelers: int = Field(..., gt=0, examples=[2])
    travel_date: str = Field(..., examples=["2026-08"])
    interests: List[str] = Field(default=[], examples=[["nature", "food"]])


class TripPreferencesResponse(BaseModel):
    status: str
    received: TripPreferencesRequest
