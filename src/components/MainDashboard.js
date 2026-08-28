'use client'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import DatePick from './DatePick'
import Location from './Location'
import EventType from './EventType'
import Distance from './Distance'
import EventsList from './EventsList'
import Ad from './Ad'
import { mapDbEventToClient } from './utilities/mapEvent'
import { getDistanceKm } from './utilities/calculateDistance'
import dedupeFetch from './utilities/dedupeFetch'

export default function MainDashboard({ children }) {
  const [currentDate, setCurrentDate] = useState(null)
  const [eventType, setEventType] = useState([])
  const [maxDistance, setMaxDistance] = useState('all')
  const [allEvents, setAllEvents] = useState([])
  const [events, setEvents] = useState([])
  const [userCoords, setUserCoords] = useState({ lat: 40.7796, lng: -74.0238 })

  // Memorize and sort events by closest distance
  const sortedEvents = React.useMemo(() => {
    const eventsWithDistance = events.map(event => {
      let distance = Infinity
      if (event.venue && event.venue.location) {
        const parts = event.venue.location.split(',')
        if (parts.length === 2) {
          const venueLat = parseFloat(parts[0])
          const venueLng = parseFloat(parts[1])
          if (!isNaN(venueLat) && !isNaN(venueLng)) {
            distance = getDistanceKm(userCoords.lat, userCoords.lng, venueLat, venueLng)
          }
        }
      }
      return { ...event, _distance: distance }
    })

    return eventsWithDistance.sort((a, b) => a._distance - b._distance)
  }, [events, userCoords])

  const fetchEvents = async () => {
    try {
      const res = await dedupeFetch('/api/events')
      if (res.ok) {
        const rawEvents = await res.json()
        const mapped = rawEvents.map(mapDbEventToClient)
        setAllEvents(mapped)
      } else {
        console.error('Failed to load events from database API')
      }
    } catch (e) {
      console.error('Error fetching events:', e)
    }
  }

  useEffect(() => {
    let initialDate = moment()
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kwenchr_current_date')
      if (stored) {
        initialDate = moment(stored)
      } else {
        sessionStorage.setItem('kwenchr_current_date', initialDate.format('YYYY-MM-DD'))
      }
    }
    setCurrentDate(initialDate)
    fetchEvents()
  }, [])

  // Combined reactive filter runner
  useEffect(() => {
    let filtered = [...allEvents]

    // 1. Filter by selected date
    if (currentDate) {
      filtered = filtered.filter(e => {
        if (!e.occurrence?.start_time) return false
        return moment(e.occurrence.start_time).isSame(currentDate, 'day')
      })
      if (filtered.length === 0) {
        filtered = [...allEvents]
      }
    }

    // 2. Filter by category types
    if (eventType.length > 0) {
      filtered = filtered.filter(item => {
        const itemTags = item.tags || []
        return eventType.some(typeVal => {
          const tagMatch = itemTags.includes(typeVal)
          const cleanSearch = typeVal.replace('-', ' ')
          const nameMatch = item.title && item.title.toLowerCase().includes(cleanSearch)
          const descMatch = item.short_desc && item.short_desc.toLowerCase().includes(cleanSearch)
          return tagMatch || nameMatch || descMatch
        })
      })
    }

    // 3. Filter by distance threshold
    if (maxDistance !== 'all') {
      const maxDistKm = parseFloat(maxDistance) * 1.60934
      filtered = filtered.filter(event => {
        let distance = Infinity
        if (event.venue && event.venue.location) {
          const parts = event.venue.location.split(',')
          if (parts.length === 2) {
            const venueLat = parseFloat(parts[0])
            const venueLng = parseFloat(parts[1])
            if (!isNaN(venueLat) && !isNaN(venueLng)) {
              distance = getDistanceKm(userCoords.lat, userCoords.lng, venueLat, venueLng)
            }
          }
        }
        return distance <= maxDistKm
      })
    }

    setEvents(filtered)
  }, [allEvents, currentDate, eventType, maxDistance, userCoords])

  const updateDate = (date) => {
    setCurrentDate(date)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kwenchr_current_date', date.format('YYYY-MM-DD'))
    }
  }

  const handleTypeChange = (selectedTypes) => {
    setEventType(selectedTypes)
  }

  return (
    <div className="main-content">
      <div className="main-content-wrapper">
        <div className="main-content-left">
          
          {/* Top Leaderboard Ad */}
          <div className="leaderboard-ad ad-wrapper">
            <Ad extClass="hidden-md-up" height="50" width="320" />
            <Ad extClass="hidden-sm-down" height="90" width="728" />
          </div>

          <div className="main-content-left-inner">
            
            {/* Modal Overlay Render Layer */}
            {children}

            {/* Left Sidebar Column */}
            <div className="left-column">
              {currentDate && (
                <DatePick
                  currentDate={currentDate}
                  updateDate={updateDate}
                />
              )}
              
              <div className="ad-wrapper">
                <Ad extClass="hidden-xl-up hidden-sm-down" height="250" width="300" />
                <Ad extClass="hidden-lg-down" height="280" width="336" />
              </div>
            </div>

            {/* Center Content Column */}
            <div className="center-column">
              <div className="columns filters">
                <Location onLocationChange={setUserCoords} />
                <EventType value={eventType} onChange={handleTypeChange} />
                <Distance value={maxDistance} onChange={setMaxDistance} />
              </div>

              <EventsList events={sortedEvents} />
            </div>

          </div>

          {/* Bottom Leaderboard Ad */}
          <div className="leaderboard-ad ad-wrapper">
            <Ad extClass="hidden-md-up" height="50" width="320" />
            <Ad extClass="hidden-sm-down" height="90" width="728" />
          </div>

        </div>

        {/* Right Skyscraper Sidebar */}
        <div className="main-content-right">
          <Ad extClass="hidden-xl-up hidden-md-down skyscraper-ad" height="600" width="160" />
          <Ad extClass="hidden-lg-down hidden-sm-down skyscraper-ad" height="600" width="300" />
        </div>
      </div>
    </div>
  )
}
