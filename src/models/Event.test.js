import { describe, it, expect } from 'vitest'
import Event from './Event'

describe('Event Model Schema', () => {
  it('validates successfully with correct attributes', async () => {
    const event = new Event({
      name: 'Beer Pong Night',
      places_id: 'place-pong-1',
      short_description: '$5 entry fee, winner gets cash prize',
      long_description: 'Come play beer pong with the locals of Hoboken every Thursday night.'
    })

    await expect(event.validate()).resolves.toBeUndefined()
  })

  it('fails validation when required fields are missing and returns custom messages', async () => {
    const event = new Event({})
    
    try {
      await event.validate()
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.errors.name.message).toBe('Missing required "name"')
      expect(error.errors.places_id.message).toBe('Missing required "places_id"')
      expect(error.errors.short_description.message).toBe('Missing required "short_description"')
      expect(error.errors.long_description.message).toBe('Missing required "long_description"')
    }
  })

  it('applies default values for optional/unset fields', async () => {
    const event = new Event({
      name: 'Sample Event',
      places_id: 'sample-places-id',
      short_description: 'Short desc',
      long_description: 'Long desc'
    })

    expect(event.start_time).toBeInstanceOf(Date)
    expect(event.end_time).toBeInstanceOf(Date)
    expect(event.Created_date).toBeInstanceOf(Date)
    expect(event.tags).toEqual([])
  })
})
