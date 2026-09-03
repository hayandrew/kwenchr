import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Location from './Location'

// Mock Places subcomponent
vi.mock('@/components/Places', () => ({
  default: () => <div data-testid="mock-places" />
}))

describe('Location Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  it('uses cached geolocation if fresh (< 5 mins)', () => {
    const freshTimestamp = Date.now() - 60 * 1000 // 1 min old
    const cachedData = {
      coords: {
        latitude: 40.7533,
        longitude: -74.0253,
        accuracy: 5,
      },
      timestamp: freshTimestamp,
    }
    window.sessionStorage.setItem('kwenchr_location', JSON.stringify(cachedData))

    const handleLocationChange = vi.fn()
    render(<Location onLocationChange={handleLocationChange} />)

    expect(handleLocationChange).toHaveBeenCalledWith({ lat: 40.7533, lng: -74.0253 })
    expect(navigator.geolocation.getCurrentPosition).not.toHaveBeenCalled()
  })

  it('requests fresh geolocation if cache is expired (> 5 mins)', () => {
    const expiredTimestamp = Date.now() - 6 * 60 * 1000 // 6 min old
    const cachedData = {
      coords: {
        latitude: 40.7533,
        longitude: -74.0253,
        accuracy: 5,
      },
      timestamp: expiredTimestamp,
    }
    window.sessionStorage.setItem('kwenchr_location', JSON.stringify(cachedData))

    const handleLocationChange = vi.fn()
    render(<Location onLocationChange={handleLocationChange} />)

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
    expect(handleLocationChange).toHaveBeenCalledWith({ lat: 40.7796, lng: -74.0238 }) // Default mock geolocation success values
  })

  it('requests geolocation if there is no cache at all', () => {
    const handleLocationChange = vi.fn()
    render(<Location onLocationChange={handleLocationChange} />)

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
    expect(handleLocationChange).toHaveBeenCalledWith({ lat: 40.7796, lng: -74.0238 })
  })

  it('renders correctly', () => {
    render(<Location onLocationChange={() => {}} />)
    expect(screen.getByTestId('mock-places')).toBeInTheDocument()
  })
})
