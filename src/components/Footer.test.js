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
  })
})
