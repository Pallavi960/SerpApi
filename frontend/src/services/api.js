const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) {
    const detail = data?.detail
    const message = Array.isArray(detail)
      ? detail.map(e => e.msg).join(', ')
      : detail || 'Something went wrong. Please try again.'
    throw new Error(message)
  }
  return data
}

export function submitTripPreferences(preferences) {
  return post('/api/trip/preferences', preferences)
}

export function fetchDestinations(preferences) {
  return post('/api/travel/destinations', preferences)
}
