import { describe, it, expect } from 'vitest'
import formatTime from './formatTime'

describe('formatTime utility', () => {
  it('formats morning hours (AM) correctly', () => {
    // 9:30 AM
    const date = new Date('2026-08-28T09:30:00')
    expect(formatTime(date)).toBe('9:30 am')
  })

  it('formats afternoon/evening hours (PM) correctly', () => {
    // 8:05 PM
    const date = new Date('2026-08-28T20:05:00')
    expect(formatTime(date)).toBe('8:05 pm')
  })

  it('formats midnight correctly as 12:00 am', () => {
    const date = new Date('2026-08-28T00:00:00')
    expect(formatTime(date)).toBe('12:00 am')
  })

  it('formats noon correctly as 12:00 pm', () => {
    const date = new Date('2026-08-28T12:00:00')
    expect(formatTime(date)).toBe('12:00 pm')
  })

  it('handles timestamp values', () => {
    const timestamp = new Date('2026-08-28T15:45:00').getTime()
    expect(formatTime(timestamp)).toBe('3:45 pm')
  })
})
