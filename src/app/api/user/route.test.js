import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFind, mockSave } = vi.hoisted(() => ({
  mockFind: vi.fn(),
  mockSave: vi.fn()
}))

vi.mock('@/models/User', () => {
  function MockUser(data) {
    Object.assign(this, data)
    this.save = mockSave
  }
  MockUser.find = mockFind

  return {
    __esModule: true,
    default: MockUser
  }
})

import { GET, POST } from './route'
import User from '@/models/User'

// Mock dbConnect
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(true)
}))

describe('User API Routes (/api/user)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns all users successfully', async () => {
      const mockUsers = [{ username: 'alice' }, { username: 'bob' }]
      mockFind.mockResolvedValueOnce(mockUsers)

      const response = await GET()
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toEqual(mockUsers)
      expect(mockFind).toHaveBeenCalledWith({})
    })
  })

  describe('POST', () => {
    it('creates and saves a new user with 201 status code', async () => {
      const inputData = { username: 'newuser', email: 'new@example.com', password: 'password' }
      const savedUser = { ...inputData, _id: 'user-id-555' }
      mockSave.mockResolvedValueOnce(savedUser)

      const request = new Request('http://localhost/api/user', {
        method: 'POST',
        body: JSON.stringify(inputData)
      })

      const response = await POST(request)
      expect(response.status).toBe(201)

      const body = await response.json()
      expect(body).toEqual(savedUser)
      expect(mockSave).toHaveBeenCalled()
    })

    it('returns 400 if registering email that already exists', async () => {
      const dbError = new Error('E11000 duplicate key error collection')
      dbError.code = 11000
      dbError.keyValue = { email: 'duplicate@example.com' }
      mockSave.mockRejectedValueOnce(dbError)

      const request = new Request('http://localhost/api/user', {
        method: 'POST',
        body: JSON.stringify({ username: 'bob', email: 'duplicate@example.com', password: 'password' })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body.error).toBe('An account with that email already exists.')
    })

    it('returns 400 if registering username that already exists', async () => {
      const dbError = new Error('E11000 duplicate key error collection')
      dbError.code = 11000
      dbError.keyValue = { username: 'bob' }
      mockSave.mockRejectedValueOnce(dbError)

      const request = new Request('http://localhost/api/user', {
        method: 'POST',
        body: JSON.stringify({ username: 'bob', email: 'bob@example.com', password: 'password' })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body.error).toBe('An account with that username already exists.')
    })

    it('returns 500 on other registration database failures', async () => {
      mockSave.mockRejectedValueOnce(new Error('Unknown schema error'))

      const request = new Request('http://localhost/api/user', {
        method: 'POST',
        body: JSON.stringify({ username: 'bob', email: 'bob@example.com', password: 'password' })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const body = await response.json()
      expect(body.error).toBe('Unknown schema error')
    })
  })
})
