import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgeGate, { isAgeVerified, resetAgeVerification } from './AgeGate'
import * as navigation from 'next/navigation'

describe('AgeGate Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.spyOn(navigation, 'useRouter').mockReturnValue({
      push: mockPush,
    })
    vi.spyOn(navigation, 'usePathname').mockReturnValue('/')
  })

  it('renders the age gate modal when not verified', () => {
    render(<AgeGate />)

    expect(screen.getByTestId('age-gate-modal')).toBeInTheDocument()
    expect(screen.getByText('Welcome to kwenchr')).toBeInTheDocument()
    expect(screen.getByLabelText(/enter your age/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter site/i })).toBeInTheDocument()
  })

  it('does not render if already verified in localStorage', () => {
    localStorage.setItem('kwenchr_age_verified', 'true')
    render(<AgeGate />)

    expect(screen.queryByTestId('age-gate-modal')).not.toBeInTheDocument()
  })

  it('does not render on /error or /age-error route', () => {
    vi.spyOn(navigation, 'usePathname').mockReturnValue('/error')
    const { rerender } = render(<AgeGate />)
    expect(screen.queryByTestId('age-gate-modal')).not.toBeInTheDocument()

    vi.spyOn(navigation, 'usePathname').mockReturnValue('/age-error')
    rerender(<AgeGate />)
    expect(screen.queryByTestId('age-gate-modal')).not.toBeInTheDocument()
  })

  it('displays a validation error when submitted without entering an age', () => {
    render(<AgeGate />)

    const submitBtn = screen.getByRole('button', { name: /enter site/i })
    fireEvent.click(submitBtn)

    expect(screen.getByTestId('age-gate-error')).toHaveTextContent(/please enter your age to continue/i)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('displays a validation error when age is outside 1-120 range', () => {
    render(<AgeGate />)

    const input = screen.getByLabelText(/enter your age/i)
    const submitBtn = screen.getByRole('button', { name: /enter site/i })

    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.click(submitBtn)
    expect(screen.getByTestId('age-gate-error')).toHaveTextContent(/valid age between 1 and 120/i)

    fireEvent.change(input, { target: { value: '150' } })
    fireEvent.click(submitBtn)
    expect(screen.getByTestId('age-gate-error')).toHaveTextContent(/valid age between 1 and 120/i)
  })

  it('routes to /error when the entered age is less than 21', () => {
    render(<AgeGate />)

    const input = screen.getByLabelText(/enter your age/i)
    const submitBtn = screen.getByRole('button', { name: /enter site/i })

    fireEvent.change(input, { target: { value: '20' } })
    fireEvent.click(submitBtn)

    expect(mockPush).toHaveBeenCalledWith('/error')
    expect(localStorage.getItem('kwenchr_age_verified')).toBeNull()
  })

  it('routes to /error when another underage value like 18 is entered', () => {
    render(<AgeGate />)

    const input = screen.getByLabelText(/enter your age/i)
    const submitBtn = screen.getByRole('button', { name: /enter site/i })

    fireEvent.change(input, { target: { value: '18' } })
    fireEvent.click(submitBtn)

    expect(mockPush).toHaveBeenCalledWith('/error')
    expect(localStorage.getItem('kwenchr_age_verified')).toBeNull()
  })

  it('grants entry and persists verification in localStorage when age is 21 or older', () => {
    render(<AgeGate />)

    const input = screen.getByLabelText(/enter your age/i)
    const submitBtn = screen.getByRole('button', { name: /enter site/i })

    fireEvent.change(input, { target: { value: '21' } })
    fireEvent.click(submitBtn)

    expect(mockPush).not.toHaveBeenCalled()
    expect(localStorage.getItem('kwenchr_age_verified')).toBe('true')
    expect(screen.queryByTestId('age-gate-modal')).not.toBeInTheDocument()
  })

  it('grants entry without persisting to localStorage if remember is unchecked', () => {
    render(<AgeGate />)

    const checkbox = screen.getByLabelText(/remember my verification/i)
    fireEvent.click(checkbox) // uncheck

    const input = screen.getByLabelText(/enter your age/i)
    const submitBtn = screen.getByRole('button', { name: /enter site/i })

    fireEvent.change(input, { target: { value: '25' } })
    fireEvent.click(submitBtn)

    expect(mockPush).not.toHaveBeenCalled()
    expect(localStorage.getItem('kwenchr_age_verified')).toBeNull()
    expect(screen.queryByTestId('age-gate-modal')).not.toBeInTheDocument()
  })

  it('correctly reports verification status and resets via helpers', () => {
    expect(isAgeVerified()).toBe(false)

    localStorage.setItem('kwenchr_age_verified', 'true')
    expect(isAgeVerified()).toBe('true' ? true : false)

    resetAgeVerification()
    expect(localStorage.getItem('kwenchr_age_verified')).toBeNull()
  })
})
