'use client'
import React from 'react'
import Link from 'next/link'
import calculateDistance from './utilities/calculateDistance'
import formatTime from './utilities/formatTime'

export default function EventsList({ events }) {
  if (!events || events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        No specials found for this date.
      </div>
    )
  }

  return (
    <div className="events-list-wrapper">
      <ul className="events-list">
        {events.map((event) => (
          <Link key={event.mgid} href={`/event/${event.mgid}`} style={{ width: '100%' }}>
            <li className="columns event-item" itemScope itemType="http://schema.org/Event">
              
              {/* Event Image */}
              <div className="column event-image-column">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className="event-image" 
                  src={event.image?.url || '/images/default_event.jpg'} 
                  alt="Drink special event" 
                />
                <div className="event-item-rating">
                  <i className="icon icon-heart"></i>
                  <span>{event.rating || 0}</span>
                </div>
              </div>

              {/* Event Meta */}
              <div className="column event-meta-column">
                <div className="meta-column">
                  <div className="event-meta-distance">{calculateDistance(event.venue?.location)}</div>
                  <h2 className="event-meta-title">{event.title}</h2>
                  <p className="event-meta-time">
                    <span itemProp="startDate" content={event.occurrence?.start_time}>
                      {formatTime(event.occurrence?.start_time)}
                    </span>
                    <span> - </span>
                    <span itemProp="endDate" content={event.occurrence?.end_time}>
                      {formatTime(event.occurrence?.end_time)}
                    </span>
                  </p>
                  <div itemProp="description" className="event-meta-short-desc">
                    {event.short_desc}
                  </div>
                </div>
              </div>

              <div className="event-meta-more">
                <i className="icon icon-chevron-right"></i>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
