import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Overlay from './Overlay'
import { useRouter } from 'next/navigation'

describe('Overlay Component', () => {
  let router

  beforeEach(() => {
    vi.clearAllMocks()
    router = useRouter()
  })

  it('renders title, children, and footer buttons correctly', () => {
    const buttons = <button>Submit</button>
    render(
      <Overlay title="Test Modal" buttons={buttons}>
        <p>Modal content child</p>
      </Overlay>
    )

    expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument()
    expect(screen.getByText('Modal content child')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('navigates back on close if window history has items', () => {
    // Set window.history.length > 1
    Object.defineProperty(window.history, 'length', {
      value: 5,
      configurable: true,
    })

    render(
      <Overlay title="Test Modal">
        <div>Content</div>
      </Overlay>
    )

    const closeButton = screen.getByRole('button', { name: '' }) // Has no text, only icon class
    fireEvent.click(closeButton)

    expect(router.back).toHaveBeenCalledTimes(1)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('navigates to homepage on close if window history is empty', () => {
    // Set window.history.length <= 1
    Object.defineProperty(window.history, 'length', {
      value: 1,
      configurable: true,
    })

    render(
      <Overlay title="Test Modal">
        <div>Content</div>
      </Overlay>
    )

    const closeButton = screen.getByRole('button', { name: '' })
    fireEvent.click(closeButton)

    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith('/')
    expect(router.back).not.toHaveBeenCalled()
  })
})
