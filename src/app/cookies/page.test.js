import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CookiesPage, { metadata } from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>,
}))

vi.mock('@/components/Legal', () => ({
  __esModule: true,
  default: ({ initialTab }) => <div data-testid="mock-legal" data-tab={initialTab} />,
}))

describe('Cookies Page', () => {
  it('renders Legal wrapped in MainDashboard with cookies tab', () => {
    render(<CookiesPage />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    const legalEl = screen.getByTestId('mock-legal')
    expect(legalEl).toBeInTheDocument()
    expect(legalEl).toHaveAttribute('data-tab', 'cookies')
  })

  it('exports valid metadata', () => {
    expect(metadata.title).toContain('Cookie Policy')
    expect(metadata.description).toBeDefined()
  })
})
