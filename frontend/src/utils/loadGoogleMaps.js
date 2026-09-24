/**
 * Loads the Google Maps JavaScript API once.
 * Subsequent calls return the same promise.
 * Libraries: places (autocomplete) + geometry (directions rendering)
 */
let loadPromise = null;

export function loadGoogleMaps() {
  if (loadPromise) return loadPromise;

  // Already loaded
  if (window.google?.maps?.places) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn('[TravelOS] VITE_GOOGLE_MAPS_API_KEY is not set. Maps & autocomplete will be limited.');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    const callbackName = '__googleMapsLoaded__';
    window[callbackName] = () => {
      delete window[callbackName];
      resolve();
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
