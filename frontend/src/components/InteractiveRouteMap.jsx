import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import { MapPin, Navigation, Sparkles, Car } from 'lucide-react';

const PIN_COLORS = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];

// Destination coordinate dictionary for accurate map centering
const CITY_COORDINATES = {
  udaipur: { lat: 24.5854, lng: 73.7125 },
  goa: { lat: 15.4989, lng: 73.8278 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  kerala: { lat: 9.9312, lng: 76.2673 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  manali: { lat: 32.2432, lng: 77.1892 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  agra: { lat: 27.1767, lng: 78.0081 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  amritsar: { lat: 31.6340, lng: 74.8723 },
  chandigarh: { lat: 30.7333, lng: 76.7794 }
};

function getCityCenter(destination) {
  if (!destination) return { lat: 24.5854, lng: 73.7125 };
  const clean = destination.toLowerCase().replace(/[^a-z]/g, '');
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(city) || city.includes(clean)) return coords;
  }
  return { lat: 24.5854, lng: 73.7125 };
}

export default function InteractiveRouteMap({ dayData, hotel, destination }) {
  const mapDivRef = useRef(null);
  const [engine, setEngine] = useState('detecting'); // 'google' | 'leaflet'

  // Google Maps refs
  const gMapRef = useRef(null);
  const gMarkersRef = useRef([]);
  const gRendererRef = useRef(null);

  // Leaflet refs
  const lMapRef = useRef(null);
  const lLayerRef = useRef(null);

  const cityCenter = getCityCenter(destination);
  const hotelLat = hotel?.gpsCoordinates?.latitude || cityCenter.lat;
  const hotelLng = hotel?.gpsCoordinates?.longitude || cityCenter.lng;

  // 1. Detect if Google Maps API key is configured and valid
  useEffect(() => {
    const hasKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    if (!hasKey) {
      setEngine('leaflet');
      return;
    }

    loadGoogleMaps()
      .then(() => setEngine('google'))
      .catch(err => {
        console.warn('[TravelOS] Google Maps unavailable, activating Leaflet engine:', err.message);
        setEngine('leaflet');
      });
  }, []);

  // 2. Initialize and render Leaflet Map
  useEffect(() => {
    if (engine !== 'leaflet' || !mapDivRef.current) return;

    if (!lMapRef.current) {
      const map = L.map(mapDivRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([hotelLat, hotelLng], 13);

      // Clean, high-performance map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      lMapRef.current = map;
      lLayerRef.current = L.layerGroup().addTo(map);
    }

    renderLeafletRoute();
  }, [engine, dayData, hotel, destination]);

  function renderLeafletRoute() {
    const map = lMapRef.current;
    const layer = lLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const latLngs = [];
    const activities = dayData?.activities || [];

    // Hotel marker
    const hotelPos = [hotelLat, hotelLng];
    latLngs.push(hotelPos);

    const hotelIcon = L.divIcon({
      className: 'hotel-icon',
      html: `
        <div style="background:#4f46e5;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(79,70,229,0.5);border:2.5px solid #ffffff;font-size:16px;">
          🏨
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const hotelMarker = L.marker(hotelPos, { icon: hotelIcon }).addTo(layer);
    hotelMarker.bindPopup(`
      <div style="padding:6px;min-width:180px">
        <strong style="color:#4f46e5;font-size:13px">🏨 Your Hotel Base</strong>
        <p style="margin:4px 0 2px;font-size:12px;font-weight:bold;color:#1e293b">${hotel?.name || 'Selected Stay'}</p>
        <span style="font-size:11px;color:#64748b">${hotel?.address || destination}</span>
      </div>
    `);

    // Activities stops
    activities.forEach((act, idx) => {
      // Offset positions around city center if exact GPS not returned
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);

      const lat = act.placeDetails?.gpsCoordinates?.latitude || (hotelLat + offsetLat);
      const lng = act.placeDetails?.gpsCoordinates?.longitude || (hotelLng + offsetLng);
      const pos = [lat, lng];
      latLngs.push(pos);

      const pinColor = PIN_COLORS[idx % PIN_COLORS.length];
      const stopIcon = L.divIcon({
        className: 'stop-icon',
        html: `
          <div style="background:${pinColor};color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;box-shadow:0 4px 10px rgba(0,0,0,0.35);border:2.5px solid #ffffff;">
            ${act.order || idx + 1}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(pos, { icon: stopIcon }).addTo(layer);
      marker.bindPopup(`
        <div style="padding:6px;min-width:210px">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
            <span style="background:${pinColor};color:white;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:bold">Stop #${act.order || idx + 1}</span>
            <span style="font-size:10px;color:#64748b">${act.time}</span>
          </div>
          <strong style="color:#0f172a;font-size:13px;display:block;margin-bottom:2px">${act.title}</strong>
          <p style="font-size:11px;color:#475569;margin:0 0 4px">${act.placeDetails?.category || act.category}</p>
          <div style="font-size:10px;color:#2563eb;font-weight:600">🚗 ${act.travelTimeFromPrev}</div>
        </div>
      `);
    });

    // Draw route polyline (Hotel -> Stop 1 -> Stop 2 -> ... -> Hotel)
    if (latLngs.length > 1) {
      const closedRoute = [...latLngs, hotelPos];
      L.polyline(closedRoute, {
        color: '#6366f1',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(layer);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    }
  }

  // 3. Initialize and render Google Maps (when API key is active)
  useEffect(() => {
    if (engine !== 'google' || !mapDivRef.current) return;

    if (!gMapRef.current && window.google?.maps) {
      gMapRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: { lat: hotelLat, lng: hotelLng },
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: DARK_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true
      });

      gRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#6366f1',
          strokeWeight: 5,
          strokeOpacity: 0.9
        }
      });
      gRendererRef.current.setMap(gMapRef.current);
    }

    renderGoogleRoute();
  }, [engine, dayData, hotel, destination]);

  function renderGoogleRoute() {
    if (!gMapRef.current || !window.google?.maps) return;

    gMarkersRef.current.forEach(m => m.setMap(null));
    gMarkersRef.current = [];

    const hotelPos = { lat: hotelLat, lng: hotelLng };
    const activities = dayData?.activities || [];

    const stops = activities.map((act, idx) => {
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      return {
        lat: act.placeDetails?.gpsCoordinates?.latitude || (hotelLat + offsetLat),
        lng: act.placeDetails?.gpsCoordinates?.longitude || (hotelLng + offsetLng),
        label: String(act.order || idx + 1),
        title: act.title,
        time: act.time,
        category: act.category,
        order: act.order || idx + 1,
        travelTime: act.travelTimeFromPrev
      };
    });

    // Add Hotel Marker
    addGoogleMarker(hotelPos, '🏨', '#4f46e5', `
      <div style="padding:6px;min-width:180px">
        <strong style="color:#4f46e5;font-size:13px">🏨 Hotel Base</strong>
        <p style="margin:4px 0 2px;font-size:12px;font-weight:bold;color:#1e293b">${hotel?.name || 'Your Hotel'}</p>
        <span style="font-size:11px;color:#64748b">${hotel?.address || destination}</span>
      </div>
    `);

    // Add Stop Markers
    stops.forEach((stop, idx) => {
      const color = PIN_COLORS[idx % PIN_COLORS.length];
      addGoogleMarker(
        { lat: stop.lat, lng: stop.lng },
        stop.label,
        color,
        `
        <div style="padding:6px;min-width:200px">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
            <span style="background:${color};color:white;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:bold">Stop #${stop.order}</span>
            <span style="font-size:10px;color:#64748b">${stop.time}</span>
          </div>
          <strong style="color:#0f172a;font-size:12px;display:block;margin-bottom:2px">${stop.title}</strong>
          <p style="font-size:11px;color:#475569;margin:0 0 4px">${stop.category}</p>
          <div style="font-size:10px;color:#2563eb;font-weight:500">🚗 ${stop.travelTime}</div>
        </div>
        `
      );
    });

    // Request directions or fallback to polyline
    if (stops.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: hotelPos,
          destination: hotelPos,
          waypoints: stops.map(s => ({ location: new window.google.maps.LatLng(s.lat, s.lng), stopover: true })),
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false
        },
        (result, status) => {
          if (status === 'OK') {
            gRendererRef.current.setDirections(result);
          } else {
            const allPoints = [hotelPos, ...stops.map(s => ({ lat: s.lat, lng: s.lng })), hotelPos];
            new window.google.maps.Polyline({
              path: allPoints,
              strokeColor: '#6366f1',
              strokeWeight: 4,
              strokeOpacity: 0.8,
              geodesic: true,
              map: gMapRef.current
            });
            const bounds = new window.google.maps.LatLngBounds();
            allPoints.forEach(p => bounds.extend(p));
            gMapRef.current.fitBounds(bounds, { top: 50, right: 40, bottom: 50, left: 40 });
          }
        }
      );
    }
  }

  function addGoogleMarker(position, label, color, popupHtml) {
    const isEmoji = isNaN(Number(label));
    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
          <text x="18" y="23" text-anchor="middle" font-size="${isEmoji ? '14' : '13'}" font-weight="bold" fill="white" font-family="Arial">${label}</text>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(36, 36),
      anchor: new window.google.maps.Point(18, 18)
    };

    const marker = new window.google.maps.Marker({
      position,
      map: gMapRef.current,
      icon,
      zIndex: isEmoji ? 1 : 2
    });

    const infoWindow = new window.google.maps.InfoWindow({ content: popupHtml });
    marker.addListener('click', () => infoWindow.open(gMapRef.current, marker));
    gMarkersRef.current.push(marker);
  }

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
      <div ref={mapDivRef} className="w-full h-full z-0" />

      {/* Header Overlay with Live Engine Badge */}
      <div className="absolute top-3 left-3 z-10 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-xs font-bold text-white tracking-wide">
          {dayData?.title || 'Interactive Route Map'}
        </span>
        <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30">
          {engine === 'google' ? 'Google Maps' : 'Interactive Map'}
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg flex items-center gap-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-600 border border-white" />
          <span>Hotel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white" />
          <span>Stops (1-4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 border-t-2 border-dashed border-indigo-400" />
          <span>Route Line</span>
        </div>
      </div>
    </div>
  );
}

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] }
];
