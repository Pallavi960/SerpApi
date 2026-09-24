import React from 'react';
import { useTrip } from '../context/TripContext';
import SmartItineraryView from '../components/SmartItineraryView';
import TravelIntelligenceView from '../components/TravelIntelligenceView';
import AiAssistantReplanner from '../components/AiAssistantReplanner';
import CheckForChangesModal from '../components/CheckForChangesModal';
import InteractiveRouteMap from '../components/InteractiveRouteMap';
import PlaceImage from '../components/PlaceImage';
import {
  Compass,
  Calendar,
  Users,
  IndianRupee,
  Plane,
  Building,
  MapPin,
  RefreshCw,
  Sliders,
  Sparkles,
  AlertCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Brain,
  MessageSquare
} from 'lucide-react';

export default function DashboardPage() {
  const {
    currentTrip,
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
    optimizeTripBudget,
    checkForChanges,
    isCheckingChanges,
    isReplanning,
    resetTrip
  } = useTrip();

  if (!currentTrip) return null;

  const {
    destination,
    origin,
    duration,
    travelers,
    budget,
    budgetBreakdown,
    budgetStatus,
    selectedOptions,
    liveData,
    itinerary
  } = currentTrip;

  const totalCost = budgetBreakdown?.totalEstimatedCost || 0;
  const isOverBudget = budgetStatus?.isOverBudget;
  const overBudgetDiff = budgetStatus?.difference || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Calendar },
    { id: 'map', label: 'Interactive Route Map', icon: MapPin },
    { id: 'flights', label: 'Flights & Transit', icon: Plane },
    { id: 'hotels', label: 'Hotels & Stays', icon: Building },
    { id: 'budget', label: 'Budget Optimizer', icon: IndianRupee },
    { id: 'intelligence', label: 'AI Reasoning & Reviews', icon: Brain },
    { id: 'assistant', label: 'AI Replanner & What-If', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── DESTINATION HERO IMAGE ── */}
        <div className="relative w-full h-56 md:h-72 rounded-3xl overflow-hidden shadow-2xl">
          <PlaceImage
            query={`${destination} travel landscape scenic`}
            alt={destination}
            className="w-full h-full object-cover"
            skeletonClassName="absolute inset-0"
            eager
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-xs font-semibold text-cyan-300 mb-1 tracking-widest uppercase">from {origin}</p>
            <h1 className="text-3xl md:text-5xl font-black text-white">{destination}</h1>
            <p className="text-sm text-white/70 mt-1">
              {duration} Days · {travelers} Travelers · ₹{totalCost.toLocaleString('en-IN')} estimated
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-bold text-cyan-300 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-cyan-400/30">
              📸 via SerpApi Images
            </span>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TravelOS AI Live Decision Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              {destination}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                from {origin}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span>{duration} Days</span>
              <span>•</span>
              <span>{travelers} Travelers</span>
              <span>•</span>
              <span>Allocated Budget: <strong className="text-white">₹{budget?.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={checkForChanges}
              disabled={isCheckingChanges}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingChanges ? 'animate-spin' : ''}`} />
              <span>Check for Changes</span>
            </button>

            {isOverBudget && (
              <button
                onClick={optimizeTripBudget}
                disabled={isReplanning}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Optimize for Budget</span>
              </button>
            )}

            <button
              onClick={resetTrip}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              New Journey
            </button>
          </div>
        </div>

        {/* Budget Alert Banner (If Over Budget) */}
        {isOverBudget && (
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">
                  Your current plan exceeds your budget by ₹{overBudgetDiff.toLocaleString('en-IN')}.
                </strong>
                <span className="text-amber-300">
                  {budgetStatus?.alternatives?.suggestions?.[0] || 'Lower-cost flight and hotel options are available via SerpApi.'}
                </span>
              </div>
            </div>

            <button
              onClick={optimizeTripBudget}
              disabled={isReplanning}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap transition-colors"
            >
              Auto-Optimize for ₹{budget.toLocaleString('en-IN')}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-t-xl text-xs font-bold tracking-wide whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 text-white bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Estimated Cost</span>
                <span className="text-2xl font-extrabold text-white">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  ~₹{budgetBreakdown?.costPerPerson?.toLocaleString('en-IN')} per person
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Budget Status</span>
                <span className={`text-xl font-bold ${isOverBudget ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isOverBudget ? `Exceeds by ₹${overBudgetDiff.toLocaleString('en-IN')}` : `Within Budget (₹${budgetStatus?.remaining?.toLocaleString('en-IN')} left)`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Target: ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Selected Stay</span>
                <span className="text-sm font-bold text-white line-clamp-1">
                  {selectedOptions.hotel?.name}
                </span>
                <span className="text-[10px] text-indigo-400 block mt-1">
                  ₹{selectedOptions.hotel?.pricePerNight?.toLocaleString('en-IN')}/night • ★ {selectedOptions.hotel?.rating || 4.5}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Transit / Flight</span>
                <span className="text-sm font-bold text-white line-clamp-1">
                  {selectedOptions.flight?.airline}
                </span>
                <span className="text-[10px] text-cyan-400 block mt-1">
                  ₹{selectedOptions.flight?.price?.toLocaleString('en-IN')} • {selectedOptions.flight?.duration}
                </span>
              </div>
            </div>

            {/* Quick Itinerary Preview with Map */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Day-by-Day Journey Preview
                </h3>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  View Full Itinerary & Route
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {itinerary?.slice(0, 3).map(day => (
                  <div key={day.day} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                    <span className="text-xs font-bold text-indigo-400">Day {day.day}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{day.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {day.activities?.[0]?.title} → {day.activities?.[1]?.title}
                    </p>
                    <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-700/40">
                      <span>{day.activities?.length || 0} stops</span>
                      <span>~{day.totalTravelTimeMinutes || 30} mins transit</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Rationale Teaser */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  AI Decision Rationale Available
                </h4>
                <p className="text-xs text-slate-400 max-w-2xl">
                  {currentTrip.decisions?.whyHotel}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('intelligence')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Inspect AI Reasoning
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SMART ITINERARY */}
        {activeTab === 'itinerary' && <SmartItineraryView />}

        {/* TAB 3: INTERACTIVE ROUTE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <InteractiveRouteMap
              dayData={itinerary?.find(d => d.day === selectedDay) || itinerary?.[0]}
              hotel={selectedOptions.hotel}
              destination={destination}
            />
          </div>
        )}

        {/* TAB 4: FLIGHTS & TRANSIT */}
        {activeTab === 'flights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Plane className="w-5 h-5 text-cyan-400" />
                Live SerpApi Google Flights Search ({origin} → {destination})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveData?.flights?.map((fl, idx) => (
                <div
                  key={fl.id || idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    fl.airline === selectedOptions.flight?.airline
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white text-sm">{fl.airline}</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      ₹{fl.price?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                    <div>
                      <span className="font-bold text-white block">{fl.departureTime}</span>
                      <span className="text-[11px] text-slate-400">{origin}</span>
                    </div>
                    <div className="text-center text-[10px] text-slate-400">
                      <span>{fl.duration}</span>
                      <div className="w-16 h-0.5 bg-slate-700 my-0.5 mx-auto" />
                      <span>{fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">{fl.arrivalTime}</span>
                      <span className="text-[11px] text-slate-400">{destination}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Verified on Google Flights</span>
                    <a
                      href={fl.bookingLink || 'https://www.google.com/travel/flights'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      View Live Fare <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HOTELS & STAYS */}
        {activeTab === 'hotels' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-400" />
              Live SerpApi Google Hotels Search ({destination})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {liveData?.hotels?.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    h.name === selectedOptions.hotel?.name
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  {/* Hotel image: prefer SerpApi-returned image, fallback to dynamic search */}
                  <div className="relative h-44">
                    <PlaceImage
                      query={h.image ? null : `${h.name} ${destination} hotel exterior`}
                      fallbackSrc={h.image || null}
                      alt={h.name}
                      className="w-full h-full object-cover"
                      skeletonClassName="absolute inset-0"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-bold">★ {h.rating || 4.5}</span>
                      <span className="text-sm font-extrabold text-white">
                        ₹{h.pricePerNight?.toLocaleString('en-IN')}/night
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-1">{h.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{h.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {h.amenities?.slice(0, 3).map((am, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BUDGET OPTIMIZER */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                Dynamic Budget Itemization
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Flights ({travelers}p)</span>
                  <span className="text-base font-bold text-white">₹{budgetBreakdown?.flights?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Accommodation</span>
                  <span className="text-base font-bold text-white">₹{budgetBreakdown?.accommodation?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Food & Dining</span>
                  <span className="text-base font-bold text-white">₹{budgetBreakdown?.foodAndDining?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Activities & Tickets</span>
                  <span className="text-base font-bold text-white">₹{budgetBreakdown?.activitiesAndSightseeing?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Local Cabs / Transit</span>
                  <span className="text-base font-bold text-white">₹{budgetBreakdown?.localTransit?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress Bar of Budget Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span>Budget Utilization</span>
                  <span>{Math.round((totalCost / budget) * 100)}% of ₹{budget.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI REASONING & REVIEWS */}
        {activeTab === 'intelligence' && <TravelIntelligenceView />}

        {/* TAB 8: AI REPLANNER & WHAT-IF */}
        {activeTab === 'assistant' && <AiAssistantReplanner />}

        {/* Live Changes Verification Modal */}
        <CheckForChangesModal />
      </div>
    </div>
  );
}
