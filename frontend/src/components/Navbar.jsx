import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Discover', href: '#discover' },
  { label: 'Plan',     href: '#plan' },
  { label: 'How it works', href: '#how' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'glass-light shadow-premium' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-glow-cyan">
            <span className="text-white text-sm font-black">T</span>
          </div>
          <span className={`text-lg font-black tracking-tight transition-colors
            ${scrolled ? 'text-navy-900' : 'text-white'}`}>
            TripWise
          </span>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
            AI
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${scrolled
                  ? 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#plan"
            className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-400 to-teal-500
              text-navy-900 hover:shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-200">
            Start Planning
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className={`md:hidden p-2 rounded-lg transition-colors
            ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          aria-label="Toggle menu">
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 rounded transition-all duration-300
              ${scrolled ? 'bg-slate-700' : 'bg-white'}
              ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 rounded transition-all duration-300
              ${scrolled ? 'bg-slate-700' : 'bg-white'}
              ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 rounded transition-all duration-300
              ${scrolled ? 'bg-slate-700' : 'bg-white'}
              ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-light border-t border-slate-200/60 px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              {label}
            </a>
          ))}
          <a href="#plan" onClick={() => setMobileOpen(false)}
            className="block mt-2 px-4 py-3 rounded-xl text-sm font-bold text-center
              bg-gradient-to-r from-cyan-400 to-teal-500 text-navy-900">
            Start Planning
          </a>
        </div>
      )}
    </header>
  )
}
