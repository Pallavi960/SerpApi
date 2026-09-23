from fastapi import APIRouter, HTTPException
from app.schemas.travel import (
    TravelSearchRequest, TravelSearchResponse,
    DestinationRequest, DestinationResponse, Destination,
    HotelSearchRequest, HotelSearchResponse, HotelItem,
    FlightSearchRequest, FlightSearchResponse, FlightItem,
    AttractionSearchRequest, AttractionSearchResponse, AttractionItem,
    ItineraryRequest, ItineraryResponse,
)
from app.services import serpapi_service, itinerary_service

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


@router.post("/travel/hotels", response_model=HotelSearchResponse)
async def search_hotels(payload: HotelSearchRequest):
    try:
        hotels_data = await serpapi_service.search_hotels(
            destination=payload.destination,
            check_in_date=payload.check_in_date,
            check_out_date=payload.check_out_date,
            adults=payload.adults or 2,
            max_price=payload.max_price,
        )
        hotels = [HotelItem(**h) for h in hotels_data]
        return HotelSearchResponse(success=True, destination=payload.destination, hotels=hotels)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Hotel search failed: {str(e)}")


@router.post("/travel/flights", response_model=FlightSearchResponse)
async def search_flights(payload: FlightSearchRequest):
    try:
        flights_data = await serpapi_service.search_flights(
            origin=payload.origin,
            destination=payload.destination,
            outbound_date=payload.outbound_date,
            return_date=payload.return_date,
            adults=payload.adults or 1,
        )
        flights = [FlightItem(**f) for f in flights_data]
        return FlightSearchResponse(
            success=True,
            origin=payload.origin,
            destination=payload.destination,
            flights=flights,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Flight search failed: {str(e)}")


@router.post("/travel/attractions", response_model=AttractionSearchResponse)
async def search_attractions(payload: AttractionSearchRequest):
    try:
        attractions_data = await serpapi_service.search_attractions(
            destination=payload.destination,
            interests=payload.interests,
        )
        attractions = [AttractionItem(**a) for a in attractions_data]
        return AttractionSearchResponse(
            success=True,
            destination=payload.destination,
            attractions=attractions,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Attractions search failed: {str(e)}")


@router.post("/travel/itinerary", response_model=ItineraryResponse)
async def create_itinerary(payload: ItineraryRequest):
    try:
        itinerary = await itinerary_service.generate_itinerary(
            destination=payload.destination,
            days=payload.days,
            budget=payload.budget,
            travelers=payload.travelers,
            interests=payload.interests,
            travel_date=payload.travel_date,
        )
        return ItineraryResponse(**itinerary)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Itinerary generation failed: {str(e)}")


def _build_query(p: DestinationRequest) -> str:
    interests = " ".join(p.interests) if p.interests else "travel"
    return (
        f"best destinations near {p.origin} for {p.days} day trip "
        f"{interests} budget trip India"
    )

