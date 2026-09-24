import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Building,
  Plane,
  ArrowRight
} from 'lucide-react';

export default function CheckForChangesModal() {
  const {
    liveChangesModalOpen,
    setLiveChangesModalOpen,
    liveChangesReport,
    runWhatIf,
    optimizeTripBudget
  } = useTrip();

  if (!liveChangesModalOpen || !liveChangesReport) return null;

  const isPriceChanged = liveChangesReport.status === 'price_changed';
  const hotelUpdate = liveChangesReport.hotelUpdate || {};
  const flightUpdate = liveChangesReport.flightUpdate || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={() => setLiveChangesModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Live SerpApi Status Monitor
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Trip Price & Schedule Verification
        </h3>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {liveChangesReport.summary}
        </p>

        {/* Change Comparison Card */}
        {isPriceChanged && (
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{hotelUpdate.hotelName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Rate Changed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-700/60">
              <div className="p-2 rounded-xl bg-slate-800">
                <span className="text-[10px] text-slate-400 block">Previous</span>
                <span className="text-xs font-bold text-slate-200">
                  ₹{hotelUpdate.previousRate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-amber-500/40">
                <span className="text-[10px] text-amber-400 block">Current Live</span>
                <span className="text-xs font-bold text-amber-300">
                  ₹{hotelUpdate.currentRate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800">
                <span className="text-[10px] text-emerald-400 block">Alternative</span>
                <span className="text-xs font-bold text-emerald-300">
                  ₹{(hotelUpdate.alternativeOption?.pricePerNight || hotelUpdate.previousRate)?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setLiveChangesModalOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Keep Current
          </button>

          {isPriceChanged && hotelUpdate.alternativeOption && (
            <button
              onClick={() => {
                setLiveChangesModalOpen(false);
                runWhatIf(`Switch hotel to ${hotelUpdate.alternativeOption.name}`);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              Use Alternative
            </button>
          )}

          <button
            onClick={() => {
              setLiveChangesModalOpen(false);
              optimizeTripBudget();
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Replan Trip
          </button>
        </div>
      </div>
    </div>
  );
}
