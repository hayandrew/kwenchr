import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hasAnalyticsConsent, updateConsentMode, trackEvent } from './analytics'

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn(),
}))

import { sendGAEvent } from '@next/third-parties/google'

describe('Analytics & Consent Utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    window.dataLayer = []
    vi.clearAllMocks()
    document.cookie = ''
  })

  it('hasAnalyticsConsent returns false when no consent or analytics is false', () => {
    expect(hasAnalyticsConsent()).toBe(false)

    localStorage.setItem(
      'kwenchr_gdpr_consent',
      JSON.stringify({ analytics: false })
    )
    expect(hasAnalyticsConsent()).toBe(false)
  })

  it('hasAnalyticsConsent returns true when analytics is granted', () => {
    localStorage.setItem(
      'kwenchr_gdpr_consent',
      JSON.stringify({ analytics: true })
    )
    expect(hasAnalyticsConsent()).toBe(true)
  })

  it('updateConsentMode updates dataLayer with granted status', () => {
    updateConsentMode(true)

    expect(window.dataLayer.length).toBeGreaterThan(0)
    const updateCall = window.dataLayer.find(
      (item) => item[0] === 'consent' && item[1] === 'update'
    )
    expect(updateCall).toBeDefined()
    expect(updateCall[2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  })

  it('updateConsentMode updates dataLayer with denied status and cleans cookies when revoked', () => {
    document.cookie = '_ga=GA1.2.12345; path=/'
    updateConsentMode(false)

    const updateCall = window.dataLayer.find(
      (item) => item[0] === 'consent' && item[1] === 'update'
    )
    expect(updateCall).toBeDefined()
    expect(updateCall[2].analytics_storage).toBe('denied')
  })

  it('trackEvent does not send event when analytics consent is false', () => {
    trackEvent('test_action', { foo: 'bar' })
    expect(sendGAEvent).not.toHaveBeenCalled()
  })

  it('trackEvent calls sendGAEvent when analytics consent is true', () => {
    localStorage.setItem(
      'kwenchr_gdpr_consent',
      JSON.stringify({ analytics: true })
    )
    trackEvent('test_action', { foo: 'bar' })
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'test_action', { foo: 'bar' })
  })
})
