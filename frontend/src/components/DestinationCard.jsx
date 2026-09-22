// Destination colors used as CSS gradient backgrounds (no external image API)
const PALETTE = [
  'from-teal-800 to-navy-900',
  'from-blue-800 to-navy-950',
  'from-emerald-800 to-teal-900',
  'from-indigo-800 to-navy-900',
  'from-cyan-800 to-navy-950',
  'from-violet-800 to-navy-900',
]

const ICONS = ['🏔️', '🌊', '🌿', '🏛️', '🌅', '🗺️']

export default function DestinationCard({ destination, index = 0, featured = false }) {
  const { name, description, link } = destination
  const palette = PALETTE[index % PALETTE.length]
  const icon    = ICONS[index % ICONS.length]

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${palette}
      ${featured ? 'h-72 sm:h-80' : 'h-56 sm:h-64'}
      hover:shadow-card-hover transition-all duration-300 cursor-pointer`}>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />

      {/* Large background icon */}
      <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 select-none">
        {icon}
      </div>

      {/* Card gradient overlay */}
      <div className="absolute inset-0 bg-card-gradient" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Source badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 text-xs font-semibold">via SerpApi</span>
        </div>

        <h3 className={`font-black text-white leading-tight mb-1.5 line-clamp-2
          ${featured ? 'text-xl' : 'text-base'}`}>
          {name}
        </h3>

        {description && (
          <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400
              hover:text-cyan-300 transition-colors group/link">
            Explore
            <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
          </a>
        ) : (
          <span className="text-white/30 text-xs">No link available</span>
        )}
      </div>
    </div>
  )
}
