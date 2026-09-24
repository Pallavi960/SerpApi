import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

/**
 * LocationAutocomplete
 * Uses Google Places Autocomplete API to show real place suggestions.
 * Requires window.google.maps.places to be loaded (via loadGoogleMaps util).
 *
 * Props:
 *   value        — current string value
 *   onChange     — (value: string, placeData?: {lat, lng, formatted}) => void
 *   placeholder  — input placeholder
 *   icon         — optional Lucide icon component (defaults to MapPin)
 *   iconColor    — tailwind text color class for icon
 *   required     — html required
 */
export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Enter a city or place',
  icon: Icon = MapPin,
  iconColor = 'text-indigo-400',
  required = false
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function getService() {
    if (!window.google?.maps?.places) return null;
    if (!autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
    return autocompleteRef.current;
  }

  function handleInput(e) {
    const text = e.target.value;
    onChange(text);

    if (!text || text.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const service = getService();
      if (!service) return;

      setLoading(true);
      service.getPlacePredictions(
        {
          input: text,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: 'in' }, // India-focused
          types: ['(cities)']
        },
        (predictions, status) => {
          setLoading(false);
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions?.length
          ) {
            setSuggestions(predictions);
            setShowDropdown(true);
          } else {
            setSuggestions([]);
            setShowDropdown(false);
          }
        }
      );
    }, 250);
  }

  function handleSelect(prediction) {
    // Reset session token after selection (billing best practice)
    sessionTokenRef.current = null;
    setSuggestions([]);
    setShowDropdown(false);

    // Get place details for lat/lng
    const placesDiv = document.createElement('div');
    const detailsService = new window.google.maps.places.PlacesService(placesDiv);
    detailsService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry', 'formatted_address', 'name']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          onChange(prediction.structured_formatting.main_text, {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            formatted: place.formatted_address
          });
        } else {
          onChange(prediction.structured_formatting.main_text);
        }
      }
    );
  }

  function handleClear() {
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative">
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor} z-10 pointer-events-none`} />

      <input
        ref={inputRef}
        type="text"
        required={required}
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
      />

      {/* Clear / Loading indicator */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((pred) => (
            <li key={pred.place_id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur before click
                  handleSelect(pred);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-start gap-3 border-b border-slate-800/60 last:border-0"
              >
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-white block truncate">
                    {pred.structured_formatting.main_text}
                  </span>
                  <span className="text-xs text-slate-400 truncate block">
                    {pred.structured_formatting.secondary_text}
                  </span>
                </div>
              </button>
            </li>
          ))}
          <li className="px-4 py-2 flex items-center justify-end gap-1">
            <span className="text-[10px] text-slate-500">powered by</span>
            <img
              src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
              alt="Powered by Google"
              className="h-3 opacity-40"
            />
          </li>
        </ul>
      )}
    </div>
  );
}
