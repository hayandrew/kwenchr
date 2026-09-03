'use client'
import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import './GdprFooter.css'

const CONSENT_KEY = 'kwenchr_gdpr_consent'

function getStoredConsent() {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(CONSENT_KEY)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

function subscribeToConsent(callback) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener('kwenchr:gdpr-consent-changed', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('kwenchr:gdpr-consent-changed', callback)
  }
}

export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kwenchr:open-cookie-preferences'))
  }
}

export default function GdprFooter() {
  const consentData = useSyncExternalStore(
    subscribeToConsent,
    () => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(CONSENT_KEY)
    },
    () => null
  )

  const [manualOpen, setManualOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    location: true,
    analytics: false,
  })

  // Listen for the custom event to open preferences from footer or legal pages
  useEffect(() => {
    const handleOpen = () => {
      setManualOpen(true)
      setShowPreferences(true)
      const current = getStoredConsent()
      if (current) {
        setPreferences({
          necessary: true,
          location: current.location ?? true,
          analytics: current.analytics ?? false,
        })
      }
    }

    window.addEventListener('kwenchr:open-cookie-preferences', handleOpen)
    return () => {
      window.removeEventListener('kwenchr:open-cookie-preferences', handleOpen)
    }
  }, [])

  const saveConsent = (status, customPrefs) => {
    const payload = {
      status,
      necessary: true,
      location: customPrefs?.location ?? (status === 'accepted'),
      analytics: customPrefs?.analytics ?? (status === 'accepted'),
      timestamp: new Date().toISOString(),
    }

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(payload))
      window.dispatchEvent(new CustomEvent('kwenchr:gdpr-consent-changed'))
    } catch {
      // Storage unavailable
    }

    setManualOpen(false)
    setShowPreferences(false)
  }

  const handleAcceptAll = () => {
    saveConsent('accepted', { location: true, analytics: true })
  }

  const handleRejectNonEssential = () => {
    saveConsent('rejected', { location: false, analytics: false })
  }

  const handleSaveCustom = () => {
    saveConsent('custom', preferences)
  }

  const handleClose = () => {
    setManualOpen(false)
    setShowPreferences(false)
  }

  // Determine if banner should be displayed
  const isVisible = manualOpen || (!consentData && consentData !== undefined)

  if (!isVisible) {
    return null
  }

  return (
    <aside
      className="gdpr-footer-banner"
      role="region"
      aria-label="Cookie and Privacy Consent Banner"
      aria-live="polite"
    >
      <div className="gdpr-footer-content">
        {!showPreferences ? (
          /* STANDARD CONSENT BANNER */
          <div className="gdpr-main-bar">
            <div className="gdpr-text-content">
              <div className="gdpr-badge">
                <i className="icon icon-shield" aria-hidden="true"></i>
                <span>Privacy &amp; Cookie Consent</span>
              </div>
              <p className="gdpr-message">
                kwenchr uses cookies and local device data (such as temporary geolocation) to help you discover nearby happy hours, drink specials, and nightlife events in accordance with GDPR. Choose your preference or customize your data rights below.
              </p>
              <div className="gdpr-policy-links">
                <Link href="/privacy" className="gdpr-inline-link">
                  Privacy Policy
                </Link>
                <span className="gdpr-divider" aria-hidden="true">&bull;</span>
                <Link href="/cookies" className="gdpr-inline-link">
                  Cookie Policy
                </Link>
                <span className="gdpr-divider" aria-hidden="true">&bull;</span>
                <Link href="/gdpr" className="gdpr-inline-link">
                  GDPR Rights
                </Link>
              </div>
            </div>

            <div className="gdpr-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm gdpr-btn-pref"
                onClick={() => setShowPreferences(true)}
              >
                <i className="icon icon-sliders" aria-hidden="true"></i> Customize
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm gdpr-btn-reject"
                onClick={handleRejectNonEssential}
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm gdpr-btn-accept"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
              {manualOpen && (
                <button
                  type="button"
                  className="gdpr-btn-close"
                  onClick={handleClose}
                  aria-label="Close consent banner"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ) : (
          /* GRANULAR PREFERENCES DRAWER */
          <div className="gdpr-preferences-panel" role="dialog" aria-label="Cookie Preferences">
            <div className="gdpr-pref-header">
              <div>
                <h3 className="gdpr-pref-title">GDPR &amp; Cookie Preferences</h3>
                <p className="gdpr-pref-subtitle">
                  Configure how kwenchr uses storage and cookies to power your nightlife search experience.
                </p>
              </div>
              <button
                type="button"
                className="gdpr-btn-close"
                onClick={() => {
                  if (consentData) {
                    handleClose()
                  } else {
                    setShowPreferences(false)
                  }
                }}
                aria-label="Close preferences"
              >
                &times;
              </button>
            </div>

            <div className="gdpr-categories">
              {/* Strictly Necessary */}
              <div className="gdpr-category-card">
                <div className="gdpr-category-info">
                  <div className="gdpr-category-title-row">
                    <strong>Strictly Necessary</strong>
                    <span className="gdpr-always-active-badge">Always Active</span>
                  </div>
                  <p>
                    Essential for account authentication (<code>kwenchr_user</code>), session routing, and security. Cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Location & Discovery */}
              <div className="gdpr-category-card">
                <div className="gdpr-category-info">
                  <div className="gdpr-category-title-row">
                    <strong>Location &amp; Discovery Caching</strong>
                    <label className="gdpr-switch" htmlFor="gdpr-toggle-location">
                      <input
                        id="gdpr-toggle-location"
                        type="checkbox"
                        aria-label="Location & Discovery Caching"
                        checked={preferences.location}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, location: e.target.checked }))
                        }
                      />
                      <span className="gdpr-slider round"></span>
                    </label>
                  </div>
                  <p>
                    Caches GPS coordinates and search locations (<code>kwenchr_coords</code>, <code>kwenchr_loc</code>) for 5 minutes so you do not have to repeatedly share location while discovering bars.
                  </p>
                </div>
              </div>

              {/* Analytics & Performance */}
              <div className="gdpr-category-card">
                <div className="gdpr-category-info">
                  <div className="gdpr-category-title-row">
                    <strong>Performance &amp; Analytics</strong>
                    <label className="gdpr-switch" htmlFor="gdpr-toggle-analytics">
                      <input
                        id="gdpr-toggle-analytics"
                        type="checkbox"
                        aria-label="Performance & Analytics"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                        }
                      />
                      <span className="gdpr-slider round"></span>
                    </label>
                  </div>
                  <p>
                    Collects anonymous telemetry and performance metrics to help us optimize map rendering and drink special query speeds.
                  </p>
                </div>
              </div>
            </div>

            <div className="gdpr-pref-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (consentData) {
                    handleClose()
                  } else {
                    setShowPreferences(false)
                  }
                }}
              >
                Back
              </button>
              <div className="gdpr-pref-actions-right">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleRejectNonEssential}
                >
                  Reject All Optional
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveCustom}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
