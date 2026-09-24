import React from 'react';
import { useTrip } from '../context/TripContext';
import { Sparkles, Plane, Building, MapPin, MessageSquare, Calculator, Sliders, CheckCircle2, Loader2, Circle } from 'lucide-react';

const ICONS = { 1: Plane, 2: Building, 3: MapPin, 4: MessageSquare, 5: Calculator, 6: Sliders };

export default function ResearchCenterPage() {
  const { researchSteps, formData } = useTrip();
  const doneCount = researchSteps.filter(s => s.status === 'done').length;
  const progress = Math.round((doneCount / researchSteps.length) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">

        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 animate-pulse opacity-30 blur-xl" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Sparkles className="w-9 h-9 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Researching your trip</h2>
        <p className="text-sm text-white/40 mb-2">
          <span className="text-white/70">{formData.origin}</span>
          <span className="mx-2 text-white/20">→</span>
          <span className="text-cyan-400 font-semibold">{formData.destination || 'Best destination'}</span>
        </p>
        <p className="text-xs text-white/25 mb-8">Live data from SerpApi · Google Flights · Hotels · Maps</p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2.5 text-left">
          {researchSteps.map(step => {
            const Icon = ICONS[step.id] || Sparkles;
            const done = step.status === 'done';
            const active = step.status === 'in-progress';
            return (
              <div key={step.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  done ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300'
                  : active ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                  : 'bg-white/2 border-white/5 text-white/25'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-emerald-500/15' : active ? 'bg-indigo-500/15' : 'bg-white/5'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{step.title}</p>
                  <p className="text-[10px] text-white/25 truncate">{step.detail}</p>
                </div>
                <div className="flex-shrink-0">
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {active && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                  {!done && !active && <Circle className="w-3.5 h-3.5 text-white/15" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
