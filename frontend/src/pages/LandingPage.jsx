import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  Sparkles, ArrowRight, MapPin, Calendar, Users, IndianRupee,
  Plane, Building, Route, RefreshCw, Brain, ShieldCheck,
  Star, ChevronRight, Zap, Globe
} from 'lucide-react';

const HERO_DESTINATIONS = [
  { name: 'Goa', tag: 'Beaches & Nightlife', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80' },
  { name: 'Manali', tag: 'Mountains & Snow', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80' },
  { name: 'Jaipur', tag: 'Heritage & Culture', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80' },
  { name: 'Kerala', tag: 'Backwaters & Nature', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80' },
];

const FEATURES = [
  { icon: Plane, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Live Flight Search', desc: 'Real fares from Google Flights via SerpApi. No estimates.' },
  { icon: Building, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', title: 'Hotel Comparison', desc: 'Live rates, ratings & photos. AI picks the best fit for your budget.' },
  { icon: Route, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Route Optimization', desc: 'Stops grouped geographically. Real road routes on Google Maps.' },
  { icon: Brain, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'AI Decision Engine', desc: 'Explains why each hotel, flight, and activity was selected.' },
  { icon: RefreshCw, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', title: 'Dynamic Replanning', desc: 'Flight delayed? Budget changed? AI rebuilds your trip instantly.' },
  { icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', title: 'Zero Hallucination', desc: 'Every price, rating, and coordinate is live from SerpApi.' },
];

const QUICK_TRIPS = [
  { from: 'Ahmedabad', to: 'Goa', days: 3, budget: 20000, travelers: 2, interests: ['Beaches', 'Food', 'Nightlife'], style: 'Balanced', badge: '🔥 Demo', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80' },
  { from: 'Delhi', to: 'Kerala', days: 5, budget: 32000, travelers: 2, interests: ['Nature', 'Relaxation', 'Food'], style: 'Relaxed', badge: '🌿 Popular', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80' },
  { from: 'Mumbai', to: 'Jaipur', days: 4, budget: 24000, travelers: 2, interests: ['Culture', 'History', 'Shopping'], style: 'Balanced', badge: '🏰 Heritage', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80' },
  { from: 'Bangalore', to: 'Manali', days: 6, budget: 38000, travelers: 2, interests: ['Adventure', 'Nature', 'Photography'], style: 'Adventure', badge: '⛰️ Scenic', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80' },
];

export default function LandingPage() {
  const { setFormData, generateTrip, setActiveScreen } = useTrip();
  const [heroIdx, setHeroIdx] = useState(0);
  const [mapsReady, setMapsReady] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(20000);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_DESTINATIONS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  function handleQuickSearch(e) {
    e.preventDefault();
    const data = {
      origin: from || 'Ahmedabad',
      destination: to || '',
      originCoords: null, destinationCoords: null,
      duration: days, travelers, budget,
      dates: { outbound: '', return: '' },
      interests: ['Beaches', 'Food', 'Culture'],
      travelStyle: 'Balanced',
      transportPreference: 'Flight',
      accommodationPreference: 'Hotel'
    };
    setFormData(data);
    if (!to) { setActiveScreen('builder'); return; }
    generateTrip(data);
  }

  function handlePreset(p) {
    const data = {
      origin: p.from, destination: p.to,
      originCoords: null, destinationCoords: null,
      duration: p.days, travelers: p.travelers, budget: p.budget,
      dates: { outbound: '', return: '' },
      interests: p.interests, travelStyle: p.style,
      transportPreference: 'Flight', accommodationPreference: 'Hotel'
    };
    setFormData(data);
    generateTrip(data);
  }

  const hero = HERO_DESTINATIONS[heroIdx];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── HERO ── */}
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image with crossfade */}
        <div className="absolute inset-0 z-0">
          {HERO_DESTINATIONS.map((d, i) => (
            <div
              key={d.name}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === heroIdx ? 1 : 0 }}
            >
              <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0f]" />
        </div>

        {/* Destination pill */}
        <div className="relative z-10 mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-white/90 transition-all">{hero.name}</span>
          <span className="text-white/50">·</span>
          <span className="text-white/60 text-xs">{hero.tag}</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
            <span className="text-white">Your AI</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Travel Agent
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Live flights, hotels & places from SerpApi. AI compares, optimizes, maps your route, and replans when things change.
          </p>
        </div>

        {/* ── INLINE SEARCH CARD ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              {/* From */}
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 px-1">From</label>
                {mapsReady ? (
                  <LocationAutocomplete
                    value={from}
                    onChange={(v) => setFrom(v)}
                    placeholder="City"
                    icon={MapPin}
                    iconColor="text-white/50"
                  />
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input value={from} onChange={e => setFrom(e.target.value)} placeholder="City"
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400" />
                  </div>
                )}
              </div>

              {/* To */}
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 px-1">To</label>
                {mapsReady ? (
                  <LocationAutocomplete
                    value={to}
                    onChange={(v) => setTo(v)}
                    placeholder="Destination"
                    icon={MapPin}
                    iconColor="text-cyan-400"
                  />
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input value={to} onChange={e => setTo(e.target.value)} placeholder="Destination"
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400" />
                  </div>
                )}
              </div>

              {/* Days */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 px-1">Days</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input type="number" min="1" max="14" value={days} onChange={e => setDays(+e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 px-1">Budget ₹</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input type="number" step="1000" min="5000" value={budget} onChange={e => setBudget(+e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              {/* CTA */}
              <button type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                <Sparkles className="w-4 h-4" />
                Plan Trip
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <button type="button" onClick={() => setActiveScreen('builder')}
                className="text-xs text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                More options & preferences
              </button>
              <span className="text-[10px] text-white/30">Powered by SerpApi · Google Maps</span>
            </div>
          </form>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30 text-xs">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── QUICK TRIP PRESETS ── */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">1-Click Demo Trips</p>
            <h2 className="text-3xl font-black text-white">Popular Routes</h2>
          </div>
          <button onClick={() => setActiveScreen('builder')}
            className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors">
            Custom trip <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_TRIPS.map(p => (
            <div key={p.to} onClick={() => handlePreset(p)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
              <div className="h-48 relative overflow-hidden">
                <img src={p.img} alt={p.to} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white">
                  {p.badge}
                </span>
              </div>
              <div className="p-4 bg-[#111118]">
                <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                  <span>{p.from}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span className="text-white font-semibold">{p.to}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{p.days}d</span>
                    <span>·</span>
                    <span>{p.travelers} pax</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">₹{p.budget.toLocaleString('en-IN')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-[#0d0d14] border-y border-white/5 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">The Difference</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Not just an itinerary generator</h2>
          <p className="text-white/40 mt-3 max-w-xl mx-auto">TravelOS AI is a decision agent — it researches, compares, optimizes, maps, and replans.</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Pipeline */}
          <div className="flex items-center justify-center gap-0 mb-16 overflow-x-auto pb-2">
            {['DISCOVER', 'SEARCH', 'COMPARE', 'OPTIMIZE', 'PLAN', 'MAP', 'REPLAN'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5 px-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-black">
                    {i + 1}
                  </div>
                  <span className="text-[10px] font-bold text-white/60 tracking-widest whitespace-nowrap">{step}</span>
                </div>
                {i < arr.length - 1 && <div className="w-6 h-px bg-white/10 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="p-5 rounded-2xl bg-[#111118] border border-white/5 hover:border-white/10 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL PROOF / STATS ── */}
      <div className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { val: 'Live', label: 'SerpApi Data', sub: 'Google Flights · Hotels · Maps' },
          { val: '7', label: 'AI Tools', sub: 'Search · Compare · Optimize · Replan' },
          { val: '∞', label: 'Destinations', sub: 'Any city in India & beyond' },
          { val: '0', label: 'Hallucinations', sub: 'All data grounded in SerpApi' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl bg-[#111118] border border-white/5">
            <div className="text-3xl font-black text-white mb-1">{s.val}</div>
            <div className="text-sm font-semibold text-white/70">{s.label}</div>
            <div className="text-[10px] text-white/30 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── FINAL CTA ── */}
      <div className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-[#111118] to-cyan-900/20 border border-indigo-500/20">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to plan smarter?</h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Enter any origin, destination, budget, and preferences. TravelOS AI does the rest.
          </p>
          <button onClick={() => setActiveScreen('builder')}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center gap-3 mx-auto transition-all hover:-translate-y-0.5">
            <Compass className="w-5 h-5" />
            Build My Trip
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Compass(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
