const STEPS = [
  { num: '01', title: 'Tell Us Your Preferences', desc: 'Share your origin, budget, dates and interests.' },
  { num: '02', title: 'Discover Real Places',     desc: 'We search live data to find matching destinations.' },
  { num: '03', title: 'Compare Your Options',     desc: 'Review destinations and travel information.' },
  { num: '04', title: 'Build Your Journey',       desc: 'Generate a personalized day-by-day itinerary.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-navy-50 text-navy-600 text-xs font-bold px-3 py-1.5 rounded-full border border-navy-200 mb-4">
            ✦ HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 mb-4">
            From idea to itinerary
          </h2>
          <p className="text-slate-500 text-lg">Four simple steps to your perfect trip.</p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-400/30 via-teal-400/50 to-cyan-400/30" />

          <div className="grid grid-cols-4 gap-6">
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className="relative flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-2 border-slate-200
                  group-hover:border-cyan-400 group-hover:shadow-glow-cyan
                  flex flex-col items-center justify-center mb-6 transition-all duration-300">
                  <span className="text-xs font-black text-cyan-500 tracking-widest">{num}</span>
                </div>
                <h3 className="text-navy-900 font-bold text-base mb-2 leading-snug">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile stacked */}
        <div className="lg:hidden space-y-6">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="flex gap-5 items-start">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-navy-900 flex items-center justify-center">
                <span className="text-cyan-400 text-xs font-black tracking-widest">{num}</span>
              </div>
              <div className="pt-1">
                <h3 className="text-navy-900 font-bold text-base mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
