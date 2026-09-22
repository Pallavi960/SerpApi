import httpx
from app.config import SERPAPI_KEY

SERPAPI_BASE_URL = "https://serpapi.com/search"


async def search(query: str) -> list[dict]:
    """
    Send a query to SerpApi and return cleaned organic results.
    Raises ValueError if the API key is not configured.
    """
    if not SERPAPI_KEY:
        raise ValueError("SERPAPI_KEY is not configured.")

    params = {
        "q": query,
        "api_key": SERPAPI_KEY,
        "engine": "google",
        "num": 10,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(SERPAPI_BASE_URL, params=params)
        response.raise_for_status()

    data = response.json()

    if "error" in data:
        raise ValueError(f"SerpApi error: {data['error']}")

    return _extract_results(data)


def _extract_results(data: dict) -> list[dict]:
    """Pull only the fields we need from organic_results."""
    organic = data.get("organic_results", [])
    return [
        {
            "title":   item.get("title", ""),
            "link":    item.get("link", ""),
            "snippet": item.get("snippet", ""),
        }
        for item in organic
    ]
