'use client'
import React from 'react'
import Link from 'next/link'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="columns">
      <div className="footer-inner footer-container">
        <span className="footer-copyright">
          &copy; {currentYear} kwenchr, inc. All rights reserved.
        </span>
        <nav className="footer-links" aria-label="Legal links">
          <Link href="/terms" className="footer-link">
            Terms of Service
          </Link>
          <span className="footer-divider" aria-hidden="true">&bull;</span>
          <Link href="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <span className="footer-divider" aria-hidden="true">&bull;</span>
          <Link href="/cookies" className="footer-link">
            Cookie Policy
          </Link>
          <span className="footer-divider" aria-hidden="true">&bull;</span>
          <Link href="/gdpr" className="footer-link">
            GDPR
          </Link>
          <span className="footer-divider" aria-hidden="true">&bull;</span>
          <button
            type="button"
            className="footer-link footer-button-link"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('kwenchr:open-cookie-preferences'))
              }
            }}
            aria-label="Manage Cookie Preferences"
          >
            Cookie Preferences
          </button>
        </nav>
      </div>
    </footer>
  )
}
