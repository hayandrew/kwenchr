import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Legal from './Legal'
import { useRouter } from 'next/navigation'

describe('Legal Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    router = useRouter()
  })

  it('renders Terms of Service by default', () => {
    render(<Legal initialTab="terms" />)

    expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument()
    expect(screen.getByText(/21\+ Nightlife & Drink Discovery/i)).toBeInTheDocument()
    expect(screen.getByText(/Notice Regarding Alcohol & Responsible Drinking:/i)).toBeInTheDocument()
  })

  it('renders Privacy Policy when initialTab is privacy', () => {
    render(<Legal initialTab="privacy" />)

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText(/Privacy & Data Governance/i)).toBeInTheDocument()
    expect(screen.getByText(/Our Commitment to Privacy:/i)).toBeInTheDocument()
  })

  it('renders Cookie Policy when initialTab is cookies', () => {
    render(<Legal initialTab="cookies" />)

    expect(screen.getByRole('heading', { name: 'Cookie Policy' })).toBeInTheDocument()
    expect(screen.getByText(/Cookies & Local Storage/i)).toBeInTheDocument()
    expect(screen.getByText(/Transparent Storage Practices:/i)).toBeInTheDocument()
  })

  it('switches tabs when clicking on tab buttons', () => {
    render(<Legal initialTab="terms" />)

    // Initial state
    expect(screen.getByRole('tab', { name: /terms of service/i })).toHaveAttribute('aria-selected', 'true')

    // Click Privacy Policy tab
    const privacyTab = screen.getByRole('tab', { name: /privacy policy/i })
    fireEvent.click(privacyTab)

    expect(screen.getByRole('tab', { name: /privacy policy/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/Our Commitment to Privacy:/i)).toBeInTheDocument()

    // Click Cookie Policy tab
    const cookiesTab = screen.getByRole('tab', { name: /cookie policy/i })
    fireEvent.click(cookiesTab)

    expect(screen.getByRole('tab', { name: /cookie policy/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/Transparent Storage Practices:/i)).toBeInTheDocument()
  })

  it('navigates on Done button click', () => {
    render(<Legal initialTab="terms" />)

    const doneButton = screen.getByRole('button', { name: 'Done' })
    fireEvent.click(doneButton)

    // If history <= 1, router.push('/') is invoked
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('triggers print on Print button click', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<Legal initialTab="terms" />)

    const printButton = screen.getByRole('button', { name: /print/i })
    fireEvent.click(printButton)

    expect(printSpy).toHaveBeenCalled()
    printSpy.mockRestore()
  })
})
