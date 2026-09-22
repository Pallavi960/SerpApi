from fastapi import APIRouter
from app.schemas.trip import TripPreferencesRequest, TripPreferencesResponse

router = APIRouter()


@router.post("/trip/preferences", response_model=TripPreferencesResponse)
def save_trip_preferences(payload: TripPreferencesRequest):
    return TripPreferencesResponse(status="received", received=payload)
