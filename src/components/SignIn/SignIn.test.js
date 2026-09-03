import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignIn from './SignIn'
import { useRouter } from 'next/navigation'
import { showToast } from './Toast'

vi.mock('./Toast', () => ({
  default: () => null,
  showToast: vi.fn()
}))

describe('SignIn Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    router = useRouter()
  })

  it('renders form inputs and cancel/submit buttons', () => {
    render(<SignIn />)

    expect(screen.getByPlaceholderText('Enter your username or email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('displays API error message on login failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' })
    })

    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter your username or email'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrong-pass' } })

    const submitBtn = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('signs in successfully, caches user details, triggers notifications and redirects', async () => {
    const mockUser = { _id: 'user-id-123', username: 'bob_builder', email: 'bob@build.com' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser)
    })

    const authListener = vi.fn()
    window.addEventListener('authChange', authListener)

    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter your username or email'), { target: { value: 'bob_builder' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'correct-pass' } })

    const submitBtn = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"usernameOrEmail":"bob_builder"')
      }))
      const cached = JSON.parse(window.sessionStorage.getItem('kwenchr_user'))
      expect(cached.username).toBe('bob_builder')
      expect(authListener).toHaveBeenCalled()
      expect(showToast).toHaveBeenCalledWith('Welcome back, bob_builder!')
      expect(router.push).toHaveBeenCalledWith('/')
    })

    window.removeEventListener('authChange', authListener)
  })
})
