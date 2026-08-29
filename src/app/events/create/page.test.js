import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CreateEventPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/EventEdit', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-event-edit" />
}))

describe('CreateEvent Page', () => {
  it('renders EventEdit wrapped in MainDashboard correctly', () => {
    render(<CreateEventPage />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-event-edit')).toBeInTheDocument()
  })
})
