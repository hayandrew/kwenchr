'use client'
import React, { useState, useEffect } from 'react'
import Overlay from './Overlay'
import formatTime from './utilities/formatTime'
import calculateDistance from './utilities/calculateDistance'
import { mapDbEventToClient } from './utilities/mapEvent'
import dedupeFetch from './utilities/dedupeFetch'

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
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="icon icon-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--accent-purple)', marginBottom: '10px' }} />
          <div>Retrieving drink special details...</div>
        </div>
      </Overlay>
    )
  }

  if (!event) {
    return (
      <Overlay title="Event Not Found">
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          This drink special event could not be found or has expired.
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay title={event.title}>
      <div className="event-detail-content">
        
        {/* Event Header Detail */}
        <div className="event-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          <div className="event-header__title">
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {calculateDistance(event.venue?.location)}
            </h2>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              From: {formatTime(event.occurrence?.start_time)}
            </h4>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              To: {formatTime(event.occurrence?.end_time)}
            </h4>
          </div>
          <div className="event-header__promoter" style={{ textAlign: 'right' }}>
            <div className="event-user" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                className="promoter-image"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  backgroundImage: "url('/images/default_person.jpg')",
                  backgroundSize: 'cover',
                  display: 'block'
                }}
              ></span>
              <span className="promoter-name" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{promoterName}</span>
            </div>
          </div>
        </div>

        {/* Inner Overlay Details */}
        <div className="inner-overlay">
          <div className="form-overlay form-images" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Drink special detail" 
              className="form-images__image" 
              src={event.image?.url || '/images/default_event.jpg'} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />
            <div 
              className="form-button-row"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
            >
              <span className="btn btn-secondary btn-xs btn-form" style={{ background: 'rgba(0,0,0,0.6)', border: '0', color: 'white' }}>Images</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button className="btn btn-primary fav-button" style={{ gap: '8px', padding: '8px 16px' }}>
              <i className="icon icon-heart" style={{ color: 'var(--accent-gold)' }}></i>
              <span className="rating-number">Rating: {event.rating || 0}</span>
            </button>
            
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Type: <strong style={{ color: 'var(--accent-purple)' }}>
                {event.tags?.map(t => tagLabels[t] || t).join(', ') || 'Special'}
              </strong>
            </div>
          </div>

          <div className="form-overlay form-occurences" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Short desc: {event.short_desc}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{event.long_desc}</p>
          </div>

          {/* Place Info */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="icon icon-map-marker-alt" style={{ color: 'var(--accent-gold)' }}></i>
                {event.venue?.name || 'Local Venue'}
              </a>
            </h1>
            <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', paddingLeft: '22px' }}>
              {event.venue?.address}
            </h3>
          </div>

        </div>
      </div>
    </Overlay>
  )
}
