'use client'
import React, { useState, useEffect } from 'react'

export function showToast(message, type = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }))
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail
      const id = Date.now() + Math.random().toString(36).substr(2, 9)
      
      setToasts((prev) => [...prev, { id, message, type }])

      // Auto-remove toast card after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }

    window.addEventListener('show-toast', handleToast)
    return () => {
      window.removeEventListener('show-toast', handleToast)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-card"
          style={{
            background: 'rgba(20, 15, 35, 0.85)',
            border: '1px solid var(--accent-purple)',
            backdropFilter: 'blur(16px)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 32px 0 rgba(147, 51, 234, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            pointerEvents: 'auto'
          }}
        >
          <i className="icon icon-info-circle" style={{ color: 'var(--accent-gold)', fontSize: '14px' }}></i>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
