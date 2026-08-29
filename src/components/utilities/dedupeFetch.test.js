import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Disable global mock of dedupeFetch for this test suite
vi.unmock('@/components/utilities/dedupeFetch')

// Now import the real dedupeFetch
import dedupeFetch from './dedupeFetch'

describe('dedupeFetch utility', () => {
  let mockFetch

  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch = vi.fn().mockImplementation((url, options) => {
      const response = {
        ok: true,
        json: () => Promise.resolve({ data: 'mockData' }),
        clone: () => response
      }
      return Promise.resolve(response)
    })
    global.fetch = mockFetch
  })

  afterEach(() => {
    // Force scheduled cache delete setTimeout callbacks to execute
    vi.advanceTimersByTime(250)
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('performs a standard fetch on the first call', async () => {
    const res = await dedupeFetch('/api/events')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith('/api/events', {})
    const data = await res.json()
    expect(data).toEqual({ data: 'mockData' })
  })

  it('deduplicates simultaneous GET requests to the same URL', async () => {
    const promise1 = dedupeFetch('/api/events')
    const promise2 = dedupeFetch('/api/events')

    const [res1, res2] = await Promise.all([promise1, promise2])

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(res1).toBeDefined()
    expect(res2).toBeDefined()
  })

  it('does not deduplicate GET requests after 200ms', async () => {
    await dedupeFetch('/api/events')
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Fast-forward 250ms
    vi.advanceTimersByTime(250)

    await dedupeFetch('/api/events')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('does not deduplicate non-GET requests', async () => {
    const options = { method: 'POST', body: JSON.stringify({ name: 'test' }) }
    const promise1 = dedupeFetch('/api/events', options)
    const promise2 = dedupeFetch('/api/events', options)

    await Promise.all([promise1, promise2])

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('deletes active requests and throws error on request failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(dedupeFetch('/api/events')).rejects.toThrow('Network error')

    // Since it failed and got cleared, next request should trigger fetch again
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
      clone: function() { return this; }
    })

    const res = await dedupeFetch('/api/events')
    expect(mockFetch).toHaveBeenCalledTimes(2)
    const data = await res.json()
    expect(data.success).toBe(true)
  })
})
