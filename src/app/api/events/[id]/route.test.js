import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFindById, mockFindOneAndUpdate, mockDeleteOne } = vi.hoisted(() => ({
  mockFindById: vi.fn(),
  mockFindOneAndUpdate: vi.fn(),
  mockDeleteOne: vi.fn()
}))

vi.mock('@/models/Event', () => ({
  __esModule: true,
  default: {
    findById: mockFindById,
    findOneAndUpdate: mockFindOneAndUpdate,
    deleteOne: mockDeleteOne
  }
}))

import { GET, PUT, DELETE } from './route'
import Events from '@/models/Event'

// Mock dbConnect
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(true)
}))

describe('Dynamic Events API Route (/api/events/[id])', () => {
  const mockParams = Promise.resolve({ id: 'event-123' })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns event details on successful lookup', async () => {
      const mockEvent = { _id: 'event-123', name: 'Margarita Party' }
      mockFindById.mockResolvedValueOnce(mockEvent)

      const response = await GET(null, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockEvent)
      expect(mockFindById).toHaveBeenCalledWith('event-123')
    })

    it('returns 404 if event does not exist', async () => {
      mockFindById.mockResolvedValueOnce(null)

      const response = await GET(null, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('Event not found')
    })

    it('returns 500 on database error', async () => {
      mockFindById.mockRejectedValueOnce(new Error('Connection failure'))

      const response = await GET(null, { params: mockParams })
      expect(response.status).toBe(500)

      const body = await response.json()
      expect(body.error).toBe('Connection failure')
    })
  })

  describe('PUT', () => {
    it('updates and returns the event successfully', async () => {
      const updatePayload = { name: 'Margarita Party (Updated)' }
      const mockUpdatedEvent = { _id: 'event-123', name: 'Margarita Party (Updated)' }
      mockFindOneAndUpdate.mockResolvedValueOnce(mockUpdatedEvent)

      const request = new Request('http://localhost/api/events/event-123', {
        method: 'PUT',
        body: JSON.stringify(updatePayload)
      })

      const response = await PUT(request, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockUpdatedEvent)
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ _id: 'event-123' }, updatePayload, { new: true })
    })

    it('returns 404 if event to update does not exist', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce(null)

      const request = new Request('http://localhost/api/events/event-123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Update Name' })
      })

      const response = await PUT(request, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('Event not found')
    })
  })

  describe('DELETE', () => {
    it('successfully deletes the event', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 })

      const response = await DELETE(null, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.message).toBe('event successfully deleted')
      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: 'event-123' })
    })

    it('returns 404 if event to delete does not exist', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 0 })

      const response = await DELETE(null, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('Event not found')
    })
  })
})
