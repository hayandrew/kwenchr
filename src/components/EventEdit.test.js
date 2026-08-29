import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EventEdit from './EventEdit'
import { useRouter } from 'next/navigation'

describe('EventEdit Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    router = useRouter()

    // Mock alert and prompt
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock Google Maps API with Geocoder constructor
    window.google = {
      maps: {
        Geocoder: function() {
          this.geocode = vi.fn().mockImplementation((req, callback) => {
            callback(
              [
                {
                  place_id: 'mock-place-id',
                  geometry: {
                    location: {
                      lat: () => 40.1234,
                      lng: () => -74.5678
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

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Access Restricted when user is not logged in', () => {
    render(<EventEdit />)
    expect(screen.getByText('You must be logged in to create or edit drink specials.')).toBeInTheDocument()
  })

  it('renders create event form when logged in', () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'user1', _id: 'user-1' }))
    render(<EventEdit />)

    expect(screen.getByRole('heading', { name: 'Create Drink Special' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. 2-for-1 Margarita Madness')).toHaveValue('')
    expect(screen.getByPlaceholderText('e.g. $5 Drafts and $6 Well Drinks all night')).toHaveValue('')
  })

  it('fetches and populates event details when mgid is provided for edit', async () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'user1', _id: 'user-1' }))
    
    const mockEvent = {
      name: 'Loaded Nachos & Beer',
      short_description: 'Nachos with cheap beers',
      long_description: 'Extended description text here.',
      venue_name: 'Madd Hatter',
      venue_address: '221 Washington St',
      image_url: 'http://example.com/nachos.png',
      type_id: 'comedy',
      start_time: '2026-08-28T18:00:00.000Z',
      end_time: '2026-08-28T21:00:00.000Z'
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvent)
    })

    render(<EventEdit mgid="event-123" />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Drink Special' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g. 2-for-1 Margarita Madness')).toHaveValue('Loaded Nachos & Beer')
      expect(screen.getByPlaceholderText('e.g. $5 Drafts and $6 Well Drinks all night')).toHaveValue('Nachos with cheap beers')
      expect(screen.getByPlaceholderText('e.g. The Duplex Piano Bar')).toHaveValue('Madd Hatter')
      expect(screen.getByPlaceholderText('e.g. 61 Christopher St, New York, NY 10014')).toHaveValue('221 Washington St')
    })
  })

  it('submits a new event and calls API POST request on save', async () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'user1', _id: 'user-1' }))
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })

    render(<EventEdit />)

    fireEvent.change(screen.getByPlaceholderText('e.g. 2-for-1 Margarita Madness'), { target: { value: 'New Test Event' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. $5 Drafts and $6 Well Drinks all night'), { target: { value: 'Short Desc Test' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. The Duplex Piano Bar'), { target: { value: 'Some Bar' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. 61 Christopher St, New York, NY 10014'), { target: { value: 'Some Address' } })

    const saveButton = screen.getByText('Create Special')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"name":"New Test Event"')
      }))
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Success: Event "New Test Event" created!'))
      expect(router.push).toHaveBeenCalledWith('/')
    })
  })
})
