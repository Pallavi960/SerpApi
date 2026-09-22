const FEATURES = [
  {
    icon: '⚡',
    title: 'Live Discovery',
    desc: 'Get current destination and travel information powered by real-time search data.',
    color: 'from-cyan-400/20 to-teal-400/10',
    border: 'border-cyan-400/20',
    iconBg: 'bg-cyan-400/10 text-cyan-500',
  },
  {
    icon: '🎯',
    title: 'Personalized Planning',
    desc: 'Discover places that match your exact interests, budget and travel style.',
    color: 'from-amber-400/20 to-orange-400/10',
    border: 'border-amber-400/20',
    iconBg: 'bg-amber-400/10 text-amber-500',
  },
  {
    icon: '🗓️',
    title: 'Smart Itineraries',
    desc: 'Build practical day-by-day travel plans tailored around your preferences.',
    color: 'from-violet-400/20 to-purple-400/10',
    border: 'border-violet-400/20',
    iconBg: 'bg-violet-400/10 text-violet-500',
  },
  {
    icon: '💰',
    title: 'Budget Intelligence',
    desc: 'Understand your estimated trip expenses before you book anything.',
    color: 'from-emerald-400/20 to-green-400/10',
    border: 'border-emerald-400/20',
    iconBg: 'bg-emerald-400/10 text-emerald-500',
  },
]

export default function FeatureSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            ✦ FEATURES
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 mb-4">
            Everything you need<br />to plan better
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            TripWise AI combines live data with intelligent planning to make every trip exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, desc, color, border, iconBg }) => (
            <div key={title}
              className={`group relative bg-gradient-to-br ${color} rounded-2xl p-6
                border ${border} hover:shadow-card-hover hover:-translate-y-1
                transition-all duration-300 cursor-default`}>
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl mb-5
                group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="text-navy-900 font-bold text-base mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
