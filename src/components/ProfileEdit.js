'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Overlay from './Overlay'
import dedupeFetch from './utilities/dedupeFetch'

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
    <div style={{ display: 'flex', gap: '10px' }}>
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
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="icon icon-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--accent-purple)', marginBottom: '10px' }} />
          <div>Retrieving profile details...</div>
        </div>
      </Overlay>
    )
  }

  if (authChecked && !isLoggedIn) {
    return (
      <Overlay title="Access Restricted">
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            You must be logged in to view or edit user profiles.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
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
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple)',
              backgroundImage: "url('/images/default_person.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 auto 12px',
              border: '2px solid var(--accent-gold)'
            }}
            aria-label="User Avatar preview"
          ></div>
          <button type="button" className="btn btn-secondary btn-xs">Change Avatar</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'white',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'white',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '10px', paddingTop: '15px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Change Password (Optional)
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>New Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Leave blank to keep current"
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '10px 14px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Leave blank to keep current"
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '10px 14px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </form>
    </Overlay>
  )
}
