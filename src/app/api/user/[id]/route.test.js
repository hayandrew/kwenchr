import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFindById, mockFindOneAndUpdate, mockDeleteOne } = vi.hoisted(() => ({
  mockFindById: vi.fn(),
  mockFindOneAndUpdate: vi.fn(),
  mockDeleteOne: vi.fn()
}))

vi.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findById: mockFindById,
    findOneAndUpdate: mockFindOneAndUpdate,
    deleteOne: mockDeleteOne
  }
}))

import { GET, PUT, DELETE } from './route'
import User from '@/models/User'

// Mock dbConnect
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(true)
}))

describe('Dynamic User API Route (/api/user/[id])', () => {
  const mockParams = Promise.resolve({ id: 'user-777' })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns user document on successful lookup', async () => {
      const mockUserData = { _id: 'user-777', username: 'dan', email: 'dan@example.com' }
      mockFindById.mockResolvedValueOnce(mockUserData)

      const response = await GET(null, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockUserData)
      expect(mockFindById).toHaveBeenCalledWith('user-777')
    })

    it('returns 404 if user does not exist', async () => {
      mockFindById.mockResolvedValueOnce(null)

      const response = await GET(null, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('User not found')
    })
  })

  describe('PUT', () => {
    it('updates and returns the user successfully', async () => {
      const updatePayload = { email: 'dan_new@example.com' }
      const mockUpdatedUser = { _id: 'user-777', username: 'dan', email: 'dan_new@example.com' }
      mockFindOneAndUpdate.mockResolvedValueOnce(mockUpdatedUser)

      const request = new Request('http://localhost/api/user/user-777', {
        method: 'PUT',
        body: JSON.stringify(updatePayload)
      })

      const response = await PUT(request, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockUpdatedUser)
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ _id: 'user-777' }, updatePayload, { new: true })
    })

    it('returns 400 if updating to an email that is already registered to another user', async () => {
      const dbError = new Error('E11000 duplicate key error collection')
      dbError.code = 11000
      dbError.keyValue = { email: 'duplicate@example.com' }
      mockFindOneAndUpdate.mockRejectedValueOnce(dbError)

      const request = new Request('http://localhost/api/user/user-777', {
        method: 'PUT',
        body: JSON.stringify({ email: 'duplicate@example.com' })
      })

      const response = await PUT(request, { params: mockParams })
      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body.error).toBe('An account with that email already exists.')
    })

    it('returns 404 if user to update does not exist', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce(null)

      const request = new Request('http://localhost/api/user/user-777', {
        method: 'PUT',
        body: JSON.stringify({ username: 'newname' })
      })

      const response = await PUT(request, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('User not found')
    })
  })

  describe('DELETE', () => {
    it('successfully deletes the user', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 })

      const response = await DELETE(null, { params: mockParams })
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.message).toBe('user successfully deleted')
      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: 'user-777' })
    })

    it('returns 404 if user to delete does not exist', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 0 })

      const response = await DELETE(null, { params: mockParams })
      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body.message).toBe('User not found')
    })
  })
})
