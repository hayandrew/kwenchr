import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ToastContainer, { showToast } from './Toast'

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing initially', () => {
    const { container } = render(<ToastContainer />)
    expect(container.firstChild.childNodes).toHaveLength(0)
  })

  it('displays a toast message when showToast is called', () => {
    render(<ToastContainer />)

    act(() => {
      showToast('Successfully saved!')
    })

    expect(screen.getByText('Successfully saved!')).toBeInTheDocument()
  })

  it('automatically removes the toast after 3 seconds', () => {
    render(<ToastContainer />)

    act(() => {
      showToast('Saved!')
    })

    expect(screen.getByText('Saved!')).toBeInTheDocument()

    // Advance timer by 3.1 seconds (3100ms)
    act(() => {
      vi.advanceTimersByTime(3100)
    })

    expect(screen.queryByText('Saved!')).not.toBeInTheDocument()
  })

  it('handles multiple concurrent toasts', () => {
    render(<ToastContainer />)

    act(() => {
      showToast('Toast 1')
      showToast('Toast 2')
    })

    expect(screen.getByText('Toast 1')).toBeInTheDocument()
    expect(screen.getByText('Toast 2')).toBeInTheDocument()

    // Advance 3.1 seconds
    act(() => {
      vi.advanceTimersByTime(3100)
    })

    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument()
  })
})
