import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CreateAccountPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/SignUp', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-signup" />
}))

describe('CreateAccount Page', () => {
  it('renders SignUp wrapped in MainDashboard correctly', () => {
    render(<CreateAccountPage />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-signup')).toBeInTheDocument()
  })
})
