'use client'
import React, { useState, useEffect } from 'react'
import Overlay from '@/components/Overlay'
import EventsList from '@/components/EventsList'
import staticEvents from '@/data/events'
import { mapDbEventToClient } from '@/components/utilities/mapEvent'
import dedupeFetch from '@/components/utilities/dedupeFetch'
import './MyEvents.css'

export default function MyEvents() {
  const [events, setEvents] = useState(() => staticEvents.slice(0, 3))

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = sessionStorage.getItem('kwenchr_user')
      if (!stored) return

      const user = JSON.parse(stored)
      const userId = user._id || user.id
      if (!userId) return

      const fetchUserEvents = async () => {
        try {
          const res = await dedupeFetch(`/api/events?promoter_id=${userId}`)
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
              setEvents(data.map(mapDbEventToClient))
            }
          }
        } catch (err) {
          console.error('Error fetching user events:', err)
        }
      }

      fetchUserEvents()
    } catch (e) {}
  }, [])

  return (
    <Overlay title="My Events">
      <div className="my-events-container">
        <h4 className="my-events-subtitle">
          Drink specials and happy hours you have bookmarked or created:
        </h4>
        <EventsList events={events} />
      </div>
    </Overlay>
  )
}

