import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfileEditPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/ProfileEdit', () => ({
  __esModule: true,
  default: ({ mgid }) => <div data-testid="mock-profile-edit">mgid: {mgid}</div>
}))

describe('ProfileEdit Dynamic Route Page', () => {
  it('resolves mgid param promise and renders ProfileEdit correctly', async () => {
    const mockParams = Promise.resolve({ mgid: 'profile-123' })
    const renderedPageNode = await ProfileEditPage({ params: mockParams })
    render(renderedPageNode)

    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-profile-edit')).toBeInTheDocument()
    expect(screen.getByText('mgid: profile-123')).toBeInTheDocument()
  })
})
