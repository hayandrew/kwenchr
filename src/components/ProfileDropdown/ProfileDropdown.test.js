import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ProfileDropdown from './ProfileDropdown'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/Toast'

// Mock Toast component showToast function
vi.mock('@/components/Toast', () => ({
  default: () => null,
  showToast: vi.fn()
}))

describe('ProfileDropdown Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    router = useRouter()
  })

  it('renders dropdown button default text when not authenticated', () => {
    render(<ProfileDropdown />)
    expect(screen.getByText('Account')).toBeInTheDocument()
  })

  it('renders dropdown button username when authenticated', () => {
    const user = { username: 'john_doe', _id: '123' }
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify(user))

    render(<ProfileDropdown />)
    expect(screen.getByText('john_doe')).toBeInTheDocument()
  })

  it('toggles dropdown list for unauthenticated user on click', () => {
    render(<ProfileDropdown />)

    const triggerBtn = screen.getByRole('button')
    
    // No list links rendered initially
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()

    // Open dropdown
    fireEvent.click(triggerBtn)

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('toggles dropdown list for authenticated user on click', () => {
    const user = { username: 'john_doe', _id: '123' }
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify(user))

    render(<ProfileDropdown />)
    const triggerBtn = screen.getByRole('button')

    fireEvent.click(triggerBtn)

    expect(screen.getByRole('link', { name: 'My Events' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create Event' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit Profile' })).toBeInTheDocument()
    expect(screen.getByText('Log Out')).toBeInTheDocument()
  })

  it('handles Log Out action correctly', () => {
    const user = { username: 'john_doe', _id: '123' }
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify(user))

    const authListener = vi.fn()
    window.addEventListener('authChange', authListener)

    render(<ProfileDropdown />)
    const triggerBtn = screen.getByRole('button')
    fireEvent.click(triggerBtn)

    const logoutBtn = screen.getByText('Log Out')
    fireEvent.click(logoutBtn)

    expect(window.sessionStorage.getItem('kwenchr_user')).toBeNull()
    expect(authListener).toHaveBeenCalled()
    expect(showToast).toHaveBeenCalledWith('Logged out successfully.')
    expect(router.push).toHaveBeenCalledWith('/')
    expect(router.refresh).toHaveBeenCalled()

    window.removeEventListener('authChange', authListener)
  })
})
