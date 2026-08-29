import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

// Mock ProfileDropdown
vi.mock('./ProfileDropdown', () => ({
  default: () => <div data-testid="mock-profile-dropdown" />
}))

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  it('renders logo and tagline correctly', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: /Get Your Drink On/i })).toBeInTheDocument()
  })

  it('shows Sign In and Create Account links when not logged in', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.queryByTestId('mock-profile-dropdown')).not.toBeInTheDocument()
  })

  it('shows ProfileDropdown when user is logged in', () => {
    const user = { username: 'john_doe', _id: '123' }
    window.sessionStorage.setItem('kwenchr_user', JSON.stringify(user))

    render(<Header />)
    expect(screen.getByTestId('mock-profile-dropdown')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
  })
})
