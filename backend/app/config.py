from dotenv import load_dotenv
import os
from pathlib import Path

# Finds .env in backend/ first, then falls back to project root
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
LLM_API_KEY = os.getenv("LLM_API_KEY")
