'use client'
import React, { useState, useEffect } from "react"
import Link from "next/link"
import ProfileDropdown from "./ProfileDropdown"

export default function Header() {
  const [user, setUser] = useState(null)

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kwenchr_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch (e) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Listen to authentication status updates across components
    window.addEventListener('authChange', checkAuth)
    return () => {
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  return (
    <header className="columns">
      {/* Clickable Logo linking to Home */}
      <Link
        href="/"
        className="column logo"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="icon icon-kwenchr"></div>
      </Link>

      <div className="column tagline">
        <h1>
          Get Your Drink On<span className="trademark">&trade;</span>
        </h1>
      </div>

      <div className="column profile-info">
        {user ? (
          <ProfileDropdown />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              href="/sign-in" 
              style={{ 
                fontSize: '13px', 
                color: 'var(--text-secondary)', 
                fontWeight: '600',
                transition: 'color 0.2s'
              }}
              className="header-signin-link"
            >
              Sign In
            </Link>
            <Link 
              href="/create-account" 
              style={{ 
                fontSize: '13px', 
                color: 'white', 
                fontWeight: '600', 
                background: 'linear-gradient(135deg, var(--accent-purple), #7e22ce)',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)'
              }}
              className="header-signup-link"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
