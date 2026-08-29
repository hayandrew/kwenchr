import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileEdit from './ProfileEdit'
import { useRouter } from 'next/navigation'

describe('ProfileEdit Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    router = useRouter()

    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading state initially', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}))
    render(<ProfileEdit mgid="user-123" />)
    expect(screen.getByText('Retrieving profile details...')).toBeInTheDocument()
  })

  it('renders Access Restricted when user is not logged in', async () => {
    // Auth checked but no logged in user
    render(<ProfileEdit mgid="undefined" />)
    
    await waitFor(() => {
      expect(screen.getByText('You must be logged in to view or edit user profiles.')).toBeInTheDocument()
    })
  })

  it('fetches and populates profile form when user is logged in', async () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'bob', _id: 'user-123' }))
    const mockUser = {
      username: 'bob',
      email: 'bob@example.com'
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
      clone: function() { return this; }
    })

    render(<ProfileEdit mgid="user-123" />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Profile' })).toBeInTheDocument()
      expect(screen.getByDisplayValue('bob')).toBeInTheDocument()
      expect(screen.getByDisplayValue('bob@example.com')).toBeInTheDocument()
    })
  })

  it('alerts if passwords do not match', async () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'bob', _id: 'user-123' }))
    const mockUser = {
      username: 'bob',
      email: 'bob@example.com'
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
      clone: function() { return this; }
    })

    render(<ProfileEdit mgid="user-123" />)

    await screen.findByRole('heading', { name: 'Edit Profile' })

    const passwordInputs = screen.getAllByPlaceholderText('Leave blank to keep current')
    const passwordInput = passwordInputs[0]
    const confirmPasswordInput = passwordInputs[1]

    // Change passwords
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })

    const saveButton = screen.getByText('Save Profile')
    fireEvent.click(saveButton)

    expect(window.alert).toHaveBeenCalledWith('Error: Passwords do not match!')
    expect(global.fetch).not.toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'PUT' }))
  })

  it('submits updated profile changes on form submit', async () => {
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify({ username: 'bob', _id: 'user-123' }))
    const mockUser = {
      username: 'bob',
      email: 'bob@example.com'
    }

    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (options && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
        clone: function() { return this; }
      })
    })

    render(<ProfileEdit mgid="user-123" />)

    await screen.findByRole('heading', { name: 'Edit Profile' })

    const usernameInput = screen.getByDisplayValue('bob')
    fireEvent.change(usernameInput, { target: { value: 'bobby' } })

    const saveButton = screen.getByText('Save Profile')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/user-123', expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"username":"bobby"')
      }))
      expect(window.alert).toHaveBeenCalledWith('Profile successfully updated!')
      expect(router.push).toHaveBeenCalledWith('/')
    })
  })
})
