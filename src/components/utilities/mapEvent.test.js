import { describe, it, expect } from 'vitest'
import { mapDbEventToClient } from './mapEvent'

describe('mapEvent utility', () => {
  it('returns null if dbEvent is falsy', () => {
    expect(mapDbEventToClient(null)).toBeNull()
    expect(mapDbEventToClient(undefined)).toBeNull()
  })

  it('returns the input directly if it is already in client format', () => {
    const clientEvent = {
      occurrence: { start_time: '2026-08-28T20:00:00' },
      venue: { name: 'Bar A' },
      title: 'Happy Hour'
    }
    expect(mapDbEventToClient(clientEvent)).toBe(clientEvent)
  })

  it('correctly maps a database event to a client-facing event model', () => {
    const dbEvent = {
      _id: 'db-id-123',
      name: 'Beer Festival',
      short_description: 'Great beer event',
      long_description: 'A very long description about the beer festival',
      start_time: '2026-08-28T18:00:00',
      end_time: '2026-08-28T22:00:00',
      price: { min: 10, max: 20, currency: 'USD', prefix: '$' },
      rating: '92',
      tags: ['beer', 'craft'],
      type_id: 'type-beer',
      promoter_id: 'promoter-1',
      image_url: 'http://example.com/beer.jpg',
      places_id: 'places-hoboken-1',
      venue_name: 'Hoboken Biergarten',
      venue_address: '100 River St',
      venue_location: '40.7356,-74.0253'
    }

    const result = mapDbEventToClient(dbEvent)

    expect(result.id).toBe('db-id-123')
    expect(result.mgid).toBe('db-id-123')
    expect(result.title).toBe('Beer Festival')
    expect(result.short_desc).toBe('Great beer event')
    expect(result.long_desc).toBe('A very long description about the beer festival')
    expect(result.occurrence.start_time).toBe('2026-08-28T18:00:00')
    expect(result.occurrence.end_time).toBe('2026-08-28T22:00:00')
    expect(result.price.min).toBe(10)
    expect(result.rating).toBe('92')
    expect(result.tags).toEqual(['beer', 'craft'])
    expect(result.venue.name).toBe('Hoboken Biergarten')
    expect(result.venue.address).toBe('100 River St')
    expect(result.venue.location).toBe('40.7356,-74.0253')
  })

  it('applies fallbacks for missing dbEvent optional fields', () => {
    const minimalDbEvent = {
      _id: 'id-123',
      name: 'Simple Event'
    }

    const result = mapDbEventToClient(minimalDbEvent)

    expect(result.short_desc).toBe('')
    expect(result.long_desc).toBe('')
    expect(result.price.min).toBe(5)
    expect(result.price.max).toBe(15)
    expect(result.rating).toBe('85')
    expect(result.image.url).toContain('unsplash.com')
    expect(result.venue.name).toBe('Local Venue')
    expect(result.venue.address).toBe('Local Address')
    expect(result.venue.location).toBe('40.7796,-74.0238')
  })
})
