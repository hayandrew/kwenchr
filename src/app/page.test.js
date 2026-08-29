import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

vi.mock('@/components/MainDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-dashboard" />
}))

describe('Home Page', () => {
  it('renders MainDashboard correctly', () => {
    render(<Home />)
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument()
  })
})
