import { sendGAEvent } from '@next/third-parties/google'

const CONSENT_KEY = 'kwenchr_gdpr_consent'

/**
 * Checks if user has granted analytics consent in kwenchr_gdpr_consent
 * @returns {boolean}
 */
export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed && parsed.analytics === true)
  } catch {
    return false
  }
}

/**
 * Updates Google Consent Mode v2 state based on whether analytics is granted
 * @param {boolean} granted
 */
export function updateConsentMode(granted) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }

  const consentStatus = granted ? 'granted' : 'denied'

  gtag('consent', 'update', {
    analytics_storage: consentStatus,
    ad_storage: consentStatus,
    ad_user_data: consentStatus,
    ad_personalization: consentStatus,
  })

  // If consent was revoked, clear any tracking cookies that might have been set
  if (!granted && typeof document !== 'undefined') {
    try {
      const hostname = window.location.hostname
      const domainParts = hostname.split('.')
      const domainVariants = [
        '',
        `; domain=${hostname}`,
        domainParts.length > 1 ? `; domain=.${domainParts.slice(-2).join('.')}` : '',
      ]

      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim()
        if (name.startsWith('_ga') || name.startsWith('_gid')) {
          domainVariants.forEach((domain) => {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domain}`
          })
        }
      })
    } catch {
      // Ignore cookie clearance failure in restricted contexts
    }
  }
}

/**
 * Track custom user interaction in GA4, respecting user GDPR consent
 * @param {string} action
 * @param {Record<string, any>} [params]
 */
export function trackEvent(action, params = {}) {
  if (typeof window === 'undefined') return

  if (!hasAnalyticsConsent()) {
    return
  }

  try {
    sendGAEvent('event', action, params)
  } catch {
    // Fallback if window.dataLayer exists
    if (window.dataLayer) {
      window.dataLayer.push(['event', action, params])
    }
  }
}
