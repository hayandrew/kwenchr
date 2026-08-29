import { describe, it, expect, vi, beforeEach } from 'vitest'
import calculateDistance, { getDistanceKm } from './calculateDistance'

describe('calculateDistance utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  describe('getDistanceKm', () => {
    it('calculates distance correctly between two points', () => {
      // Distance between New York (40.7128, -74.0060) and Boston (42.3601, -71.0589)
      const distance = getDistanceKm(40.7128, -74.0060, 42.3601, -71.0589)
      // Roughly 305 km
      expect(distance).toBeGreaterThan(300)
      expect(distance).toBeLessThan(310)
    })
  })

  describe('calculateDistance', () => {
    it('returns "Distance unknown" if no coordinates are provided', () => {
      expect(calculateDistance(null)).toBe('Distance unknown')
      expect(calculateDistance('')).toBe('Distance unknown')
    })

    it('returns "Distance unknown" if invalid coordinates are provided', () => {
      expect(calculateDistance('invalid-coords')).toBe('Distance unknown')
      expect(calculateDistance('40.7128,abc')).toBe('Distance unknown')
    })

    it('calculates distance in feet if it is less than 1 mile away', () => {
      // 40.7796, -74.0238 is the default user coordinates
      // Place another point very close (roughly ~500 feet away)
      // Latitude changes about 0.0001 per 36 feet, longitude changes about 0.0001 per 27 feet in NJ
      const closeVenue = '40.7806,-74.0238' 
      const result = calculateDistance(closeVenue)
      expect(result).toContain('feet away')
    })

    it('calculates distance in miles if it is greater than 1 mile away', () => {
      // Place another point further away (~4-5 miles)
      const farVenue = '40.7128,-74.0060'
      const result = calculateDistance(farVenue)
      expect(result).toContain('miles away')
    })

    it('respects user coordinates cached in sessionStorage', () => {
      // Cache coordinates for Boston
      const cachedLocation = {
        coords: {
          latitude: 42.3601,
          longitude: -71.0589
        }
      }
      window.sessionStorage.setItem('kwenchr_location', JSON.stringify(cachedLocation))

      // Venue in Boston (close to cached coordinates)
      const closeVenue = '42.3610,-71.0589'
      const result = calculateDistance(closeVenue)
      expect(result).toContain('feet away')
    })
  })
})
