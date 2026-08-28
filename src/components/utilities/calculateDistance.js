export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateDistance(venueLocationStr) {
  if (!venueLocationStr) return 'Distance unknown'

  // Default fallback center based on user's current IP-based location
  let userLat = 40.7796
  let userLng = -74.0238

  if (typeof window !== 'undefined') {
    const cachedStr = sessionStorage.getItem('kwenchr_location')
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr)
        if (cached.coords && cached.coords.latitude && cached.coords.longitude) {
          userLat = cached.coords.latitude
          userLng = cached.coords.longitude
        }
      } catch (e) {
        console.error('Failed to parse location cache in calculateDistance', e)
      }
    }
  }

  // Parse venue lat/lng string (format: "40.7533,-74.0253")
  const parts = venueLocationStr.split(',')
  if (parts.length !== 2) return 'Distance unknown'
  const venueLat = parseFloat(parts[0])
  const venueLng = parseFloat(parts[1])

  if (isNaN(venueLat) || isNaN(venueLng)) return 'Distance unknown'

  const km = getDistanceKm(userLat, userLng, venueLat, venueLng)
  const miles = km * 0.621371
  const feet = miles * 5280

  if (miles < 1.0) {
    // Round to nearest 10 feet for clean UI representation
    const roundedFeet = Math.round(feet / 10) * 10
    return `${roundedFeet || 10} feet away`
  } else {
    // Round to one decimal place for miles
    return `${miles.toFixed(1)} miles away`
  }
}

export default calculateDistance
