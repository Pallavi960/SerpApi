import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles,
  Send,
  Loader2,
  RefreshCw,
  Clock,
  IndianRupee,
  Sliders,
  Plane,
  Building,
  Calendar,
  Coffee,
  Sun,
  ShieldAlert
} from 'lucide-react';

const QUICK_SIMULATIONS = [
  { label: 'Reduce budget to ₹15,000', icon: IndianRupee, type: 'reduce_budget' },
  { label: 'Make Day 2 relaxed', icon: Coffee, type: 'make_relaxed' },
  { label: 'My flight is delayed by 4 hours', icon: Clock, type: 'flight_delayed' },
  { label: 'Add one more day', icon: Calendar, type: 'add_day' },
  { label: 'More nightlife & clubs', icon: Sun, type: 'more_nightlife' },
  { label: 'Avoid flights (Use express train)', icon: Plane, type: 'avoid_flights' }
];

export default function AiAssistantReplanner() {
  const { currentTrip, runWhatIf, isReplanning, chatMessages } = useTrip();
  const [inputText, setInputText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputText.trim() || isReplanning) return;
    const text = inputText;
    setInputText('');
    runWhatIf(text);
  }

  function handleQuickClick(sim) {
    if (isReplanning) return;
    runWhatIf(sim.label);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: What-If Quick Actions */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">What-If Simulator</h3>
          </div>
          <p className="text-xs text-slate-400">
            Click any simulation trigger to immediately update the itinerary, route, and budget dynamically.
          </p>

          <div className="space-y-2.5">
            {QUICK_SIMULATIONS.map(sim => {
              const Icon = sim.icon;
              return (
                <button
                  key={sim.label}
                  disabled={isReplanning}
                  onClick={() => handleQuickClick(sim)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500 hover:bg-slate-800 text-xs text-slate-200 font-medium flex items-center gap-2.5 transition-all group disabled:opacity-50"
                >
                  <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="flex-1">{sim.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Dynamic State Info */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Active Trip Parameters
          </div>
          <div>Destination: <strong className="text-white">{currentTrip?.destination}</strong></div>
          <div>Duration: <strong className="text-white">{currentTrip?.duration} Days</strong></div>
          <div>Total Estimated Cost: <strong className="text-emerald-400">₹{currentTrip?.budgetBreakdown?.totalEstimatedCost?.toLocaleString('en-IN')}</strong></div>
          {currentTrip?.lastReplannedAt && (
            <div className="text-[10px] text-slate-400 pt-1 border-t border-indigo-500/20">
              Last replanned: {new Date(currentTrip.lastReplannedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Right: AI Replanning Chat Interface */}
      <div className="lg:col-span-8 flex flex-col h-[560px] rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AI Travel Replanning Agent</h4>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready to adapt your itinerary
              </p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatMessages.map((msg, idx) => {
            const isAgent = msg.role === 'agent';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-md p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isAgent
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isReplanning && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>TravelOS AI is replanning and recalculating routes...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isReplanning}
            placeholder="Type any change, e.g. 'My flight is delayed by 4 hours' or 'Add more beach walks'..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isReplanning}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
