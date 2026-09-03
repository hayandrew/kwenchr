import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from './page'
import * as navigation from 'next/navigation'
import * as ageGateModule from '@/components/AgeGate'

describe('Error Page Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(navigation, 'useRouter').mockReturnValue({
      push: mockPush,
    })
  })

  it('renders the 21+ age requirement error message', () => {
    render(<ErrorPage />)

    expect(screen.getByTestId('age-error-page')).toBeInTheDocument()
    expect(screen.getByText(/age requirement not met/i)).toBeInTheDocument()
    expect(screen.getByText(/you must be 21 years of age or older to enter kwenchr/i)).toBeInTheDocument()
    expect(screen.getByText(/access restricted • 21\+ only/i)).toBeInTheDocument()
  })

  it('triggers reverification and redirects to home on re-enter click', () => {
    const resetSpy = vi.spyOn(ageGateModule, 'resetAgeVerification')
    render(<ErrorPage />)

    const reEnterBtn = screen.getByRole('button', { name: /re-enter/i })
    fireEvent.click(reEnterBtn)

    expect(resetSpy).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('provides an exit button directing outside the site', () => {
    delete window.location
    window.location = { href: '' }

    render(<ErrorPage />)

    const exitBtn = screen.getByRole('button', { name: /exit site/i })
    fireEvent.click(exitBtn)

    expect(window.location.href).toContain('responsibility.org')
  })

  it('contains links to Terms of Service and Privacy Policy', () => {
    render(<ErrorPage />)

    const termsLink = screen.getByRole('link', { name: /terms of service/i })
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })

    expect(termsLink).toHaveAttribute('href', '/terms')
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })
})
