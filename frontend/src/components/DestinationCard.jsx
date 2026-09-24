import PlaceImage from './PlaceImage';

export default function DestinationCard({ destination, index = 0, featured = false, onSelect }) {
  const { name, tagline, estimatedCostFormatted, interestMatch, whyRecommended, coverImage } = destination;

  return (
    <div
      onClick={() => onSelect && onSelect(destination)}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer
        ${featured ? 'h-72 sm:h-80' : 'h-60 sm:h-68'}
        hover:shadow-card-hover transition-all duration-300`}
    >
      {/* Real destination image via SerpApi */}
      <PlaceImage
        query={`${name} travel destination India`}
        fallbackSrc={coverImage || null}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        skeletonClassName="absolute inset-0"
        eager={index < 2}
      />

      {/* Dark gradient overlay so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-cyan-300 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-cyan-400/30">
          via SerpApi
        </span>
        {interestMatch === 'High' && (
          <span className="text-[10px] font-bold text-emerald-300 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-emerald-400/30">
            ✦ High Match
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-black text-white leading-tight mb-1 line-clamp-1 ${featured ? 'text-xl' : 'text-base'}`}>
          {name}
        </h3>

        {tagline && (
          <p className="text-white/70 text-xs leading-snug line-clamp-2 mb-2">{tagline}</p>
        )}

        <div className="flex items-center justify-between">
          {estimatedCostFormatted && (
            <span className="text-xs font-bold text-cyan-300">{estimatedCostFormatted}</span>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
          >
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
}
