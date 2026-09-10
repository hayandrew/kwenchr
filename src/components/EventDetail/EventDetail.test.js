import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import EventDetail from './EventDetail'
import { showToast } from '@/components/Toast'

vi.mock('@/components/Toast', () => ({
  default: () => null,
  showToast: vi.fn()
}))

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

      // Rating should not be rendered
      expect(screen.queryByText(/Rating:/)).not.toBeInTheDocument()

      // Event types tags mapping
      expect(screen.getByText('Happy Hour, Comedy')).toBeInTheDocument()

      // Promoter/organizer username
      expect(screen.getByText('Alice The Bartender')).toBeInTheDocument()

      // Venue info
      expect(screen.getByText('Biergarten')).toBeInTheDocument()
      expect(screen.getByText('100 River Road')).toBeInTheDocument()
    })
  })

  it('uses promoter_name directly from event response without making secondary user fetch', async () => {
    const mockDbEvent = {
      _id: 'test-direct-mgid',
      name: 'Direct Promoter Event',
      short_description: 'Fast loading event',
      long_description: 'Loaded with promoter_name already attached by the server',
      start_time: '2026-08-28T16:00:00',
      end_time: '2026-08-28T19:00:00',
      promoter_id: 'promoter-direct',
      promoter_name: 'Bob Direct'
    }

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/events/test-direct-mgid')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDbEvent),
          clone: function() { return this; }
        })
      }
      return Promise.reject(new Error('Should not call: ' + url))
    })
    global.fetch = fetchMock

    render(<EventDetail mgid="test-direct-mgid" />)

    await waitFor(() => {
      expect(screen.getByText('Bob Direct')).toBeInTheDocument()
    })

    const userApiCalls = fetchMock.mock.calls.filter(([url]) => url && url.includes('/api/user/'))
    expect(userApiCalls).toHaveLength(0)
  })

  it('renders a share button and copies event link to clipboard showing toast on click', async () => {
    const mockDbEvent = {
      _id: 'test-share-mgid',
      name: 'Shareable Event',
      short_description: 'Great party',
      long_description: 'Come party with us',
      start_time: '2026-08-28T16:00:00',
      end_time: '2026-08-28T19:00:00',
      promoter_id: 'promoter-123',
      venue_name: 'Club Venue'
    }

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/events/test-share-mgid')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDbEvent),
          clone: function() { return this; }
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: 'Promoter' })
      })
    })

    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    render(<EventDetail mgid="test-share-mgid" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    })

    const shareButton = screen.getByRole('button', { name: /share/i })
    fireEvent.click(shareButton)

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('/event/test-share-mgid'))
      expect(showToast).toHaveBeenCalledWith('Copied to clipboard!')
    })
  })
})
