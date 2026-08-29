import { describe, it, expect } from 'vitest'
import User from './User'

describe('User Model Schema', () => {
  it('validates successfully with correct attributes', async () => {
    const user = new User({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      passwordConf: 'password123'
    })

    await expect(user.validate()).resolves.toBeUndefined()
  })

  it('fails validation when required fields are missing', async () => {
    const user = new User({})
    
    try {
      await user.validate()
      // Fail the test if no error is thrown
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.errors.email).toBeDefined()
      expect(error.errors.username).toBeDefined()
      expect(error.errors.password).toBeDefined()
      expect(error.errors.passwordConf).toBeDefined()
    }
  })

  it('trims whitespace from email and username fields', async () => {
    const user = new User({
      email: '  test@example.com  ',
      username: '  testuser  ',
      password: 'password123',
      passwordConf: 'password123'
    })

    await expect(user.validate()).resolves.toBeUndefined()

    expect(user.email).toBe('test@example.com')
    expect(user.username).toBe('testuser')
  })
})
