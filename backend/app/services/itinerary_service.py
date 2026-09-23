from typing import List, Dict, Any, Optional
import os
import json
import httpx
from app import config
from app.services import serpapi_service


async def generate_itinerary(
    destination: str,
    days: int,
    budget: int,
    travelers: int,
    interests: List[str],
    travel_date: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Generate a full day-by-day travel itinerary enriched with SerpApi live attraction, food, and hotel data.
    """
    # 1. Fetch real local attractions and places from SerpApi
    attractions = await serpapi_service.search_attractions(destination, interests)
    
    # 2. Fetch live hotels / stays
    hotels = await serpapi_service.search_hotels(destination=destination, adults=travelers)
    
    # 3. Calculate budget split
    daily_budget = budget / max(days, 1)
    stay_budget = int(budget * 0.40)
    food_budget = int(budget * 0.25)
    activities_budget = int(budget * 0.20)
    transit_budget = int(budget * 0.15)
    
    # 4. Check if LLM_API_KEY is present for dynamic LLM generation
    llm_key = config.LLM_API_KEY or os.getenv("LLM_API_KEY")
    if llm_key and llm_key != "your_llm_api_key_here":
        try:
            return await _generate_with_llm(
                destination, days, budget, travelers, interests, travel_date, attractions, hotels, llm_key
            )
        except Exception as e:
            print(f"[WARN] LLM itinerary synthesis fallback: {e}")

    # 5. Algorithmic smart itinerary synthesis using live SerpApi places
    return _build_smart_itinerary(
        destination=destination,
        days=days,
        budget=budget,
        travelers=travelers,
        interests=interests,
        attractions=attractions,
        hotels=hotels,
        stay_budget=stay_budget,
        food_budget=food_budget,
        activities_budget=activities_budget,
        transit_budget=transit_budget,
    )


def _build_smart_itinerary(
    destination: str,
    days: int,
    budget: int,
    travelers: int,
    interests: List[str],
    attractions: List[Dict[str, Any]],
    hotels: List[Dict[str, Any]],
    stay_budget: int,
    food_budget: int,
    activities_budget: int,
    transit_budget: int,
) -> Dict[str, Any]:
    """Constructs an intelligent, structured day-by-day plan using SerpApi attraction data."""
    itinerary_days = []
    
    # Fallback attraction pool if SerpApi returned few items
    pool = attractions if len(attractions) >= days * 2 else attractions + [
        {"title": f"Historic Old Town & Heritage Walk in {destination}", "description": f"Explore the local architecture, heritage monuments, and traditional lanes of {destination}.", "link": None},
        {"title": f"Famous Local Food Trail & Night Bazaar in {destination}", "description": f"Taste iconic street food, regional delicacies, and handicraft shopping.", "link": None},
        {"title": f"Scenic Sunset Viewpoint in {destination}", "description": f"Enjoy panoramic views and capture golden hour photography.", "link": None},
        {"title": f"Cultural Museum & Artisan Centers in {destination}", "description": f"Discover local crafts, textiles, and historical exhibits.", "link": None},
        {"title": f"Nature Walk & Lakeside Promenade in {destination}", "description": f"Relaxing morning walk surrounded by lush greenery and fresh air.", "link": None},
    ]

    selected_hotel = hotels[0] if hotels else {
        "name": f"Recommended Central Stay in {destination}",
        "price": f"₹{stay_budget // max(days, 1)} / night",
        "rating": 4.5,
        "description": "Centrally located with easy access to transit and top sights",
    }

    for day_num in range(1, days + 1):
        idx1 = ((day_num - 1) * 2) % len(pool)
        idx2 = ((day_num - 1) * 2 + 1) % len(pool)
        
        spot1 = pool[idx1]
        spot2 = pool[idx2]

        morning = {
            "time": "09:00 AM - 12:30 PM",
            "title": spot1.get("title", f"Explore Top Spot {day_num}"),
            "description": spot1.get("description", "Start your morning discovering the local charm and architecture."),
            "link": spot1.get("link"),
            "category": "Sightseeing",
            "cost": f"₹{int(activities_budget / (days * 2))}",
        }

        afternoon = {
            "time": "01:00 PM - 04:30 PM",
            "title": f"Authentic Regional Lunch & {spot2.get('title', 'Cultural Discovery')}",
            "description": f"Enjoy popular local dining followed by {spot2.get('description', 'leisure sightseeing and local markets.')}",
            "link": spot2.get("link"),
            "category": "Food & Culture",
            "cost": f"₹{int(food_budget / days)}",
        }

        evening = {
            "time": "05:30 PM - 08:30 PM",
            "title": f"Evening Sunset Walk & Local Street Market",
            "description": f"Immerse in the vibrant evening vibes of {destination}, shopping for souvenirs and tasting street food.",
            "link": None,
            "category": "Leisure & Shopping",
            "cost": f"₹{int(activities_budget / (days * 2))}",
        }

        itinerary_days.append({
            "day": day_num,
            "title": f"Day {day_num}: {spot1.get('title', 'Highlights & Discovery')[:35]}",
            "morning": morning,
            "afternoon": afternoon,
            "evening": evening,
            "meals_highlight": f"Try famous regional dishes and tea stalls in {destination}",
        })

    return {
        "destination": destination,
        "days_count": days,
        "total_budget": budget,
        "travelers": travelers,
        "interests": interests,
        "summary": f"Customized {days}-day journey to {destination} tailored for {', '.join(interests) if interests else 'exploration'} within a ₹{budget:,} budget.",
        "recommended_stay": selected_hotel,
        "budget_breakdown": {
            "accommodation": stay_budget,
            "food_and_dining": food_budget,
            "activities_and_tickets": activities_budget,
            "local_transit": transit_budget,
        },
        "days": itinerary_days,
        "source": "TripWise AI + SerpApi Live Data",
    }


async def _generate_with_llm(
    destination: str,
    days: int,
    budget: int,
    travelers: int,
    interests: List[str],
    travel_date: Optional[str],
    attractions: List[Dict[str, Any]],
    hotels: List[Dict[str, Any]],
    api_key: str,
) -> Dict[str, Any]:
    """Call LLM API to format custom JSON itinerary using SerpApi context."""
    prompt = f"""
You are an expert Indian travel planner for TripWise AI.
Create a structured JSON travel itinerary for:
- Destination: {destination}
- Duration: {days} Days
- Total Budget: ₹{budget} INR
- Travelers: {travelers}
- Interests: {', '.join(interests)}
- Travel Date: {travel_date}

Use this live SerpApi data for real attractions & stays:
Attractions: {json.dumps(attractions[:6])}
Hotels: {json.dumps(hotels[:3])}

Return ONLY valid JSON matching this structure:
{{
  "destination": "{destination}",
  "days_count": {days},
  "total_budget": {budget},
  "travelers": {travelers},
  "interests": {json.dumps(interests)},
  "summary": "2-sentence inspiring overview of the trip.",
  "recommended_stay": {{ "name": "Hotel Name", "price": "₹XX/night", "rating": 4.5, "description": "Short overview" }},
  "budget_breakdown": {{ "accommodation": {int(budget*0.4)}, "food_and_dining": {int(budget*0.25)}, "activities_and_tickets": {int(budget*0.2)}, "local_transit": {int(budget*0.15)} }},
  "days": [
    {{
      "day": 1,
      "title": "Day 1 Title",
      "morning": {{ "time": "9 AM - 12 PM", "title": "...", "description": "...", "category": "Sightseeing", "cost": "₹..." }},
      "afternoon": {{ "time": "1 PM - 4 PM", "title": "...", "description": "...", "category": "Food & Culture", "cost": "₹..." }},
      "evening": {{ "time": "5 PM - 8 PM", "title": "...", "description": "...", "category": "Leisure", "cost": "₹..." }},
      "meals_highlight": "Recommended dish to try"
    }}
  ],
  "source": "TripWise AI + SerpApi Live Data"
}}
"""
    async with httpx.AsyncClient(timeout=20.0) as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            }
        )
        res.raise_for_status()
        data = res.json()
        content = data["choices"][0]["message"]["content"]
        return json.loads(content)
