import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EventsList from './EventsList'

describe('EventsList Component', () => {
  it('renders fallback text when events array is empty or null', () => {
    const { rerender } = render(<EventsList events={[]} />)
    expect(screen.getByText('No specials found for this date.')).toBeInTheDocument()

    rerender(<EventsList events={null} />)
    expect(screen.getByText('No specials found for this date.')).toBeInTheDocument()
  })

  it('renders a list of events correctly', () => {
    const events = [
      {
        mgid: 'event-1',
        title: 'Happy Hour Special',
        short_desc: 'Half price drinks',
        rating: '90',
        image: { url: 'http://example.com/drink1.jpg' },
        occurrence: {
          start_time: '2026-08-28T17:00:00',
          end_time: '2026-08-28T20:00:00'
        },
        venue: {
          location: '40.7796,-74.0238',
          name: 'The local pub'
        }
      },
      {
        mgid: 'event-2',
        title: 'Taco Tuesday',
        short_desc: '$2 tacos and beers',
        rating: '85',
        image: null,
        occurrence: {
          start_time: '2026-08-28T18:00:00',
          end_time: '2026-08-28T22:00:00'
        },
        venue: {
          location: '40.7533,-74.0253',
          name: 'Taco Bar'
        }
      }
    ]

    render(<EventsList events={events} />)

    // Check title rendering
    expect(screen.getByText('Happy Hour Special')).toBeInTheDocument()
    expect(screen.getByText('Taco Tuesday')).toBeInTheDocument()

    // Check rating rendering
    expect(screen.getByText('90')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()

    // Check short description rendering
    expect(screen.getByText('Half price drinks')).toBeInTheDocument()
    expect(screen.getByText('$2 tacos and beers')).toBeInTheDocument()

    // Check time rendering (calls formatTime)
    expect(screen.getByText('5:00 pm')).toBeInTheDocument()
    expect(screen.getByText('8:00 pm')).toBeInTheDocument()
    expect(screen.getByText('6:00 pm')).toBeInTheDocument()
    expect(screen.getByText('10:00 pm')).toBeInTheDocument()

    // Check link references
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/event/event-1')
    expect(links[1]).toHaveAttribute('href', '/event/event-2')
  })

  it('paginates to 10 items when more than 10 events are provided', () => {
    const manyEvents = Array.from({ length: 25 }, (_, i) => ({
      mgid: `event-${i + 1}`,
      title: `Special Event ${i + 1}`,
      short_desc: 'Drink special description',
      rating: '80',
      occurrence: { start_time: '2026-08-28T17:00:00', end_time: '2026-08-28T20:00:00' },
      venue: { location: '40.7796,-74.0238', name: 'Pub' }
    }))

    render(<EventsList events={manyEvents} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(10)
    expect(screen.getByText('Special Event 1')).toBeInTheDocument()
    expect(screen.getByText('Special Event 10')).toBeInTheDocument()
    expect(screen.queryByText('Special Event 11')).not.toBeInTheDocument()
  })

  it('renders loading spinner when isLoadingMore is true', () => {
    const events = [
      {
        mgid: 'event-1',
        title: 'Happy Hour Special',
        short_desc: 'Half price drinks',
        occurrence: { start_time: '2026-08-28T17:00:00', end_time: '2026-08-28T20:00:00' }
      }
    ]

    const { rerender } = render(<EventsList events={events} isLoadingMore={false} />)
    expect(screen.queryByText('Loading more specials...')).not.toBeInTheDocument()

    rerender(<EventsList events={events} isLoadingMore={true} />)
    expect(screen.getByText('Loading more specials...')).toBeInTheDocument()
  })
})

