import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import MainDashboard, { clearDashboardCache } from './MainDashboard'
import moment from 'moment'

// Mock Google maps just in case it is requested by Places/Location subcomponents
beforeEach(() => {
  window.google = {
    maps: {
      importLibrary: vi.fn().mockResolvedValue({
        AutocompleteSuggestion: {}
      }),
      Geocoder: vi.fn().mockImplementation(() => ({
        geocode: vi.fn()
      }))
    }
  }
})

describe('MainDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    clearDashboardCache()
  })

  it('fetches events on mount and displays them', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const mockEvents = [
      {
        _id: 'event-1',
        name: 'Irish Pub Happy Hour',
        short_description: 'Cheap Guinness',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        tags: ['happy-hour'],
        venue_name: 'The Dubliner',
        venue_location: '40.7356,-74.0253'
      },
      {
        _id: 'event-2',
        name: 'Standup Comedy Night',
        short_description: 'Hilarious acts',
        start_time: `${todayStr}T20:00:00.000Z`,
        end_time: `${todayStr}T23:00:00.000Z`,
        tags: ['comedy'],
        venue_name: 'Comedy Club',
        venue_location: '40.7533,-74.0253'
      }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
      clone: function() { return this; }
    })

    render(<MainDashboard />)

    // Verify events render after successful fetch
    await waitFor(() => {
      expect(screen.getByText('Irish Pub Happy Hour')).toBeInTheDocument()
      expect(screen.getByText('Standup Comedy Night')).toBeInTheDocument()
    })

    // Verify initial request fetched only 10 items via page=1&limit=10
    expect(global.fetch).toHaveBeenCalledWith('/api/events?page=1&limit=10&lat=40.7796&lng=-74.0238', undefined)
  })

  it('fetches next 10 events from API when infinite scroll triggers', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const page1Events = Array.from({ length: 10 }, (_, i) => ({
      _id: `event-${i + 1}`,
      name: `Special ${i + 1}`,
      short_description: `Desc ${i + 1}`,
      start_time: `${todayStr}T17:00:00.000Z`,
      end_time: `${todayStr}T20:00:00.000Z`,
      venue_location: '40.7796,-74.0238'
    }))

    const page2Events = [
      {
        _id: 'event-11',
        name: 'Page 2 Special',
        short_description: 'Loaded via infinite scroll',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        venue_location: '40.7796,-74.0238'
      }
    ]

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('page=2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(page2Events),
          clone: function() { return this; }
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(page1Events),
        clone: function() { return this; }
      })
    })

    render(<MainDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Special 1')).toBeInTheDocument()
      expect(screen.getByText('Special 10')).toBeInTheDocument()
    })

    // Simulate scrolling center-column near the bottom
    const centerCol = document.querySelector('.center-column')
    Object.defineProperty(centerCol, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(centerCol, 'clientHeight', { value: 500, configurable: true })
    centerCol.scrollTop = 450 // 1000 - 450 - 500 = 50 < 150
    fireEvent.scroll(centerCol)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events?page=2&limit=10&lat=40.7796&lng=-74.0238', undefined)
      expect(screen.getByText('Page 2 Special')).toBeInTheDocument()
    })
  })

  it('filters events by type selection', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const mockEvents = [
      {
        _id: 'event-1',
        name: 'Irish Pub Happy Hour',
        short_description: 'Cheap Guinness',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        tags: ['happy-hour'],
        venue_name: 'The Dubliner',
        venue_location: '40.7356,-74.0253'
      },
      {
        _id: 'event-2',
        name: 'Standup Comedy Night',
        short_description: 'Hilarious acts',
        start_time: `${todayStr}T20:00:00.000Z`,
        end_time: `${todayStr}T23:00:00.000Z`,
        tags: ['comedy'],
        venue_name: 'Comedy Club',
        venue_location: '40.7533,-74.0253'
      }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
      clone: function() { return this; }
    })

    render(<MainDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Irish Pub Happy Hour')).toBeInTheDocument()
    })

    // Open EventType filter dropdown (button label starts as "Event Types")
    const filterBtn = screen.getByRole('button', { name: /Event Types/i })
    fireEvent.click(filterBtn)

    // Check "Comedy" checkbox to trigger filtering
    const comedyCheckbox = screen.getByLabelText('Comedy')
    fireEvent.click(comedyCheckbox)

    // After filtering by "comedy", only event-2 (Comedy Night) should render
    await waitFor(() => {
      expect(screen.getByText('Standup Comedy Night')).toBeInTheDocument()
      expect(screen.queryByText('Irish Pub Happy Hour')).not.toBeInTheDocument()
    })
  })

  it('preserves cached events and restores scroll position across instances', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const mockEvents = [
      {
        _id: 'event-1',
        name: 'Irish Pub Happy Hour',
        short_description: 'Cheap Guinness',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        tags: ['happy-hour'],
        venue_name: 'The Dubliner',
        venue_location: '40.7356,-74.0253'
      }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
      clone: function() { return this; }
    })

    const { unmount } = render(<MainDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Irish Pub Happy Hour')).toBeInTheDocument()
    })

    // Simulate user scrolling center-column
    const centerCol = document.querySelector('.center-column')
    centerCol.scrollTop = 450
    fireEvent.scroll(centerCol)

    // Unmount (simulating navigation to /event/event-1)
    unmount()

    // Render new instance (as happens on /event/event-1 or returning to /)
    render(<MainDashboard><div>Modal Child</div></MainDashboard>)

    // Event should immediately be in the document without waiting for fetch
    expect(screen.getByText('Irish Pub Happy Hour')).toBeInTheDocument()
    const newCenterCol = document.querySelector('.center-column')
    expect(newCenterCol.scrollTop).toBe(450)
  })

  it('fetches events and replaces existing events when location changes', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const initialEvents = [
      {
        _id: 'initial-1',
        name: 'Initial Hoboken Event',
        short_description: 'Hoboken Special',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        venue_location: '40.7440,-74.0324'
      }
    ]

    const newLocationEvents = [
      {
        _id: 'new-1',
        name: 'New York Rooftop Event',
        short_description: 'Manhattan Special',
        start_time: `${todayStr}T18:00:00.000Z`,
        end_time: `${todayStr}T22:00:00.000Z`,
        venue_location: '40.7128,-74.0060'
      }
    ]

    let fetchCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount++
      if (fetchCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(initialEvents),
          clone: function() { return this; }
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newLocationEvents),
        clone: function() { return this; }
      })
    })

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

    render(<MainDashboard />)

    // Verify initial event renders
    await waitFor(() => {
      expect(screen.getByText('Initial Hoboken Event')).toBeInTheDocument()
    })

    // Type in location search to change location
    const input = screen.getByPlaceholderText(/Choose Location|Current Location/i)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'New York' } })

    const suggestionItem = await screen.findByText('New York')
    fireEvent.mouseDown(suggestionItem)

    // Verify that events are re-fetched and replace the initial events
    await waitFor(() => {
      expect(screen.getByText('New York Rooftop Event')).toBeInTheDocument()
      expect(screen.queryByText('Initial Hoboken Event')).not.toBeInTheDocument()
    })
  })

  it('requests events with lat and lng query params and renders closest events first across pagination', async () => {
    const todayStr = moment().format('YYYY-MM-DD')
    const page1Events = Array.from({ length: 10 }, (_, i) => ({
      _id: `close-event-${i + 1}`,
      name: `Close Special ${i + 1}`,
      short_description: `Close Desc ${i + 1}`,
      start_time: `${todayStr}T17:00:00.000Z`,
      end_time: `${todayStr}T20:00:00.000Z`,
      venue_location: '40.7796,-74.0238' // 0 km
    }))

    const page2Events = [
      {
        _id: 'far-event-1',
        name: 'Far Special 1',
        short_description: 'Far Desc',
        start_time: `${todayStr}T17:00:00.000Z`,
        end_time: `${todayStr}T20:00:00.000Z`,
        venue_location: '39.9526,-75.1652' // ~130 km
      }
    ]

    global.fetch = vi.fn().mockImplementation((url) => {
      expect(url).toContain('lat=40.7796&lng=-74.0238')
      if (url.includes('page=2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(page2Events),
          clone: function() { return this; }
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(page1Events),
        clone: function() { return this; }
      })
    })

    render(<MainDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Close Special 1')).toBeInTheDocument()
      expect(screen.getByText('Close Special 10')).toBeInTheDocument()
    })

    // Scroll to load page 2
    const centerCol = document.querySelector('.center-column')
    Object.defineProperty(centerCol, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(centerCol, 'clientHeight', { value: 500, configurable: true })
    centerCol.scrollTop = 450
    fireEvent.scroll(centerCol)

    await waitFor(() => {
      expect(screen.getByText('Far Special 1')).toBeInTheDocument()
    })

    // Confirm that page 1 closest events are rendered above the page 2 farther events in the DOM
    const allRenderedTitles = screen.getAllByRole('heading', { level: 2 }).map(el => el.textContent)
    const closeIndex = allRenderedTitles.indexOf('Close Special 1')
    const farIndex = allRenderedTitles.indexOf('Far Special 1')
    expect(closeIndex).toBeLessThan(farIndex)
  })
})
