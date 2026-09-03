'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Overlay from './Overlay'
import Datepicker from 'react-datepicker'
import './EventEdit.css'

export default function EventEdit({ mgid }) {
  const router = useRouter()
  const isEdit = !!mgid

  const [eventName, setEventName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [venueName, setVenueName] = useState('')
  const [address, setAddress] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [type, setType] = useState('happy-hour')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [recurrence, setRecurrence] = useState('daily')
  const [authChecked, setAuthChecked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kwenchr_user')
      if (stored) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
      setAuthChecked(true)
    }
  }, [])

   useEffect(() => {
    if (isEdit && mgid) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(`/api/events/${mgid}`)
          if (res.ok) {
            const raw = await res.json()
            setEventName(raw.name || '')
            setShortDesc(raw.short_description || '')
            setLongDesc(raw.long_description || '')
            setVenueName(raw.venue_name || '')
            setAddress(raw.venue_address || '')
            setImageUrl(raw.image_url || '')
            setType(raw.type_id || 'happy-hour')
            if (raw.start_time) {
              setStartDate(new Date(raw.start_time))
            }
            if (raw.end_time) {
              setEndDate(new Date(raw.end_time))
            }
          } else {
            console.error('Failed to load event data for editing')
          }
        } catch (err) {
          console.error('Error fetching event for edit form:', err)
        }
      }
      fetchEvent()
    }
  }, [isEdit, mgid])

  const handleSave = async (e) => {
    e.preventDefault()

    // 1. Geocode address dynamically to get coordinates and real Place ID from Google
    let places_id = 'ChIJr-p86J7ZwokR8Yn2h6eU85E' // Default fallback (Madd Hatter)
    let venue_location = '40.7414,-74.0301' // Default fallback

    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      try {
        const geocoder = new window.google.maps.Geocoder()
        const result = await new Promise((resolve) => {
          geocoder.geocode({ address }, (res, status) => {
            if (status === 'OK' && res[0]) {
              resolve(res[0])
            } else {
              resolve(null)
            }
          })
        })
        if (result) {
          places_id = result.place_id
          venue_location = `${result.geometry.location.lat()},${result.geometry.location.lng()}`
        }
      } catch (err) {
        console.warn('Geocoding failed during save:', err)
      }
    }

    let promoter_id = ''
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kwenchr_user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          promoter_id = parsed._id || parsed.id || ''
        } catch (e) {}
      }
    }

    const payload = {
      name: eventName,
      short_description: shortDesc,
      long_description: longDesc,
      venue_name: venueName,
      venue_address: address,
      venue_location,
      image_url: imageUrl,
      places_id,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      type_id: type,
      tags: [type],
      promoter_id
    }

    try {
      const url = isEdit ? `/api/events/${mgid}` : '/api/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert(`Success: Event "${eventName}" ${isEdit ? 'updated' : 'created'}!`)
        router.push('/')
        router.refresh()
      } else {
        const errData = await res.json()
        alert(`Error saving event: ${errData.error || 'Server error'}`)
      }
    } catch (err) {
      console.error('Error during event save:', err)
      alert('Failed to save event. Please check connection.')
    }
  }

  const buttons = (
    <div className="event-edit-buttons">
      <button type="button" className="btn btn-secondary" onClick={() => router.push('/')}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" onClick={handleSave}>
        {isEdit ? 'Save Changes' : 'Create Special'}
      </button>
    </div>
  )

  if (authChecked && !isLoggedIn) {
    return (
      <Overlay title="Access Restricted">
        <div className="event-edit-restricted">
          <p>
            You must be logged in to create or edit drink specials.
          </p>
          <div className="event-edit-restricted__actions">
            <button className="btn btn-secondary" onClick={() => router.push('/')}>
              Go Back
            </button>
            <button className="btn btn-primary" onClick={() => router.push('/sign-in')}>
              Sign In
            </button>
          </div>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay title={isEdit ? 'Edit Drink Special' : 'Create Drink Special'} buttons={buttons}>
      <form onSubmit={handleSave} className="event-edit-form">
        
        {/* SECTION 1: EVENT GENERAL INFO */}
        <div className="event-edit-section">
          <h4 className="event-edit-section__title event-edit-section__title--purple">
            Event Information
          </h4>
          <div className="event-edit-fields">
            <div>
              <label className="event-edit-label">Event Title</label>
              <input 
                type="text" 
                value={eventName} 
                onChange={e => setEventName(e.target.value)} 
                placeholder="e.g. 2-for-1 Margarita Madness"
                required
                className="event-edit-input"
              />
            </div>
            
            <div>
              <label className="event-edit-label">Short Description</label>
              <input 
                type="text" 
                value={shortDesc} 
                onChange={e => setShortDesc(e.target.value)} 
                placeholder="e.g. $5 Drafts and $6 Well Drinks all night"
                required
                className="event-edit-input"
              />
            </div>

            <div>
              <label className="event-edit-label">Long Description</label>
              <textarea 
                value={longDesc} 
                onChange={e => setLongDesc(e.target.value)} 
                placeholder="Describe your drink specials, rules, menu, and any additional cost detail..."
                rows={3}
                className="event-edit-textarea"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: VENUE DETAILS */}
        <div className="event-edit-section">
          <h4 className="event-edit-section__title event-edit-section__title--gold">
            Venue Details
          </h4>
          <div className="event-edit-fields">
            <div>
              <label className="event-edit-label">Venue Name</label>
              <input 
                type="text" 
                value={venueName} 
                onChange={e => setVenueName(e.target.value)} 
                placeholder="e.g. The Duplex Piano Bar"
                required
                className="event-edit-input"
              />
            </div>

            <div>
              <label className="event-edit-label">Street Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="e.g. 61 Christopher St, New York, NY 10014"
                required
                className="event-edit-input"
              />
            </div>

            <div>
              <label className="event-edit-label">Venue / Special Image URL</label>
              <input 
                type="text" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                placeholder="e.g. https://example.com/bar-special.jpg"
                className="event-edit-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TIME & RECURRENCE */}
        <div className="event-edit-section">
          <h4 className="event-edit-section__title event-edit-section__title--purple">
            Timing & Recurrence
          </h4>
          <div className="event-edit-grid">
            <div className="event-edit-grid-item">
              <label className="event-edit-label">Start Date & Time</label>
              <Datepicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className="Demo__search-input event-edit-datepicker-full"
              />
            </div>
            
            <div className="event-edit-grid-item">
              <label className="event-edit-label">End Date & Time</label>
              <Datepicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className="Demo__search-input event-edit-datepicker-full"
              />
            </div>

            <div className="event-edit-grid-item">
              <label className="event-edit-label">Special Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="event-edit-select"
              >
                <option value="happy-hour">Happy Hour</option>
                <option value="comedy">Comedy Event</option>
                <option value="event">Special Event</option>
              </select>
            </div>

            <div className="event-edit-grid-item">
              <label className="event-edit-label">Recurrence</label>
              <select 
                value={recurrence} 
                onChange={e => setRecurrence(e.target.value)}
                className="event-edit-select"
              >
                <option value="once">Once Off</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

      </form>
    </Overlay>
  )
}
