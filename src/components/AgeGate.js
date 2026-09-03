'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const AGE_STORAGE_KEY = 'kwenchr_age_verified'

export function isAgeVerified() {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(AGE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function resetAgeVerification() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(AGE_STORAGE_KEY)
    document.cookie = `${AGE_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    window.dispatchEvent(new CustomEvent('kwenchr:age-verification-changed'))
  } catch {
    // Storage access error
  }
}

export default function AgeGate() {
  const router = useRouter()
  const pathname = usePathname()

  const [mounted, setMounted] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [ageInput, setAgeInput] = useState('')
  const [validationError, setValidationError] = useState('')
  const [remember, setRemember] = useState(true)

  useEffect(() => {
    setMounted(true)
    const verified = isAgeVerified()
    setIsVerified(verified)

    const handleStorageChange = () => {
      setIsVerified(isAgeVerified())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('kwenchr:age-verification-changed', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('kwenchr:age-verification-changed', handleStorageChange)
    }
  }, [])

  // Don't show age gate on error pages or if unmounted or already verified
  const isErrorRoute = pathname === '/error' || pathname === '/age-error'
  if (!mounted || isVerified || isErrorRoute) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmed = ageInput.trim()
    if (!trimmed) {
      setValidationError('Please enter your age to continue.')
      return
    }

    const parsedAge = parseInt(trimmed, 10)
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 125) {
      setValidationError('Please enter a valid age between 1 and 120.')
      return
    }

    if (parsedAge < 21) {
      setValidationError('')
      router.push('/error')
      return
    }

    // User is 21 or older
    if (remember) {
      try {
        localStorage.setItem(AGE_STORAGE_KEY, 'true')
        document.cookie = `${AGE_STORAGE_KEY}=true; path=/; max-age=31536000; SameSite=Lax`
      } catch {
        // LocalStorage might be restricted
      }
    }

    setIsVerified(true)
    setValidationError('')
  }

  return (
    <div 
      className="age-gate-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="age-gate-title"
      data-testid="age-gate-modal"
    >
      <div className="age-gate-card">
        <div className="age-gate-header">
          <div className="age-gate-badge">
            <span className="age-gate-badge-dot"></span>
            21+ Required
          </div>
          <div className="age-gate-logo">
            <span className="icon icon-kwenchr"></span>
          </div>
          <h2 id="age-gate-title" className="age-gate-title">Welcome to kwenchr</h2>
          <p className="age-gate-subtitle">
            You must be at least 21 years of age to enter. kwenchr contains information about alcoholic beverages, nightlife, and venue drink specials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="age-gate-form" noValidate>
          <div className="age-gate-field">
            <label htmlFor="age-input" className="age-gate-label">
              Enter your age:
            </label>
            <div className="age-gate-input-wrapper">
              <input
                id="age-input"
                name="age"
                type="number"
                min="1"
                max="120"
                step="1"
                placeholder="e.g. 21"
                value={ageInput}
                onChange={(e) => {
                  setAgeInput(e.target.value)
                  if (validationError) setValidationError('')
                }}
                className={`age-gate-input ${validationError ? 'has-error' : ''}`}
                autoFocus
                required
              />
              <span className="age-gate-unit">years old</span>
            </div>
            {validationError && (
              <div className="age-gate-error-message" role="alert" data-testid="age-gate-error">
                {validationError}
              </div>
            )}
          </div>

          <div className="age-gate-remember">
            <label className="age-gate-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="age-gate-checkbox"
              />
              <span>Remember my verification on this device</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary age-gate-submit-btn"
            id="verify-age-submit"
          >
            Enter Site
          </button>
        </form>

        <div className="age-gate-footer">
          <p>
            By entering kwenchr, you agree to our{' '}
            <Link href="/terms" className="age-gate-link">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="age-gate-link">Privacy Policy</Link>.
            Please drink responsibly.
          </p>
        </div>
      </div>
    </div>
  )
}
