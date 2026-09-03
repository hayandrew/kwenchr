'use client'
import React from 'react'
import Overlay from '@/components/Overlay'
import EventsList from '@/components/EventsList'
import staticEvents from '@/data/events'
import './MyEvents.css'

export default function MyEvents() {
  // Slice events array to simulate user-specific events
  const myEventsList = staticEvents.slice(0, 3)

  return (
    <Overlay title="My Events">
      <div className="my-events-container">
        <h4 className="my-events-subtitle">
          Drink specials and happy hours you have bookmarked or created:
        </h4>
        <EventsList events={myEventsList} />
      </div>
    </Overlay>
  )
}
