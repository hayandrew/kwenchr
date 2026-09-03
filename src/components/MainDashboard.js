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

let cachedAllEvents = null
let cachedScrollTop = 0
let cachedCurrentDate = null
let cachedVisibleCount = 10

export function clearDashboardCache() {
  cachedAllEvents = null
  cachedScrollTop = 0
  cachedCurrentDate = null
  cachedVisibleCount = 10
}

export default function MainDashboard({ children }) {
  const centerColRef = React.useRef(null)
  const leftWrapperRef = React.useRef(null)

  const [currentDate, setCurrentDate] = useState(() => cachedCurrentDate || moment())
  const [eventType, setEventType] = useState([])
  const [maxDistance, setMaxDistance] = useState('all')
  const [allEvents, setAllEvents] = useState(() => cachedAllEvents || [])
  const [userCoords, setUserCoords] = useState({ lat: 40.7796, lng: -74.0238 })
  const [visibleCount, setVisibleCount] = useState(() => cachedVisibleCount || 10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Memorize, filter, and sort events by closest distance synchronously
  const sortedEvents = React.useMemo(() => {
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

    // 4. Sort by closest distance
    const eventsWithDistance = filtered.map(event => {
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
  }, [allEvents, currentDate, eventType, maxDistance, userCoords])

  useEffect(() => {
    let isCancelled = false
    const loadEvents = async () => {
      try {
        const res = await dedupeFetch('/api/events')
        if (res.ok && !isCancelled) {
          const rawEvents = await res.json()
          const mapped = rawEvents.map(mapDbEventToClient)
          cachedAllEvents = mapped
          setAllEvents(mapped)
        } else if (!res.ok) {
          console.error('Failed to load events from database API')
        }
      } catch (e) {
        console.error('Error fetching events:', e)
      }
    }

    loadEvents()
    return () => {
      isCancelled = true
    }
  }, [])

  const isRestoringRef = React.useRef(false)
  const loadMoreTimeoutRef = React.useRef(null)
  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current)
      }
    }
  }, [])

  const loadMore = React.useCallback(() => {
    if (isLoadingMore) return
    if (visibleCount >= sortedEvents.length) return
    setIsLoadingMore(true)
    loadMoreTimeoutRef.current = setTimeout(() => {
      setVisibleCount(prev => {
        const next = prev + 10
        cachedVisibleCount = next
        return next
      })
      setIsLoadingMore(false)
    }, 400)
  }, [isLoadingMore, visibleCount, sortedEvents.length])

  // Track scroll position on the actual scrollable containers (.center-column on desktop, .main-content-left on mobile)
  useEffect(() => {
    const handleScroll = (e) => {
      if (isRestoringRef.current) return
      if (!children && e.target && typeof e.target.scrollTop === 'number') {
        if (e.target.scrollTop > 0) {
          cachedScrollTop = e.target.scrollTop
        }
        const { scrollTop, scrollHeight, clientHeight } = e.target
        if (scrollHeight > clientHeight && scrollHeight - scrollTop - clientHeight < 150) {
          loadMore()
        }
      }
    }

    const centerEl = centerColRef.current
    const leftEl = leftWrapperRef.current

    if (centerEl) centerEl.addEventListener('scroll', handleScroll, { passive: true })
    if (leftEl) leftEl.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (centerEl) centerEl.removeEventListener('scroll', handleScroll)
      if (leftEl) leftEl.removeEventListener('scroll', handleScroll)
    }
  }, [children, loadMore])

  // Restore scroll position on the container when mounted or when sortedEvents change
  useEffect(() => {
    if (cachedScrollTop > 0) {
      isRestoringRef.current = true
      const restore = () => {
        if (centerColRef.current && centerColRef.current.scrollTop !== cachedScrollTop) {
          centerColRef.current.scrollTop = cachedScrollTop
        }
        if (leftWrapperRef.current && leftWrapperRef.current.scrollTop !== cachedScrollTop) {
          leftWrapperRef.current.scrollTop = cachedScrollTop
        }
      }
      restore()
      const raf = requestAnimationFrame(restore)
      return () => cancelAnimationFrame(raf)
    }
  }, [sortedEvents])

  const updateDate = (date) => {
    cachedCurrentDate = date
    setCurrentDate(date)
    cachedVisibleCount = 10
    setVisibleCount(10)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kwenchr_current_date', date.format('YYYY-MM-DD'))
    }
  }

  const handleTypeChange = (selectedTypes) => {
    cachedVisibleCount = 10
    setVisibleCount(10)
    setEventType(selectedTypes)
  }

  const handleDistanceChange = (distance) => {
    cachedVisibleCount = 10
    setVisibleCount(10)
    setMaxDistance(distance)
  }

  return (
    <div className="main-content">
      <div className="main-content-wrapper">
        <div className="main-content-left" ref={leftWrapperRef}>
          
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
              
              <div className="ad-wrapper hidden-sm-down">
                <Ad extClass="hidden-xl-up hidden-sm-down" height="250" width="300" />
                <Ad extClass="hidden-lg-down" height="280" width="336" />
              </div>
            </div>

            {/* Center Content Column */}
            <div className="center-column" ref={centerColRef}>
              <div className="columns filters">
                <Location onLocationChange={setUserCoords} />
                <EventType value={eventType} onChange={handleTypeChange} />
                <Distance value={maxDistance} onChange={handleDistanceChange} />
              </div>

              <EventsList
                events={sortedEvents.slice(0, visibleCount)}
                hasMore={visibleCount < sortedEvents.length}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMore}
              />
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
