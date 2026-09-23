from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


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


# ── Hotels ──

class HotelSearchRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    check_in_date: Optional[str] = None
    check_out_date: Optional[str] = None
    adults: Optional[int] = 2
    max_price: Optional[int] = None


class HotelItem(BaseModel):
    name: str
    description: Optional[str] = None
    price: str
    rating: Optional[float] = None
    reviews: Optional[int] = None
    amenities: List[str] = []
    link: Optional[str] = None
    image: Optional[str] = None
    type: str = "Hotel"


class HotelSearchResponse(BaseModel):
    success: bool
    destination: str
    hotels: List[HotelItem]


# ── Flights ──

class FlightSearchRequest(BaseModel):
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    outbound_date: Optional[str] = None
    return_date: Optional[str] = None
    adults: Optional[int] = 1


class FlightItem(BaseModel):
    airline: str
    airline_logo: Optional[str] = None
    price: str
    duration: str
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    type: str = "Flight"
    booking_link: Optional[str] = None


class FlightSearchResponse(BaseModel):
    success: bool
    origin: str
    destination: str
    flights: List[FlightItem]


# ── Attractions ──

class AttractionSearchRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    interests: List[str] = []


class AttractionItem(BaseModel):
    title: str
    description: Optional[str] = None
    link: Optional[str] = None


class AttractionSearchResponse(BaseModel):
    success: bool
    destination: str
    attractions: List[AttractionItem]


# ── AI Itinerary ──

class ItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    days: int = Field(default=3, gt=0)
    budget: int = Field(default=15000, gt=0)
    travelers: int = Field(default=2, gt=0)
    travel_date: Optional[str] = None
    interests: List[str] = []


class ActivityItem(BaseModel):
    time: str
    title: str
    description: str
    link: Optional[str] = None
    category: str
    cost: Optional[str] = None


class ItineraryDay(BaseModel):
    day: int
    title: str
    morning: ActivityItem
    afternoon: ActivityItem
    evening: ActivityItem
    meals_highlight: Optional[str] = None


class ItineraryResponse(BaseModel):
    destination: str
    days_count: int
    total_budget: int
    travelers: int
    interests: List[str]
    summary: str
    recommended_stay: Optional[Dict[str, Any]] = None
    budget_breakdown: Optional[Dict[str, int]] = None
    days: List[ItineraryDay]
    source: str

