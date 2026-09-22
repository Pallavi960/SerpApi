# TripWise AI

AI-powered travel planning web application built for the **SerpApi India Hackathon 2026 — Track 03: Travel & Local Discovery**.

---

## What is TripWise AI?

TripWise AI uses live SerpApi search data to help users discover destinations, compare travel options, find hotels and places, and generate a personalized itinerary.

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React, Vite, Tailwind CSS     |
| Backend    | Python, FastAPI               |
| AI         | LLM API with function calling |
| Live Data  | SerpApi                       |

---

## Project Structure

```
SerpApi_heckthon/
├── frontend/       # React + Vite application
├── backend/        # FastAPI Python application
├── .env.example    # ← copy this, never commit .env
└── README.md
```

---

## Environment Setup

**Never commit `.env` files with real keys.**

### Backend

```bash
cd backend
cp .env.example .env      # Windows: copy .env.example .env
```

Fill in your keys in `backend/.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
SERPAPI_KEY=your_serpapi_key_here
LLM_API_KEY=your_llm_api_key_here
```

### Frontend

```bash
cd frontend
cp .env.example .env.local    # Windows: copy .env.example .env.local
```

Fill in `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at: `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Path                        | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | /api/health                 | Health check                 |
| POST   | /api/trip/preferences       | Save trip preferences        |
| POST   | /api/travel/search          | General SerpApi search       |
| POST   | /api/travel/destinations    | Destination discovery        |

---

## Roadmap

- Phase 1  — Project foundation ✅
- Phase 2  — Frontend travel input UI ✅
- Phase 3  — Backend API structure ✅
- Phase 4  — SerpApi integration ✅
- Phase 5  — Destination discovery ✅
- Phase 6  — Flight & hotel comparison
- Phase 7  — AI itinerary generation
- Phase 8  — Trip replanning
- Phase 9  — UI polish & hackathon demo
