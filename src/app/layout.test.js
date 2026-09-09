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

vi.mock('@/components/GdprFooter', () => ({
  default: () => <div data-testid="mock-gdpr-footer" />
}))

vi.mock('@/components/AgeGate', () => ({
  default: () => <div data-testid="mock-age-gate" />
}))

vi.mock('@/components/Toast', () => ({
  default: () => <div data-testid="mock-toast-container" />
}))

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }) => <div data-testid="mock-google-analytics" data-gaid={gaId} />,
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
    expect(screen.getByTestId('mock-age-gate')).toBeInTheDocument()
    expect(screen.getByTestId('mock-gdpr-footer')).toBeInTheDocument()
    expect(screen.getByTestId('mock-toast-container')).toBeInTheDocument()
    expect(screen.getByTestId('mock-children')).toBeInTheDocument()
    expect(screen.getByText('Content Child')).toBeInTheDocument()

    // Check Google maps script
    const script = screen.getByTestId('mock-google-script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('src', expect.stringContaining('maps.googleapis.com'))
  })

  it('renders GoogleAnalytics component when NEXT_PUBLIC_GA_ID is set', () => {
    const originalGaId = process.env.NEXT_PUBLIC_GA_ID
    process.env.NEXT_PUBLIC_GA_ID = 'G-6HFP6J1VPW'

    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    )

    const ga = screen.getByTestId('mock-google-analytics')
    expect(ga).toBeInTheDocument()
    expect(ga).toHaveAttribute('data-gaid', 'G-6HFP6J1VPW')

    process.env.NEXT_PUBLIC_GA_ID = originalGaId
  })
})
