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

  it('renders logo correctly', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('.icon-kwenchr')).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: /navigation menu/i })).not.toBeInTheDocument()
  })

  it('renders mobile nav toggle button and opens dropdown menu on click', async () => {
    const { fireEvent } = await import('@testing-library/react')
    render(<Header />)

    const toggleBtn = screen.getByRole('button', { name: 'Open navigation menu' })
    expect(toggleBtn).toBeInTheDocument()
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')

    // Click toggle button to open mobile menu
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toBeInTheDocument()

    // The dropdown contains links
    const links = screen.getAllByRole('link', { name: /Sign In/i })
    expect(links.length).toBeGreaterThanOrEqual(2) // desktop + mobile

    // Click toggle button again to close
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')
  })
})
