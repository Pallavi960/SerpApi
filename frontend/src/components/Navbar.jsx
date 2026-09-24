import React from 'react';
import { useTrip } from '../context/TripContext';
import { Sparkles, MapPin } from 'lucide-react';

export default function Navbar() {
  const { activeScreen, setActiveScreen, currentTrip } = useTrip();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <button onClick={() => setActiveScreen('landing')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xs">T</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base tracking-tight text-white">
              Travel<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">OS</span>
            </span>
            <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn active={activeScreen === 'builder'} onClick={() => setActiveScreen('builder')}>
            Plan Trip
          </NavBtn>
          {currentTrip && (
            <NavBtn active={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')}>
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {currentTrip.destination}
            </NavBtn>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SerpApi Live
          </div>
          <button
            onClick={() => setActiveScreen('builder')}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
          >
            Plan Trip
          </button>
        </div>
      </div>
    </header>
  );
}

function NavBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
