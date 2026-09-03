import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFind, mockSave } = vi.hoisted(() => ({
  mockFind: vi.fn(),
  mockSave: vi.fn()
}))

vi.mock('@/models/Event', () => {
  function MockEvent(data) {
    Object.assign(this, data)
    this.save = mockSave
  }
  MockEvent.find = mockFind

  return {
    __esModule: true,
    default: MockEvent
  }
})

import { GET, POST } from './route'
import Events from '@/models/Event'

// Mock dbConnect
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(true)
}))

describe('Events API Routes (/api/events)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns all events successfully', async () => {
      const mockList = [{ name: 'Event A' }, { name: 'Event B' }]
      mockFind.mockResolvedValueOnce(mockList)

      const response = await GET()
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockList)
      expect(mockFind).toHaveBeenCalledWith({})
    })

    it('returns 500 on database retrieval errors', async () => {
      mockFind.mockRejectedValueOnce(new Error('Read timeout'))

      const response = await GET()
      expect(response.status).toBe(500)

      const body = await response.json()
      expect(body.error).toBe('Read timeout')
    })

    it('supports pagination with page and limit parameters', async () => {
      const mockQuery = {
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValueOnce([{ name: 'Page 2 Event' }])
      }
      mockFind.mockReturnValueOnce(mockQuery)

      const request = new Request('http://localhost/api/events?page=2&limit=10')
      const response = await GET(request)
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual([{ name: 'Page 2 Event' }])
      expect(mockFind).toHaveBeenCalledWith({})
      expect(mockQuery.skip).toHaveBeenCalledWith(10)
      expect(mockQuery.limit).toHaveBeenCalledWith(10)
    })

    it('sorts events by closest distance when lat and lng are provided', async () => {
      const mockList = [
        { name: 'Far Away Event', venue_location: '39.9526,-75.1652' }, // Philadelphia (~130km)
        { name: 'Closest Event', venue_location: '40.7440,-74.0324' },  // Hoboken (0km)
        { name: 'Medium Event', venue_location: '40.7282,-74.0324' },   // Jersey City (~1.7km)
      ]
      mockFind.mockResolvedValueOnce(mockList)

      const request = new Request('http://localhost/api/events?lat=40.7440&lng=-74.0324')
      const response = await GET(request)
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.map((e) => e.name)).toEqual(['Closest Event', 'Medium Event', 'Far Away Event'])
    })

    it('paginates correctly by closest first', async () => {
      const mockList = [
        { name: 'Far Away Event', venue_location: '39.9526,-75.1652' }, // Philadelphia (~130km)
        { name: 'Closest Event', venue_location: '40.7440,-74.0324' },  // Hoboken (0km)
        { name: 'Medium Event', venue_location: '40.7282,-74.0324' },   // Jersey City (~1.7km)
      ]

      // Page 1 with limit 2 -> Closest and Medium
      mockFind.mockResolvedValueOnce(mockList)
      const req1 = new Request('http://localhost/api/events?lat=40.7440&lng=-74.0324&page=1&limit=2')
      const res1 = await GET(req1)
      const body1 = await res1.json()
      expect(body1.map((e) => e.name)).toEqual(['Closest Event', 'Medium Event'])

      // Page 2 with limit 2 -> Far Away Event
      mockFind.mockResolvedValueOnce(mockList)
      const req2 = new Request('http://localhost/api/events?lat=40.7440&lng=-74.0324&page=2&limit=2')
      const res2 = await GET(req2)
      const body2 = await res2.json()
      expect(body2.map((e) => e.name)).toEqual(['Far Away Event'])
    })
  })

  describe('POST', () => {
    it('creates and saves a new event with 201 status code', async () => {
      const inputData = { name: 'New Year Bash', price: 10 }
      const savedData = { ...inputData, _id: 'event-id-999' }
      mockSave.mockResolvedValueOnce(savedData)

      const request = new Request('http://localhost/api/events', {
        method: 'POST',
        body: JSON.stringify(inputData)
      })

      const response = await POST(request)
      expect(response.status).toBe(201)

      const body = await response.json()
      expect(body).toEqual(savedData)
      expect(mockSave).toHaveBeenCalled()
    })

    it('returns 500 on save failure exceptions', async () => {
      mockSave.mockRejectedValueOnce(new Error('Validation failed'))

      const request = new Request('http://localhost/api/events', {
        method: 'POST',
        body: JSON.stringify({ name: 'Invalid Event' })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const body = await response.json()
      expect(body.error).toBe('Validation failed')
    })
  })
})
