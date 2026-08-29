import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Places from './Places'

describe('Places Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()

    // Mock Google Maps API using constructor function for Geocoder
    const mockAutocompleteFetch = vi.fn().mockResolvedValue({
      suggestions: [
        {
          placePrediction: {
            placeId: 'place-ny',
            text: 'New York, NY, USA',
            mainText: 'New York',
            secondaryText: 'NY, USA'
          }
        }
      ]
    })

    window.google = {
      maps: {
        importLibrary: vi.fn().mockResolvedValue({
          AutocompleteSuggestion: {
            fetchAutocompleteSuggestions: mockAutocompleteFetch
          }
        }),
        Geocoder: function() {
          this.geocode = vi.fn().mockImplementation((req, callback) => {
            callback(
              [
                {
                  geometry: {
                    location: {
                      lat: () => 40.7128,
                      lng: () => -74.0060
                    }
                  }
                }
              ],
              'OK'
            )
          })
        }
      }
    }
  })

  it('renders input field with placeholder', () => {
    render(<Places onLocationChange={() => {}} />)
    const input = screen.getByPlaceholderText('Choose Location...')
    expect(input).toBeInTheDocument()
  })

  it('shows autocomplete dropdown suggestions when typing more than 2 characters', async () => {
    render(<Places onLocationChange={() => {}} />)
    const input = screen.getByPlaceholderText('Choose Location...')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'New' } })

    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
      expect(screen.getByText('NY, USA')).toBeInTheDocument()
    })
  })

  it('calls onLocationChange and saves to sessionStorage on selecting suggestion', async () => {
    const handleLocationChange = vi.fn()
    render(<Places onLocationChange={handleLocationChange} />)
    const input = screen.getByPlaceholderText('Choose Location...')

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'New' } })

    const suggestionItem = await screen.findByText('New York')
    fireEvent.mouseDown(suggestionItem)

    await waitFor(() => {
      expect(handleLocationChange).toHaveBeenCalledWith({ lat: 40.7128, lng: -74.0060 })
      const cached = JSON.parse(window.sessionStorage.getItem('kwenchr_location'))
      expect(cached.address).toBe('New York, NY, USA')
      expect(cached.coords.latitude).toBe(40.7128)
    })
  })

  it('uses current location when current location option is clicked', async () => {
    const handleLocationChange = vi.fn()
    render(<Places onLocationChange={handleLocationChange} />)
    const input = screen.getByPlaceholderText('Choose Location...')

    fireEvent.focus(input)
    
    // Find current location option
    const currentLocationOption = screen.getByText('Use Current Location')
    fireEvent.mouseDown(currentLocationOption)

    await waitFor(() => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
      expect(handleLocationChange).toHaveBeenCalledWith({ lat: 40.7796, lng: -74.0238 })
      const cached = JSON.parse(window.sessionStorage.getItem('kwenchr_location'))
      expect(cached.isCurrentLocation).toBe(true)
    })
  })
})
