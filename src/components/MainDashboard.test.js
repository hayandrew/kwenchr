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
})
