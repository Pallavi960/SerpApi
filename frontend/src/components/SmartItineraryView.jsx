import React from 'react';
import { useTrip } from '../context/TripContext';
import InteractiveRouteMap from './InteractiveRouteMap';
import PlaceImage from './PlaceImage';
import {
  Clock,
  Car,
  Compass,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  MapPin,
  IndianRupee
} from 'lucide-react';

export default function SmartItineraryView() {
  const { currentTrip, selectedDay, setSelectedDay } = useTrip();

  if (!currentTrip?.itinerary) return null;

  const itineraryDays = currentTrip.itinerary || [];
  const activeDayData = itineraryDays.find(d => d.day === selectedDay) || itineraryDays[0];

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {itineraryDays.map(d => {
          const isSelected = d.day === selectedDay;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Day {d.day}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map + Day Route Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Interactive Route Map */}
        <div className="lg:col-span-6 space-y-4">
          <InteractiveRouteMap
            dayData={activeDayData}
            hotel={currentTrip.selectedOptions?.hotel}
            destination={currentTrip.destination}
          />

          {/* Route Stats Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>
                Total Transit: <strong>{activeDayData.totalTravelTimeMinutes || 35} mins</strong>
              </span>
            </div>
            <span>•</span>
            <div>
              Distance: <strong>{activeDayData.totalDistanceKm || 12} km</strong>
            </div>
            <span>•</span>
            <div className="text-emerald-400 font-semibold">
              Grouped Proximity
            </div>
          </div>
        </div>

        {/* Right: Chronological Itinerary Stops */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {activeDayData.title}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {activeDayData.activities?.length || 0} Curated Stops
            </span>
          </div>

          <div className="space-y-4">
            {activeDayData.activities?.map((act, index) => {
              const pinColor = index === 0 ? 'bg-cyan-500' : index === 1 ? 'bg-amber-500' : index === 2 ? 'bg-pink-500' : 'bg-emerald-500';

              return (
                <div
                  key={act.id || index}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all shadow-lg space-y-3 relative overflow-hidden"
                >
                  {/* Transit Buffer Header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${pinColor}`}>
                        {act.order || index + 1}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {act.time}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {act.category}
                    </span>
                  </div>

                  {/* Thumbnail + Title row */}
                  <div className="flex items-center gap-3">
                    {/* Compact place thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <PlaceImage
                        query={
                          act.placeDetails?.thumbnail
                            ? null
                            : `${act.title} ${currentTrip.destination}`
                        }
                        fallbackSrc={act.placeDetails?.thumbnail || null}
                        alt={act.title}
                        className="w-full h-full object-cover"
                        skeletonClassName="absolute inset-0"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-white leading-tight line-clamp-2">
                        {act.title}
                      </h4>
                      <div className="text-xs text-indigo-400 flex items-center gap-1 font-medium mt-0.5">
                        <Car className="w-3.5 h-3.5" />
                        {act.travelTimeFromPrev}
                      </div>
                    </div>
                  </div>

                  {/* Reason for Selection */}
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-300 block mb-0.5">Why Selected:</span>
                      {act.selectionReason}
                    </div>
                  </div>

                  {/* Footer with Cost & Pro-Tip */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-400" />
                      {act.tip || 'Buffer time reserved for relaxed exploration.'}
                    </span>

                    {act.approxCost > 0 ? (
                      <span className="text-slate-200 font-semibold">
                        ~₹{act.approxCost}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        Free Entry
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
