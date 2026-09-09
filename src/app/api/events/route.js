import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Events from '@/models/Event'

function getVenueCoords(event) {
  const locStr = event.venue_location || (event.venue && event.venue.location)
  if (!locStr) return null
  const parts = locStr.split(',')
  if (parts.length !== 2) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  if (isNaN(lat) || isNaN(lng)) return null
  return { lat, lng }
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
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

function calculateEventDistance(event, userLat, userLng) {
  const coords = getVenueCoords(event)
  if (!coords) return Infinity
  return getDistanceKm(userLat, userLng, coords.lat, coords.lng)
}

export async function GET(request) {
  try {
    await dbConnect()

    let page, limit, lat, lng, promoterId
    if (request && request.url) {
      try {
        const { searchParams } = new URL(request.url)
        const p = parseInt(searchParams.get('page'), 10)
        const l = parseInt(searchParams.get('limit'), 10)
        if (!isNaN(p) && p > 0) page = p
        if (!isNaN(l) && l > 0) limit = l

        const rawLat = searchParams.get('lat') ?? searchParams.get('latitude')
        const rawLng = searchParams.get('lng') ?? searchParams.get('longitude')
        if (rawLat !== null && rawLat !== undefined) {
          const parsedLat = parseFloat(rawLat)
          if (!isNaN(parsedLat)) lat = parsedLat
        }
        if (rawLng !== null && rawLng !== undefined) {
          const parsedLng = parseFloat(rawLng)
          if (!isNaN(parsedLng)) lng = parsedLng
        }

        const rawPromoter =
          searchParams.get('promoter_id') ??
          searchParams.get('promoterId') ??
          searchParams.get('userId')
        if (rawPromoter) {
          promoterId = rawPromoter
        }
      } catch {
        // ignore invalid URL
      }
    }

    const filter = promoterId ? { promoter_id: promoterId } : {}

    if (lat !== undefined && lng !== undefined) {
      let query = Events.find(filter)
      if (typeof query?.lean === 'function') query = query.lean()
      const allEvents = await query

      // Schwartzian transform: compute distance and id once per event
      const withDistance = (allEvents || []).map((event) => ({
        event,
        dist: calculateEventDistance(event, lat, lng),
        id: (event._id || event.id || event.name || '').toString()
      }))
      withDistance.sort((a, b) => {
        if (a.dist !== b.dist) {
          return a.dist - b.dist
        }
        return a.id.localeCompare(b.id)
      })

      if (page || limit) {
        const p = page || 1
        const l = limit || 10
        const skip = (p - 1) * l
        return NextResponse.json(withDistance.slice(skip, skip + l).map((item) => item.event))
      }

      return NextResponse.json(withDistance.map((item) => item.event))
    }

    if (page || limit) {
      const p = page || 1
      const l = limit || 10
      const skip = (p - 1) * l
      let query = Events.find(filter).skip(skip).limit(l)
      if (typeof query?.lean === 'function') query = query.lean()
      const events = await query
      return NextResponse.json(events)
    }

    let query = Events.find(filter)
    if (typeof query?.lean === 'function') query = query.lean()
    const events = await query
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const newEvent = new Events(body)
    const savedEvent = await newEvent.save()
    return NextResponse.json(savedEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
