import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyEvents from './MyEvents'

// Mock events data to keep the test independent of external static files
vi.mock('@/data/events', () => ({
  default: [
    { mgid: '1', id: '1', title: 'Event 1', venue: { name: 'Venue 1' }, occurrence: { start_time: '2026-08-28T20:00:00' } },
    { mgid: '2', id: '2', title: 'Event 2', venue: { name: 'Venue 2' }, occurrence: { start_time: '2026-08-28T21:00:00' } },
    { mgid: '3', id: '3', title: 'Event 3', venue: { name: 'Venue 3' }, occurrence: { start_time: '2026-08-28T22:00:00' } },
    { mgid: '4', id: '4', title: 'Event 4', venue: { name: 'Venue 4' }, occurrence: { start_time: '2026-08-28T23:00:00' } },
  ]
}))

describe('MyEvents Component', () => {
  it('renders Overlay with correct title and lists the first three mocked events', () => {
    render(<MyEvents />)

    expect(screen.getByRole('heading', { name: 'My Events' })).toBeInTheDocument()
    expect(screen.getByText('Drink specials and happy hours you have bookmarked or created:')).toBeInTheDocument()

    // Assert only Event 1, Event 2, Event 3 are rendered (first 3)
    expect(screen.getByText('Event 1')).toBeInTheDocument()
    expect(screen.getByText('Event 2')).toBeInTheDocument()
    expect(screen.getByText('Event 3')).toBeInTheDocument()
    expect(screen.queryByText('Event 4')).not.toBeInTheDocument()
  })
})
