from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import SUPABASE_URL
from app.routes import health, trip, travel

app = FastAPI(title="TripWise AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(trip.router, prefix="/api")
app.include_router(travel.router, prefix="/api")


@app.on_event("startup")
def startup():
    if SUPABASE_URL:
        print(f"✅ Supabase connected: {SUPABASE_URL}")
    else:
        print("⚠️  SUPABASE_URL not set")


@app.get("/")
def root():
    return {"message": "TripWise AI API is running"}
