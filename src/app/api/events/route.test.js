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
