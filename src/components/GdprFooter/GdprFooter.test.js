import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GdprFooter from './GdprFooter'

describe('GdprFooter Component', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders consent banner when no consent is stored in localStorage', () => {
    render(<GdprFooter />)

    expect(screen.getByRole('region', { name: /cookie and privacy consent banner/i })).toBeInTheDocument()
    expect(screen.getByText(/Privacy & Cookie Consent/i)).toBeInTheDocument()
    expect(screen.getByText(/kwenchr uses cookies and local device data/i)).toBeInTheDocument()

    // Action buttons
    expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reject non-essential/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /customize/i })).toBeInTheDocument()

    // Policy links
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: /cookie policy/i })).toHaveAttribute('href', '/cookies')
    expect(screen.getByRole('link', { name: /gdpr rights/i })).toHaveAttribute('href', '/gdpr')
  })

  it('does not render banner when consent is already accepted in localStorage', () => {
    localStorage.setItem(
      'kwenchr_gdpr_consent',
      JSON.stringify({ status: 'accepted', necessary: true, location: true, analytics: true })
    )

    render(<GdprFooter />)
    expect(screen.queryByRole('region', { name: /cookie and privacy consent banner/i })).not.toBeInTheDocument()
  })

  it('stores accepted consent and hides banner when clicking Accept All', () => {
    render(<GdprFooter />)

    const acceptBtn = screen.getByRole('button', { name: /accept all/i })
    fireEvent.click(acceptBtn)

    const saved = JSON.parse(localStorage.getItem('kwenchr_gdpr_consent'))
    expect(saved).toBeDefined()
    expect(saved.status).toBe('accepted')
    expect(saved.necessary).toBe(true)
    expect(saved.location).toBe(true)
    expect(saved.analytics).toBe(true)

    expect(screen.queryByRole('region', { name: /cookie and privacy consent banner/i })).not.toBeInTheDocument()
  })

  it('stores rejected consent and hides banner when clicking Reject Non-Essential', () => {
    render(<GdprFooter />)

    const rejectBtn = screen.getByRole('button', { name: /reject non-essential/i })
    fireEvent.click(rejectBtn)

    const saved = JSON.parse(localStorage.getItem('kwenchr_gdpr_consent'))
    expect(saved).toBeDefined()
    expect(saved.status).toBe('rejected')
    expect(saved.necessary).toBe(true)
    expect(saved.location).toBe(false)
    expect(saved.analytics).toBe(false)

    expect(screen.queryByRole('region', { name: /cookie and privacy consent banner/i })).not.toBeInTheDocument()
  })

  it('allows customizing granular preferences and saving them', () => {
    render(<GdprFooter />)

    // Click Customize
    const customizeBtn = screen.getByRole('button', { name: /customize/i })
    fireEvent.click(customizeBtn)

    expect(screen.getByRole('dialog', { name: /cookie preferences/i })).toBeInTheDocument()
    expect(screen.getByText(/Strictly Necessary/i)).toBeInTheDocument()
    expect(screen.getByText(/Always Active/i)).toBeInTheDocument()

    // Toggle location off
    const locationCheckbox = screen.getByLabelText(/location & discovery caching/i)
    expect(locationCheckbox.checked).toBe(true)
    fireEvent.click(locationCheckbox)
    expect(locationCheckbox.checked).toBe(false)

    // Save preferences
    const saveBtn = screen.getByRole('button', { name: /save preferences/i })
    fireEvent.click(saveBtn)

    const saved = JSON.parse(localStorage.getItem('kwenchr_gdpr_consent'))
    expect(saved.status).toBe('custom')
    expect(saved.location).toBe(false)
    expect(saved.necessary).toBe(true)

    expect(screen.queryByRole('region', { name: /cookie and privacy consent banner/i })).not.toBeInTheDocument()
  })

  it('re-opens preferences drawer when custom window event is fired even if consent was previously given', () => {
    localStorage.setItem(
      'kwenchr_gdpr_consent',
      JSON.stringify({ status: 'accepted', necessary: true, location: true, analytics: true })
    )

    render(<GdprFooter />)
    expect(screen.queryByRole('region', { name: /cookie and privacy consent banner/i })).not.toBeInTheDocument()

    // Dispatch custom event
    fireEvent(window, new CustomEvent('kwenchr:open-cookie-preferences'))

    expect(screen.getByRole('dialog', { name: /cookie preferences/i })).toBeInTheDocument()
  })
})
