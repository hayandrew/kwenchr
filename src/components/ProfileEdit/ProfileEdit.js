'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Overlay from '@/components/Overlay'
import dedupeFetch from '@/components/utilities/dedupeFetch'
import './ProfileEdit.css'

export default function ProfileEdit({ mgid }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kwenchr_user')
      if (stored) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await dedupeFetch(`/api/user/${mgid}`)
        if (res.ok) {
          const raw = await res.json()
          setEmail(raw.email || '')
          setUsername(raw.username || '')
        } else {
          console.error('Failed to load user profile data')
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (mgid && mgid !== 'undefined') {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [mgid])

  const handleSave = async (e) => {
    e.preventDefault()
    if (password && password !== confirmPassword) {
      alert('Error: Passwords do not match!')
      return
    }

    const payload = {
      email,
      username
    }
    if (password) {
      payload.password = password
      payload.passwordConf = password
    }

    try {
      const res = await fetch(`/api/user/${mgid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Profile successfully updated!')
        router.push('/')
        router.refresh()
      } else {
        const errData = await res.json()
        alert(`Error updating profile: ${errData.error || 'Server error'}`)
      }
    } catch (err) {
      console.error('Error updating user profile:', err)
      alert('Failed to save profile. Please check connection.')
    }
  }

  const buttons = (
    <div className="profile-edit-buttons">
      <button type="button" className="btn btn-secondary" onClick={() => router.push('/')}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  )

  if (loading) {
    return (
      <Overlay title="Loading Profile...">
        <div className="profile-edit-loading">
          <i className="icon icon-spinner fa-spin profile-edit-spinner" />
          <div>Retrieving profile details...</div>
        </div>
      </Overlay>
    )
  }

  if (authChecked && !isLoggedIn) {
    return (
      <Overlay title="Access Restricted">
        <div className="profile-edit-restricted">
          <p>
            You must be logged in to view or edit user profiles.
          </p>
          <div className="profile-edit-restricted__actions">
            <button className="btn btn-secondary" onClick={() => router.push('/')}>
              Go Back
            </button>
            <button className="btn btn-primary" onClick={() => router.push('/sign-in')}>
              Sign In
            </button>
          </div>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay title="Edit Profile" buttons={buttons}>
      <form onSubmit={handleSave} className="profile-edit-form">
        
        <div className="profile-edit-avatar-section">
          <div 
            className="profile-edit-avatar-preview"
            aria-label="User Avatar preview"
          ></div>
          <button type="button" className="btn btn-secondary btn-xs">Change Avatar</button>
        </div>

        <div className="profile-edit-fields">
          <div>
            <label className="profile-edit-label">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
              className="profile-edit-input"
            />
          </div>

          <div>
            <label className="profile-edit-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="profile-edit-input"
            />
          </div>

          <div className="profile-edit-password-section">
            <h4 className="profile-edit-password-title">
              Change Password (Optional)
            </h4>
            
            <div className="profile-edit-fields">
              <div>
                <label className="profile-edit-label">New Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Leave blank to keep current"
                  className="profile-edit-input"
                />
              </div>

              <div>
                <label className="profile-edit-label">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Leave blank to keep current"
                  className="profile-edit-input"
                />
              </div>
            </div>
          </div>

        </div>
      </form>
    </Overlay>
  )
}
