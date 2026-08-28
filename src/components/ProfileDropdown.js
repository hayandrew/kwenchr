'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { showToast } from './Toast'

export default function ProfileDropdown() {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setActive(!active)
  }

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
    
    // Listen for custom authentication changes (sign in / sign out / register)
    window.addEventListener('authChange', checkAuth)
    return () => {
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActive(false)
      }
    }

    if (active) {
      window.addEventListener('click', handleOutsideClick)
      window.addEventListener('touchstart', handleOutsideClick)
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [active])

  const handleLogOut = (e) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('kwenchr_user')
      window.dispatchEvent(new Event('authChange'))
    }
    setActive(false)
    showToast('Logged out successfully.')
    router.push('/')
    router.refresh()
  }

  return (
    <div 
      className={`dropdown ${active ? 'dropdown--active' : ''}`}
      ref={dropdownRef}
      style={{ position: 'relative' }}
    >
      <button 
        className="dropdown__trigger"
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          cursor: 'pointer'
        }}
      >
        <span 
          className="profile-image"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-purple)',
            backgroundImage: "url('/images/default_person.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'block'
          }}
        ></span>
        <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
          {user ? user.username : 'Account'}
        </span>
        <i className="icon icon-chevron-down" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}></i>
      </button>

      {active && (
        <div 
          className="dropdown__content"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            width: '170px',
            zIndex: 1500,
            overflow: 'hidden'
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {user ? (
              <>
                <li style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <Link 
                    href="/my-events" 
                    onClick={() => setActive(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.2s'
                    }}
                    className="dropdown-item"
                  >
                    My Events
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <Link 
                    href="/events/create" 
                    onClick={() => setActive(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.2s'
                    }}
                    className="dropdown-item"
                  >
                    Create Event
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <Link 
                    href={`/profile/edit/${user._id || user.id}`} 
                    onClick={() => setActive(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.2s'
                    }}
                    className="dropdown-item"
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <a 
                    href="#logout" 
                    onClick={handleLogOut}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--accent-purple)',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    className="dropdown-item"
                  >
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <Link 
                    href="/sign-in" 
                    onClick={() => setActive(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.2s'
                    }}
                    className="dropdown-item"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/create-account" 
                    onClick={() => setActive(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'background 0.2s'
                    }}
                    className="dropdown-item"
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
