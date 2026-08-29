import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RootLayout, { metadata } from './layout'

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Outfit: () => ({
    variable: 'mocked-font-variable'
  })
}))

// Mock next/script
vi.mock('next/script', () => ({
  __esModule: true,
  default: ({ src }) => <script data-testid="mock-google-script" src={src} />
}))

// Mock main layout subcomponents
vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="mock-header" />
}))

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="mock-footer" />
}))

vi.mock('@/components/Toast', () => ({
  default: () => <div data-testid="mock-toast-container" />
}))

describe('RootLayout Component', () => {
  it('has correct static metadata configuration', () => {
    expect(metadata.title).toContain('kwenchr')
    expect(metadata.description).toContain('drink specials')
  })

  it('renders layout elements (HTML wrappers, Header, Footer, and children)', () => {
    render(
      <RootLayout>
        <div data-testid="mock-children">Content Child</div>
      </RootLayout>
    )

    // Check children, header, footer, toast container render
    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
    expect(screen.getByTestId('mock-toast-container')).toBeInTheDocument()
    expect(screen.getByTestId('mock-children')).toBeInTheDocument()
    expect(screen.getByText('Content Child')).toBeInTheDocument()

    // Check Google maps script
    const script = screen.getByTestId('mock-google-script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('src', expect.stringContaining('maps.googleapis.com'))
  })
})
