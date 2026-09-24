# TravelOS AI — Dynamic AI Travel Decision & Replanning Agent

> **"Don't just plan your trip. Let AI research, decide, optimize and replan it."**

Built for the **SerpApi India Hackathon 2026 — Track 03: Travel & Local Discovery**.

---

## 🌟 What is TravelOS AI?

Traditional travel apps are either static itinerary templates or simple chatbot wrappers that hallucinate prices, hotels, and travel times. 

**TravelOS AI** is an autonomous AI travel decision agent that:
1. **Researches Live Data**: Queries SerpApi engines (`google_flights`, `google_hotels`, `google_maps`, and `google`) for real-time fares, availability, ratings, and exact GPS coordinates.
2. **Zero-Hallucination Guarantee**: All pricing, schedules, reviews, and travel distances are grounded in verified live search results.
3. **Route Optimization**: Clusters places geographically using Haversine formulas to eliminate criss-crossing and minimize daily transit times.
4. **Dynamic Budget Optimizer**: Compares flights, stays, food, activities, and local transit. Automatically flags over-budget itineraries and generates cheaper alternatives.
5. **Interactive Route Maps**: Visualizes hotel bases, numbered stop waypoints (1..N), and color-coded routes on interactive maps.
6. **Continuous Replanning & What-If Simulator**: Adapts to flight delays, budget cuts, extra days, or pacing changes dynamically without discarding existing choices.
7. **Trip Monitor / Check for Changes**: Re-verifies live SerpApi rates and notifies travelers of price drops or schedule changes with alternative options.

---

## 🔄 The Product Flow

```
DISCOVER → SEARCH → COMPARE → OPTIMIZE → PLAN → MAP → REPLAN
```

---

## 🚀 3-Minute Hackathon Demo Script

1. **Landing Page**:
   - Open `http://localhost:3000`.
   - Inspect the branding, product flow pipeline visual, and instant demo presets (`Ahmedabad → Goa`, `Delhi → Kerala`, `Mumbai → Jaipur`, `Bangalore → Manali`).
2. **Trip Builder / Destination Discovery**:
   - Click **Plan My Trip** or select a demo preset.
   - Test leaving destination blank to experience **AI Destination Discovery** comparing live estimated trip costs and interest matches.
3. **AI Research Center**:
   - Click **Generate My Trip**.
   - Watch the animated live checklist executing real SerpApi queries across flights, hotels, places, reviews, and route clustering.
4. **Trip Dashboard**:
   - Inspect the top bar with Total Estimated Cost, Budget Status, and Quick Action buttons.
5. **Smart Itinerary & Interactive Route Map**:
   - Switch between **Day 1**, **Day 2**, and **Day 3**.
   - Inspect the chronological stops with selection rationales (*"Why this was selected"*), transit times, and interactive numbered map pins.
6. **Travel Intelligence**:
   - Navigate to the **AI Reasoning & Reviews** tab.
   - Inspect *"Why This Hotel Was Selected"* and *"Why This Flight Was Selected"*, verified review themes, and alternative stays evaluated by SerpApi.
7. **Dynamic Budget Optimizer**:
   - If the trip exceeds the budget, click **Optimize for Budget** or view the itemized breakdown.
8. **What-If Simulator & Replanner**:
   - Go to **AI Replanner & What-If**.
   - Click **"Make Day 2 relaxed"** or type *"My flight is delayed by 4 hours"*.
   - Watch the agent update the timeline and route in real-time.
9. **Check for Changes**:
   - Click **Check for Changes** in the header to re-query live SerpApi data and verify fares.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Leaflet (Interactive Maps), Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js |
| **Live Search Provider** | **SerpApi** (`google_flights`, `google_hotels`, `google_maps`, `google`) |
| **AI Orchestration** | Gemini API / OpenAI API with deterministic algorithmic fallback |
| **Database** | Supabase (PostgreSQL) with in-memory caching fallback |

---

## 📁 Project Structure

```
SerpApi/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tripRoutes.js        # REST API endpoints
│   │   ├── services/
│   │   │   ├── serpapiService.js    # Live Google Flights, Hotels, Maps Places, Reviews
│   │   │   ├── aiAgentService.js    # Route clustering, budget optimizer, What-If replanner
│   │   │   └── supabaseService.js   # Supabase client with in-memory cache
│   │   └── server.js                # Express server setup
│   ├── .env.example                 # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InteractiveRouteMap.jsx     # Leaflet route map with numbered pins
│   │   │   ├── SmartItineraryView.jsx      # Day-by-day stops with reasons & travel times
│   │   │   ├── TravelIntelligenceView.jsx  # Decision explanations & review intelligence
│   │   │   ├── AiAssistantReplanner.jsx    # What-If buttons + conversational replanner
│   │   │   ├── CheckForChangesModal.jsx    # Live price re-verification modal
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── TripContext.jsx      # Global trip state & research stages
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Screen 1: Hero & Demo Presets
│   │   │   ├── TripBuilderPage.jsx  # Screen 2: Dynamic input & Destination Discovery
│   │   │   ├── ResearchCenterPage.jsx# Screen 3: Real-time SerpApi progress checklist
│   │   │   └── DashboardPage.jsx    # Screen 4: Master trip dashboard with 8 view tabs
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## ⚙️ Environment Setup

### 1. Backend

Create `backend/.env`:

```env
PORT=5000
SERPAPI_KEY=your_serpapi_key_here
AI_PROVIDER=gemini # or openai
AI_API_KEY=your_ai_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

### 2. Frontend

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=
```

---

## 🏃 Running the Application

### Start Backend

```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)*

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📡 API Reference

- `POST /api/trips`: Generate full route-aware trip with live SerpApi search
- `POST /api/destinations/discover`: AI Destination Discovery with cost & interest matching
- `POST /api/flights/search`: Standalone Google Flights query via SerpApi
- `POST /api/hotels/search`: Standalone Google Hotels query via SerpApi
- `POST /api/places/search`: Google Maps attractions query with GPS coordinates
- `POST /api/reviews/search`: Grounded traveler sentiment & theme analysis
- `POST /api/trips/:id/optimize`: Auto-optimize trip for budget constraints
- `POST /api/trips/:id/what-if`: What-If simulator (e.g. reduce budget, add day, relaxed pace)
- `POST /api/trips/:id/replan`: Conversational replanner (flight delays, hotel swaps)
- `POST /api/trips/:id/check-changes`: Re-query live SerpApi data and flag updates

---

## 🏆 Hackathon Submission Notes

- **SerpApi as Core Dependency**: All factual data (flights, hotel rates, places, GPS coordinates) is retrieved live via SerpApi engines and never hallucinated.
- **Dynamic for Any Input**: Works for any origin, any destination, arbitrary dates, budgets, and travel preferences.
