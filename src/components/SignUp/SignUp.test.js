import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUp from './SignUp'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/Toast'

vi.mock('@/components/Toast', () => ({
  default: () => null,
  showToast: vi.fn()
}))

describe('SignUp Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    router = useRouter()
  })

  it('renders input elements and cancel/submit buttons', () => {
    render(<SignUp />)

    expect(screen.getByPlaceholderText('e.g. bartender_pro')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. user@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min 6 characters recommended')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('displays error if passwords do not match', async () => {
    render(<SignUp />)

    fireEvent.change(screen.getByPlaceholderText('e.g. bartender_pro'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. user@example.com'), { target: { value: 'bob@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Min 6 characters recommended'), { target: { value: 'pass123' } })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), { target: { value: 'pass456' } })

    const submitBtn = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitBtn)

    expect(screen.getByText('Passwords do not match!')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('signs up successfully, sets session storage and redirects on success', async () => {
    const mockCreatedUser = { _id: 'user-id-abc', username: 'bob_the_chef', email: 'chef@kitchen.com' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCreatedUser)
    })

    const authListener = vi.fn()
    window.addEventListener('authChange', authListener)

    render(<SignUp />)

    fireEvent.change(screen.getByPlaceholderText('e.g. bartender_pro'), { target: { value: 'bob_the_chef' } })
    fireEvent.change(screen.getByPlaceholderText('e.g. user@example.com'), { target: { value: 'chef@kitchen.com' } })
    fireEvent.change(screen.getByPlaceholderText('Min 6 characters recommended'), { target: { value: 'secretpass' } })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), { target: { value: 'secretpass' } })

    const submitBtn = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"username":"bob_the_chef"')
      }))
      const cached = JSON.parse(window.sessionStorage.getItem('kwenchr_user'))
      expect(cached.username).toBe('bob_the_chef')
      expect(authListener).toHaveBeenCalled()
      expect(showToast).toHaveBeenCalledWith('Account registered successfully!')
      expect(router.push).toHaveBeenCalledWith('/')
    })

    window.removeEventListener('authChange', authListener)
  })
})
