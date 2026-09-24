import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationAutocomplete from '../components/LocationAutocomplete';
import PlaceImage from '../components/PlaceImage';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  MapPin, Calendar, Users, IndianRupee, Sparkles,
  ArrowRight, CheckCircle2, X, Loader2, ChevronRight
} from 'lucide-react';

const INTERESTS = [
  { id: 'Beaches', emoji: '🏖️' }, { id: 'Food', emoji: '🍜' },
  { id: 'Culture', emoji: '🏛️' }, { id: 'History', emoji: '🏰' },
  { id: 'Adventure', emoji: '🧗' }, { id: 'Nature', emoji: '🌿' },
  { id: 'Shopping', emoji: '🛍️' }, { id: 'Nightlife', emoji: '🎶' },
  { id: 'Family', emoji: '👨‍👩‍👧' }, { id: 'Photography', emoji: '📷' },
  { id: 'Relaxation', emoji: '🧘' },
];

const STYLES = ['Budget', 'Balanced', 'Luxury', 'Adventure', 'Relaxed', 'Family', 'Backpacking'];
const STAYS = ['Hotel', 'Boutique Resort', 'Hostel / Co-living', 'Homestay'];
const TRANSITS = ['Flight', 'Train / Express Rail', 'Self-Drive / Taxi'];

export default function TripBuilderPage() {
  const { formData, setFormData, generateTrip, runDestinationDiscovery, destinationsDiscovery, isDiscovering, setActiveScreen } = useTrip();
  const [mapsReady, setMapsReady] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  function handleOriginChange(v, place) {
    setFormData(p => ({ ...p, origin: v, originCoords: place ? { lat: place.lat, lng: place.lng } : p.originCoords }));
  }
  function handleDestChange(v, place) {
    setFormData(p => ({ ...p, destination: v, destinationCoords: place ? { lat: place.lat, lng: place.lng } : p.destinationCoords }));
  }
  function toggleInterest(id) {
    setFormData(p => {
      const has = p.interests.includes(id);
      return { ...p, interests: has ? p.interests.filter(i => i !== id) : [...p.interests, id] };
    });
  }
  async function openDiscovery() {
    setDiscoveryOpen(true);
    await runDestinationDiscovery({ origin: formData.origin, budget: formData.budget, duration: formData.duration, interests: formData.interests });
  }
  function selectDest(dest) {
    setFormData(p => ({ ...p, destination: dest.name }));
    setDiscoveryOpen(false);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.destination?.trim()) { openDiscovery(); return; }
    generateTrip();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => setActiveScreen('landing')} className="text-xs text-white/30 hover:text-white/60 mb-4 flex items-center gap-1 transition-colors">
            ← Home
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-white">Plan your trip</h1>
          <p className="text-white/40 text-sm mt-1">Fill in your details. AI researches live data and builds your itinerary.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Main Form ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Route */}
              <Card title="Where are you going?">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="From">
                    {mapsReady
                      ? <LocationAutocomplete value={formData.origin} onChange={handleOriginChange} placeholder="Origin city" icon={MapPin} iconColor="text-white/40" required />
                      : <PlainInput icon={<MapPin className="w-4 h-4 text-white/40" />} value={formData.origin} onChange={v => setFormData(p => ({ ...p, origin: v }))} placeholder="Origin city" required />
                    }
                  </Field>
                  <Field label={
                    <div className="flex items-center justify-between">
                      <span>To</span>
                      <button type="button" onClick={openDiscovery} className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
                        <Sparkles className="w-3 h-3" /> Help me choose
                      </button>
                    </div>
                  }>
                    {mapsReady
                      ? <LocationAutocomplete value={formData.destination} onChange={handleDestChange} placeholder="Destination (or leave empty)" icon={MapPin} iconColor="text-cyan-400" />
                      : <PlainInput icon={<MapPin className="w-4 h-4 text-cyan-400" />} value={formData.destination} onChange={v => setFormData(p => ({ ...p, destination: v }))} placeholder="Destination" />
                    }
                  </Field>
                </div>
              </Card>

              {/* Trip Details */}
              <Card title="Trip details">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Days">
                    <NumInput icon={<Calendar className="w-4 h-4 text-white/40" />} value={formData.duration} min={1} max={14}
                      onChange={v => setFormData(p => ({ ...p, duration: v }))} />
                  </Field>
                  <Field label="Travelers">
                    <NumInput icon={<Users className="w-4 h-4 text-white/40" />} value={formData.travelers} min={1} max={10}
                      onChange={v => setFormData(p => ({ ...p, travelers: v }))} />
                  </Field>
                  <Field label="Budget (₹)">
                    <NumInput icon={<IndianRupee className="w-4 h-4 text-emerald-400" />} value={formData.budget} min={5000} step={1000}
                      onChange={v => setFormData(p => ({ ...p, budget: v }))} />
                  </Field>
                </div>
              </Card>

              {/* Travel Style */}
              <Card title="Travel style">
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <Pill key={s} active={formData.travelStyle === s} onClick={() => setFormData(p => ({ ...p, travelStyle: s }))}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </Card>

              {/* Interests */}
              <Card title="Interests">
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, emoji }) => (
                    <Pill key={id} active={formData.interests.includes(id)} onClick={() => toggleInterest(id)}>
                      <span>{emoji}</span> {id}
                    </Pill>
                  ))}
                </div>
              </Card>

              {/* Preferences */}
              <Card title="Preferences">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Stay">
                    <select value={formData.accommodationPreference}
                      onChange={e => setFormData(p => ({ ...p, accommodationPreference: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                      {STAYS.map(s => <option key={s} value={s} className="bg-[#111118]">{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Transit">
                    <select value={formData.transportPreference}
                      onChange={e => setFormData(p => ({ ...p, transportPreference: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                      {TRANSITS.map(t => <option key={t} value={t} className="bg-[#111118]">{t}</option>)}
                    </select>
                  </Field>
                </div>
              </Card>
            </div>

            {/* ── RIGHT: Summary + CTA ── */}
            <div className="space-y-4">
              <div className="sticky top-20 space-y-4">
                <div className="p-5 rounded-2xl bg-[#111118] border border-white/8">
                  <h3 className="text-sm font-bold text-white mb-4">Trip Summary</h3>
                  <div className="space-y-3 text-xs">
                    <SummaryRow label="From" value={formData.origin || '—'} />
                    <SummaryRow label="To" value={formData.destination || 'Not set'} highlight={!formData.destination} />
                    <SummaryRow label="Duration" value={`${formData.duration} days`} />
                    <SummaryRow label="Travelers" value={formData.travelers} />
                    <SummaryRow label="Budget" value={`₹${Number(formData.budget).toLocaleString('en-IN')}`} green />
                    <SummaryRow label="Style" value={formData.travelStyle} />
                  </div>

                  {formData.interests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.interests.map(i => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{i}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                  <Sparkles className="w-4 h-4" />
                  Generate My Trip
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button type="button" onClick={openDiscovery}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-white/50 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Help me choose a destination
                </button>

                <p className="text-[10px] text-white/20 text-center">
                  Live data via SerpApi · Google Flights · Hotels · Maps
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Destination Discovery Modal */}
      {discoveryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111118] border border-white/10 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 relative">
            <button onClick={() => setDiscoveryOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">AI Discovery</p>
              <h2 className="text-xl font-black text-white">Best destinations from {formData.origin || 'your city'}</h2>
              <p className="text-xs text-white/30 mt-1">Ranked by interest match, travel cost & accessibility within ₹{Number(formData.budget).toLocaleString('en-IN')}</p>
            </div>

            {isDiscovering ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-white/50">Searching destinations...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {destinationsDiscovery.map(dest => (
                  <div key={dest.name}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/20 transition-all cursor-pointer group"
                    onClick={() => selectDest(dest)}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <PlaceImage
                        query={`${dest.name} travel destination India`}
                        fallbackSrc={dest.coverImage || null}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        skeletonClassName="absolute inset-0"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-sm">{dest.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dest.interestMatch === 'High' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {dest.interestMatch} Match
                        </span>
                      </div>
                      <p className="text-xs text-white/30 truncate">{dest.tagline}</p>
                      <p className="text-xs text-emerald-400 font-semibold mt-1">{dest.estimatedCostFormatted}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──
function Card({ title, children }) {
  return (
    <div className="p-5 rounded-2xl bg-[#111118] border border-white/8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5">
        {typeof label === 'string' ? label : label}
      </label>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
        active
          ? 'bg-indigo-600/80 text-white border border-indigo-400/50 shadow-md shadow-indigo-500/20'
          : 'bg-white/5 text-white/50 border border-white/8 hover:border-white/20 hover:text-white'
      }`}>
      {children}
    </button>
  );
}

function PlainInput({ icon, value, onChange, placeholder, required }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input type="text" required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
    </div>
  );
}

function NumInput({ icon, value, onChange, min, max, step = 1 }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input type="number" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseInt(e.target.value, 10) || min)}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
    </div>
  );
}

function SummaryRow({ label, value, highlight, green }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/30">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-amber-400' : green ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}
