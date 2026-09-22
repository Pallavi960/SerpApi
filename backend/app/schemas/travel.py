from pydantic import BaseModel, Field
from typing import List, Optional


class TravelSearchRequest(BaseModel):
    query: str = Field(..., min_length=3, examples=["best places to visit in Gujarat"])


class TravelSearchResult(BaseModel):
    title: str
    link: str
    snippet: str


class TravelSearchResponse(BaseModel):
    success: bool
    results: List[TravelSearchResult]


# ── Destination discovery ──

class DestinationRequest(BaseModel):
    origin: str = Field(..., min_length=2, examples=["Ahmedabad"])
    budget: int = Field(..., gt=0)
    days: int = Field(..., gt=0)
    travelers: int = Field(..., gt=0)
    travel_date: str
    interests: List[str] = Field(default=[])


class Destination(BaseModel):
    name: str
    description: Optional[str] = None
    link: Optional[str] = None
    source: str = "SerpApi"


class DestinationResponse(BaseModel):
    success: bool
    query_used: str
    destinations: List[Destination]
