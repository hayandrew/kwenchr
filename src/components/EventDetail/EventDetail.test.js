import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import EventDetail from './EventDetail'

describe('EventDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', async () => {
    // Return a promise that does not resolve immediately
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}))

    render(<EventDetail mgid="test-mgid" />)

    expect(screen.getByText('Retrieving drink special details...')).toBeInTheDocument()
  })

  it('renders event not found on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false
    })

    render(<EventDetail mgid="test-mgid" />)

    await waitFor(() => {
      expect(screen.getByText('This drink special event could not be found or has expired.')).toBeInTheDocument()
    })
  })

  it('renders event details and promoter name on successful APIs lookup', async () => {
    const mockDbEvent = {
      _id: 'test-mgid',
      name: 'Super Happy Hour',
      short_description: 'Cheapest IPAs in Hoboken',
      long_description: 'Come try our selection of fine IPAs at 50% discount!',
      start_time: '2026-08-28T16:00:00',
      end_time: '2026-08-28T19:00:00',
      rating: '95',
      tags: ['happy-hour', 'comedy'],
      promoter_id: 'promoter-123',
      venue_name: 'Biergarten',
      venue_address: '100 River Road',
      venue_location: '40.7533,-74.0253'
    }

    const mockPromoterUser = {
      _id: 'promoter-123',
      username: 'Alice The Bartender'
    }

    // Mock fetch responses: first for event, second for promoter user
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/events/test-mgid')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDbEvent),
          clone: function() { return this; }
        })
      }
      if (url.includes('/api/user/promoter-123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPromoterUser)
        })
      }
      return Promise.reject(new Error('Unknown URL: ' + url))
    })

    render(<EventDetail mgid="test-mgid" />)

    await waitFor(() => {
      // Event title
      expect(screen.getByRole('heading', { name: 'Super Happy Hour' })).toBeInTheDocument()
      
      // Short description and long description
      expect(screen.getByText(/Short desc: Cheapest IPAs in Hoboken/)).toBeInTheDocument()
      expect(screen.getByText('Come try our selection of fine IPAs at 50% discount!')).toBeInTheDocument()

      // Rating
      expect(screen.getByText('Rating: 95')).toBeInTheDocument()

      // Event types tags mapping
      expect(screen.getByText('Happy Hour, Comedy')).toBeInTheDocument()

      // Promoter/organizer username
      expect(screen.getByText('Alice The Bartender')).toBeInTheDocument()

      // Venue info
      expect(screen.getByText('Biergarten')).toBeInTheDocument()
      expect(screen.getByText('100 River Road')).toBeInTheDocument()
    })
  })
})
