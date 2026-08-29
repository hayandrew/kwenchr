import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EditEventPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/EventEdit', () => ({
  __esModule: true,
  default: ({ mgid }) => <div data-testid="mock-event-edit">mgid: {mgid}</div>
}))

describe('EditEvent Dynamic Route Page', () => {
  it('resolves mgid param promise and renders EventEdit correctly', async () => {
    const mockParams = Promise.resolve({ mgid: 'edit-123' })
    const renderedPageNode = await EditEventPage({ params: mockParams })
    render(renderedPageNode)

    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-event-edit')).toBeInTheDocument()
    expect(screen.getByText('mgid: edit-123')).toBeInTheDocument()
  })
})
