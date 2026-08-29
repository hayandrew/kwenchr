import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/EventDetail', () => ({
  __esModule: true,
  default: ({ mgid }) => <div data-testid="mock-event-detail">mgid: {mgid}</div>
}))

describe('EventDetail Dynamic Route Page', () => {
  it('resolves mgid param promise and renders EventDetail correctly', async () => {
    const mockParams = Promise.resolve({ mgid: 'event-123' })
    
    // Call the async page component directly and render returned JSX node
    const renderedPageNode = await Page({ params: mockParams })
    render(renderedPageNode)

    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-event-detail')).toBeInTheDocument()
    expect(screen.getByText('mgid: event-123')).toBeInTheDocument()
  })
})
