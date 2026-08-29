import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignInPage from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-dashboard">{children}</div>
}))

vi.mock('@/components/SignIn', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-signin" />
}))

describe('SignIn Page', () => {
  it('renders SignIn wrapped in MainDashboard correctly', () => {
    render(<SignInPage />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('mock-signin')).toBeInTheDocument()
  })
})
