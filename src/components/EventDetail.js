'use client'
import React, { useState, useEffect } from 'react'
import Overlay from './Overlay'
import formatTime from './utilities/formatTime'
import calculateDistance from './utilities/calculateDistance'
import { mapDbEventToClient } from './utilities/mapEvent'
import dedupeFetch from './utilities/dedupeFetch'
import './EventDetail.css'

export default function EventDetail({ mgid }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [promoterName, setPromoterName] = useState('Organizer')

  const tagLabels = {
    'happy-hour': 'Happy Hour',
    'comedy': 'Comedy',
    'event': 'Special Event',
    'lgbt': 'LGBT+'
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const res = await dedupeFetch(`/api/events/${mgid}`)
        if (res.ok) {
          const raw = await res.json()
          setEvent(mapDbEventToClient(raw))
          
          if (raw.promoter_id) {
            try {
              const userRes = await fetch(`/api/user/${raw.promoter_id}`)
              if (userRes.ok) {
                const userData = await userRes.json()
                setPromoterName(userData.username || 'Organizer')
              }
            } catch (e) {
              console.warn('Failed to fetch promoter user info:', e)
            }
          }
        } else {
          console.error('Failed to load event details')
        }
      } catch (err) {
        console.error('Error fetching event detail:', err)
      } finally {
        setLoading(false)
      }
    }

    if (mgid) {
      fetchEvent()
    }
  }, [mgid])

  if (loading) {
    return (
      <Overlay title="Loading Event...">
        <div className="event-loading">
          <i className="icon icon-spinner fa-spin loading-spinner" />
          <div>Retrieving drink special details...</div>
        </div>
      </Overlay>
    )
  }

  if (!event) {
    return (
      <Overlay title="Event Not Found">
        <div className="event-not-found">
          This drink special event could not be found or has expired.
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay title={event.title}>
      <div className="event-detail-content">
        
        {/* Event Header Detail */}
        <div className="event-header">
          <div className="event-header__title">
            <h2>{calculateDistance(event.venue?.location)}</h2>
            <h4>From: {formatTime(event.occurrence?.start_time)}</h4>
            <h4>To: {formatTime(event.occurrence?.end_time)}</h4>
          </div>
          <div className="event-header__promoter">
            <div className="event-user">
              <span className="promoter-image"></span>
              <span className="promoter-name">{promoterName}</span>
            </div>
          </div>
        </div>

        {/* Inner Overlay Details */}
        <div className="inner-overlay">
          <div className="form-overlay form-images">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Drink special detail" 
              className="form-images__image" 
              src={event.image?.url || '/images/default_event.jpg'} 
            />
            <div className="form-button-row">
              <span className="btn btn-secondary btn-xs btn-form">Images</span>
            </div>
          </div>

          <div className="event-rating-row">
            <button className="btn btn-primary fav-button">
              <i className="icon icon-heart"></i>
              <span className="rating-number">Rating: {event.rating || 0}</span>
            </button>
            
            <div className="event-type-badge">
              Type: <strong>
                {event.tags?.map(t => tagLabels[t] || t).join(', ') || 'Special'}
              </strong>
            </div>
          </div>

          <div className="form-overlay form-occurences">
            <h3>Short desc: {event.short_desc}</h3>
            <p>{event.long_desc}</p>
          </div>

          {/* Place Info */}
          <div className="venue-info-section">
            <h1 className="venue-title">
              <a href="#" className="venue-link">
                <i className="icon icon-map-marker-alt venue-icon"></i>
                {event.venue?.name || 'Local Venue'}
              </a>
            </h1>
            <h3 className="venue-address">
              {event.venue?.address}
            </h3>
          </div>

        </div>
      </div>
    </Overlay>
  )
}
