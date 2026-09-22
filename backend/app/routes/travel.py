from fastapi import APIRouter, HTTPException
from app.schemas.travel import (
    TravelSearchRequest, TravelSearchResponse,
    DestinationRequest, DestinationResponse, Destination,
)
from app.services import serpapi_service

router = APIRouter()


@router.post("/travel/search", response_model=TravelSearchResponse)
async def travel_search(payload: TravelSearchRequest):
    try:
        results = await serpapi_service.search(payload.query)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Search failed: {str(e)}")

    return TravelSearchResponse(success=True, results=results)


@router.post("/travel/destinations", response_model=DestinationResponse)
async def discover_destinations(payload: DestinationRequest):
    query = _build_query(payload)

    try:
        results = await serpapi_service.search(query)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Destination search failed: {str(e)}")

    destinations = [
        Destination(
            name=r["title"],
            description=r["snippet"] or None,
            link=r["link"] or None,
        )
        for r in results
        if r.get("title")
    ]

    return DestinationResponse(success=True, query_used=query, destinations=destinations)


def _build_query(p: DestinationRequest) -> str:
    interests = " ".join(p.interests) if p.interests else "travel"
    return (
        f"best destinations near {p.origin} for {p.days} day trip "
        f"{interests} budget trip India"
    )
