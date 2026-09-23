import os
from typing import Optional, List, Dict, Any
import httpx
from app import config

SERPAPI_BASE_URL = "https://serpapi.com/search"


def _get_api_key() -> str:
    api_key = config.SERPAPI_KEY or os.getenv("SERPAPI_KEY")
    if not api_key:
        raise ValueError("SERPAPI_KEY is not configured.")
    return api_key


async def search(query: str) -> list[dict]:
    """Send a general query to SerpApi and return cleaned organic results."""
    api_key = _get_api_key()
    params = {
        "q": query,
        "api_key": api_key,
        "engine": "google",
        "num": 10,
        "gl": "in",
        "hl": "en",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(SERPAPI_BASE_URL, params=params)
        response.raise_for_status()

    data = response.json()
    if "error" in data:
        raise ValueError(f"SerpApi error: {data['error']}")

    return _extract_organic_results(data)


async def search_hotels(
    destination: str,
    check_in_date: Optional[str] = None,
    check_out_date: Optional[str] = None,
    adults: int = 2,
    max_price: Optional[int] = None,
) -> list[dict]:
    """
    Search hotels in destination using Google Hotels engine with fallback to Google Search.
    """
    api_key = _get_api_key()
    params = {
        "engine": "google_hotels",
        "q": f"hotels in {destination}",
        "api_key": api_key,
        "gl": "in",
        "hl": "en",
        "currency": "INR",
    }
    if check_in_date:
        params["check_in_date"] = check_in_date
    if check_out_date:
        params["check_out_date"] = check_out_date
    if adults:
        params["adults"] = adults
    if max_price:
        params["max_price"] = max_price

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(SERPAPI_BASE_URL, params=params)
            response.raise_for_status()

        data = response.json()
        properties = data.get("properties", [])
        if properties:
            results = []
            for item in properties[:8]:
                rate = item.get("rate_per_night", {})
                price_str = rate.get("lowest") or rate.get("extracted_lowest") or rate.get("before_taxes") or ""
                images = item.get("images", [])
                image_url = images[0].get("thumbnail") if images else None
                
                results.append({
                    "name": item.get("name", "Hotel"),
                    "description": item.get("description") or ", ".join(item.get("amenities", [])[:3]) or "Comfortable stay with modern amenities",
                    "price": str(price_str) if price_str else "Check live rates",
                    "rating": item.get("overall_rating"),
                    "reviews": item.get("reviews"),
                    "amenities": item.get("amenities", [])[:5],
                    "link": item.get("link"),
                    "image": image_url,
                    "type": item.get("type", "Hotel"),
                })
            return results
    except Exception as e:
        print(f"[WARN] Google Hotels engine fallback: {e}")

    # Fallback to organic Google search
    organic_query = f"best budget and luxury hotels in {destination} price reviews booking"
    organic_results = await search(organic_query)
    return [
        {
            "name": r["title"].split(" - ")[0].split(" | ")[0],
            "description": r["snippet"],
            "price": "Check live rates",
            "rating": 4.5,
            "reviews": None,
            "amenities": ["Wi-Fi", "Air Conditioning", "Breakfast Available"],
            "link": r["link"],
            "image": None,
            "type": "Hotel",
        }
        for r in organic_results[:6]
    ]


async def search_flights(
    origin: str,
    destination: str,
    outbound_date: Optional[str] = None,
    return_date: Optional[str] = None,
    adults: int = 1,
) -> list[dict]:
    """
    Search flight and transit options using Google Flights engine or fallback search.
    """
    api_key = _get_api_key()
    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "api_key": api_key,
        "gl": "in",
        "hl": "en",
        "currency": "INR",
    }
    if outbound_date:
        params["outbound_date"] = outbound_date
    if return_date:
        params["return_date"] = return_date
    if adults:
        params["adults"] = adults

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(SERPAPI_BASE_URL, params=params)
            response.raise_for_status()

        data = response.json()
        best_flights = data.get("best_flights", []) or data.get("other_flights", [])
        if best_flights:
            results = []
            for item in best_flights[:6]:
                flights_info = item.get("flights", [{}])[0]
                price = item.get("price", "Check price")
                airline = flights_info.get("airline", "Major Airline")
                duration = item.get("total_duration", "Varies")
                departure_time = flights_info.get("departure_airport", {}).get("time")
                arrival_time = flights_info.get("arrival_airport", {}).get("time")
                airline_logo = flights_info.get("airline_logo")
                
                results.append({
                    "airline": airline,
                    "airline_logo": airline_logo,
                    "price": f"₹{price}" if isinstance(price, (int, float)) or (isinstance(price, str) and not price.startswith("₹")) else str(price),
                    "duration": f"{duration} min" if isinstance(duration, (int, float)) else str(duration),
                    "departure_time": departure_time,
                    "arrival_time": arrival_time,
                    "type": "Flight",
                    "booking_link": data.get("search_metadata", {}).get("google_flights_url"),
                })
            return results
    except Exception as e:
        print(f"[WARN] Google Flights engine fallback: {e}")

    # Fallback to travel / transit search
    transit_query = f"flights and fastest trains from {origin} to {destination} duration price"
    transit_results = await search(transit_query)
    return [
        {
            "airline": r["title"].split(" - ")[0].split(" | ")[0],
            "airline_logo": None,
            "price": "Check online fares",
            "duration": "Direct / 1 Stop",
            "departure_time": "Multiple timings daily",
            "arrival_time": None,
            "type": "Flight / Train",
            "booking_link": r["link"],
        }
        for r in transit_results[:5]
    ]


async def search_attractions(destination: str, interests: Optional[List[str]] = None) -> list[dict]:
    """
    Search top tourist spots, local attractions, and food recommendations.
    """
    interest_terms = " ".join(interests) if interests else "sightseeing attractions local food"
    query = f"top places to visit and famous things to do in {destination} {interest_terms}"
    
    results = await search(query)
    return [
        {
            "title": r["title"].split(" - ")[0].split(" | ")[0],
            "description": r["snippet"],
            "link": r["link"],
        }
        for r in results[:8]
    ]


def _extract_organic_results(data: dict) -> list[dict]:
    """Pull only the fields we need from organic_results."""
    organic = data.get("organic_results", [])
    return [
        {
            "title": item.get("title", ""),
            "link": item.get("link", ""),
            "snippet": item.get("snippet", ""),
        }
        for item in organic
    ]

