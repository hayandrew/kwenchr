'use client'
import React, { useEffect } from 'react'
import Places from './Places'
import './Location.css'

export default function Location({ onLocationChange }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Check sessionStorage for cached geolocation
    const cachedStr = sessionStorage.getItem('kwenchr_location')
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr)
        const age = Date.now() - cached.timestamp
        // Use cache if it is less than 5 minutes old (300000ms)
        if (age < 5 * 60 * 1000) {
          console.log(`Using cached geolocation (age: ${Math.round(age / 1000)}s)`)
          if (onLocationChange && cached.coords) {
            onLocationChange({ lat: cached.coords.latitude, lng: cached.coords.longitude })
          }
          return
        }
      } catch (e) {
        console.error('Failed to parse cached geolocation', e)
      }
    }

    // 2. Fall back to native API if no valid cache
    if (navigator.geolocation) {
      console.log('Calling native Geolocation API...')
      
      const geoSuccess = (position) => {
        console.log('Geolocation Success:', position)
        const cachedData = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          isCurrentLocation: true,
          timestamp: Date.now()
        }
        sessionStorage.setItem('kwenchr_location', JSON.stringify(cachedData))
        window.dispatchEvent(new Event('locationChange'))
        if (onLocationChange) {
          onLocationChange({ lat: position.coords.latitude, lng: position.coords.longitude })
        }
      }

      const geoError = (error) => {
        console.log('Error occurred. Error code: ' + error.code)
      }

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
        maximumAge: 5 * 60 * 1000,
      })
    } else {
      console.log('Geolocation is not supported for this Browser/OS.')
    }
  }, [onLocationChange])

  return (
    <div className="filter-container location-filter-container">
      <label>
        <i className="icon icon-map-marker-alt" />
      </label>
      <Places onLocationChange={onLocationChange} />
    </div>
  )
}
