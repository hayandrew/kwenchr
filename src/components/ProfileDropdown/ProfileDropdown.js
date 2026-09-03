'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/Toast'
import './ProfileDropdown.css'

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
      className={`dropdown profile-dropdown ${active ? 'dropdown--active' : ''}`}
      ref={dropdownRef}
    >
      <button 
        className="dropdown__trigger"
        onClick={toggleDropdown}
      >
        <span className="profile-image"></span>
        <span className="profile-username">
          {user ? user.username : 'Account'}
        </span>
        <i className="icon icon-chevron-down profile-chevron"></i>
      </button>

      {active && (
        <div className="dropdown__content">
          <ul className="profile-dropdown-list">
            {user ? (
              <>
                <li className="profile-dropdown-item">
                  <Link 
                    href="/my-events" 
                    onClick={() => setActive(false)}
                    className="dropdown-item dropdown-item-link"
                  >
                    My Events
                  </Link>
                </li>
                <li className="profile-dropdown-item">
                  <Link 
                    href="/events/create" 
                    onClick={() => setActive(false)}
                    className="dropdown-item dropdown-item-link"
                  >
                    Create Event
                  </Link>
                </li>
                <li className="profile-dropdown-item">
                  <Link 
                    href={`/profile/edit/${user._id || user.id}`} 
                    onClick={() => setActive(false)}
                    className="dropdown-item dropdown-item-link"
                  >
                    Edit Profile
                  </Link>
                </li>
                <li className="profile-dropdown-item">
                  <a 
                    href="#logout" 
                    onClick={handleLogOut}
                    className="dropdown-item dropdown-item-link dropdown-item-link--logout"
                  >
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="profile-dropdown-item">
                  <Link 
                    href="/sign-in" 
                    onClick={() => setActive(false)}
                    className="dropdown-item dropdown-item-link"
                  >
                    Sign In
                  </Link>
                </li>
                <li className="profile-dropdown-item">
                  <Link 
                    href="/create-account" 
                    onClick={() => setActive(false)}
                    className="dropdown-item dropdown-item-link"
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
