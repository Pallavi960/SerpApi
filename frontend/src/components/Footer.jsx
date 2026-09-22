const LINKS = {
  Product: [
    { label: 'Discover',    href: '#discover' },
    { label: 'Plan a Trip', href: '#plan' },
    { label: 'How it Works',href: '#how' },
  ],
  Company: [
    { label: 'About',       href: '#' },
    { label: 'My Trips',    href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <span className="text-white text-sm font-black">T</span>
              </div>
              <span className="text-lg font-black tracking-tight">TripWise</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                AI
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              AI-powered travel planning using live search data. Discover destinations,
              compare options and build personalized itineraries.
            </p>
            {/* Live data badge */}
            <div className="inline-flex items-center gap-2 mt-6 glass px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow" />
              <span className="text-cyan-400 text-xs font-semibold">LIVE TRAVEL DATA</span>
              <span className="text-white/30 text-xs">· Powered by SerpApi</span>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-200">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 TripWise AI — SerpApi India Hackathon · Track 03: Travel & Local Discovery
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-slow" />
            <span className="text-white/30 text-xs">All data sourced live via SerpApi</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
