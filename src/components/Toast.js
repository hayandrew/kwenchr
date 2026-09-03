'use client'
import React, { useState, useEffect } from 'react'
import './Toast.css'

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
    <div className="toast-wrapper">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-card"
        >
          <i className="icon icon-info-circle toast-icon"></i>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
