import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import User from '@/models/User'
import dbConnect from '@/lib/db'

// Mock dbConnect
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(true)
}))

// Mock User Mongoose model
vi.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findOne: vi.fn()
  }
}))

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 if credentials are missing', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    
    const body = await response.json()
    expect(body.error).toBe('Username/Email and password are required')
  })

  it('returns 401 if user does not exist', async () => {
    User.findOne.mockResolvedValueOnce(null)

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail: 'unknown', password: 'password123' })
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
    
    const body = await response.json()
    expect(body.error).toBe('Incorrect username/email or password')
    expect(User.findOne).toHaveBeenCalled()
  })

  it('returns 401 if password is incorrect', async () => {
    const mockUser = {
      _id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      password: 'correct-password'
    }
    User.findOne.mockResolvedValueOnce(mockUser)

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail: 'testuser', password: 'wrong-password' })
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
    
    const body = await response.json()
    expect(body.error).toBe('Incorrect username/email or password')
  })

  it('returns 200 and user details on successful authentication', async () => {
    const mockUser = {
      _id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      password: 'correct-password'
    }
    User.findOne.mockResolvedValueOnce(mockUser)

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail: 'testuser', password: 'correct-password' })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    
    const body = await response.json()
    expect(body._id).toBe('user-123')
    expect(body.username).toBe('testuser')
    expect(body.email).toBe('test@example.com')
    expect(body.password).toBeUndefined() // Password should be sanitized out
  })

  it('returns 500 on server error exceptions', async () => {
    User.findOne.mockRejectedValueOnce(new Error('DB failure'))

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail: 'testuser', password: 'password' })
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    
    const body = await response.json()
    expect(body.error).toBe('DB failure')
  })
})
