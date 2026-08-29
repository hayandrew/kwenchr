import { describe, it, expect } from 'vitest'
import { dummyUsers, dummyEvents } from './seedData'

describe('seedData Configuration', () => {
  it('exports dummyUsers with valid user details fields', () => {
    expect(Array.isArray(dummyUsers)).toBe(true)
    expect(dummyUsers.length).toBeGreaterThan(0)

    // Check structure of first user
    const firstUser = dummyUsers[0]
    expect(firstUser).toHaveProperty('email')
    expect(firstUser).toHaveProperty('username')
    expect(firstUser).toHaveProperty('password')
    expect(firstUser).toHaveProperty('passwordConf')
    expect(firstUser.password).toBe(firstUser.passwordConf)
  })

  it('exports dummyEvents with valid event details fields', () => {
    expect(Array.isArray(dummyEvents)).toBe(true)
    expect(dummyEvents.length).toBeGreaterThan(0)

    // Check structure of first event
    const firstEvent = dummyEvents[0]
    expect(firstEvent).toHaveProperty('name')
    expect(firstEvent).toHaveProperty('short_description')
    expect(firstEvent).toHaveProperty('type_id')
    expect(firstEvent).toHaveProperty('venue_name')
    expect(firstEvent).toHaveProperty('venue_address')
    expect(firstEvent).toHaveProperty('venue_location')
  })
})
