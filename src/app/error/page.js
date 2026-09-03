'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetAgeVerification } from '@/components/AgeGate'
import './Error.css'

export default function ErrorPage() {
  const router = useRouter()

  const handleReverify = () => {
    resetAgeVerification()
    router.push('/')
  }

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://www.responsibility.org/'
    }
  }

  return (
    <div className="age-error-page" data-testid="age-error-page">
      <div className="age-error-card">
        <div className="age-error-badge">
          <span className="age-error-badge-icon">✕</span>
          Access Restricted • 21+ Only
        </div>

        <div className="age-error-icon-wrapper">
          <div className="age-error-icon-glow"></div>
          <div className="age-error-icon">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
        </div>

        <h1 className="age-error-title">Age Requirement Not Met</h1>
        <p className="age-error-lead">
          You must be 21 years of age or older to enter kwenchr.
        </p>

        <div className="age-error-callout">
          <p>
            kwenchr is a nightlife, happy hour, and drink discovery platform intended exclusively for responsible adults of legal drinking age. In accordance with alcoholic beverage laws and our platform policy, access cannot be granted to underage visitors.
          </p>
        </div>

        <div className="age-error-actions">
          <button 
            type="button" 
            onClick={handleReverify}
            className="btn btn-secondary age-error-btn"
            id="reverify-age-btn"
          >
            Entered Age by Mistake? Re-enter
          </button>
          <button 
            type="button" 
            onClick={handleExit}
            className="btn btn-primary age-error-btn"
            id="exit-site-btn"
          >
            Exit Site
          </button>
        </div>

        <div className="age-error-links">
          <span>Read our </span>
          <Link href="/terms" className="age-error-link">Terms of Service</Link>
          <span> • </span>
          <Link href="/privacy" className="age-error-link">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
