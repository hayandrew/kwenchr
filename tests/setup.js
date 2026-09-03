import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock next/navigation
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, onClick, scroll, prefetch, ...props }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

// Mock Session Storage & Local Storage
const createStorageMock = () => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
}

const sessionStorageMock = createStorageMock()
const localStorageMock = createStorageMock()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock Geolocation
const geolocationMock = {
  getCurrentPosition: vi.fn().mockImplementation((success) =>
    success({
      coords: {
        latitude: 40.7796,
        longitude: -74.0238,
        accuracy: 10,
      },
    })
  ),
  watchPosition: vi.fn(),
}

Object.defineProperty(navigator, 'geolocation', {
  value: geolocationMock,
  configurable: true,
  writable: true,
})

// Mock Fetch
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
    clone: function() { return this; }
  })
)

// Mock dedupeFetch globally so caching doesn't pollute component tests
vi.mock('@/components/utilities/dedupeFetch', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation((url, options) => global.fetch(url, options))
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
