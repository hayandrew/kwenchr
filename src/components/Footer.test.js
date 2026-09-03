import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer Component', () => {
  it('renders copyright with current year and links', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} kwenchr, inc\\. All rights reserved\\.`))).toBeInTheDocument()

    const termsLink = screen.getByRole('link', { name: /terms of service/i })
    expect(termsLink).toBeInTheDocument()
    expect(termsLink).toHaveAttribute('href', '/terms')

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '/privacy')

    const cookieLink = screen.getByRole('link', { name: /cookie policy/i })
    expect(cookieLink).toBeInTheDocument()
    expect(cookieLink).toHaveAttribute('href', '/cookies')

    const gdprLink = screen.getByRole('link', { name: /^gdpr$/i })
    expect(gdprLink).toBeInTheDocument()
    expect(gdprLink).toHaveAttribute('href', '/gdpr')

    const prefButton = screen.getByRole('button', { name: /cookie preferences/i })
    expect(prefButton).toBeInTheDocument()
  })

  it('dispatches kwenchr:open-cookie-preferences event when clicking Cookie Preferences', () => {
    let eventFired = false
    const handler = () => {
      eventFired = true
    }
    window.addEventListener('kwenchr:open-cookie-preferences', handler)

    render(<Footer />)
    const prefButton = screen.getByRole('button', { name: /cookie preferences/i })
    prefButton.click()

    expect(eventFired).toBe(true)
    window.removeEventListener('kwenchr:open-cookie-preferences', handler)
  })
})
