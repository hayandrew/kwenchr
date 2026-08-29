import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyEventsPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/MyEvents', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-my-events" />
}))

describe('MyEvents Page', () => {
  it('renders MyEvents wrapped in MainDashboard correctly', () => {
    render(<MyEventsPage />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-my-events')).toBeInTheDocument()
  })
})
