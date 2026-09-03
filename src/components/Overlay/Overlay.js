'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import './Overlay.css'

export default function Overlay({ title, children, buttons, maxWidth, className }) {
  const router = useRouter()

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('has-overlay')
      return () => {
        document.body.classList.remove('has-overlay')
      }
    }
  }, [])

  const onOverlayClose = () => {
    // If there is history, navigate back; otherwise redirect to home
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="overlay">
      <div 
        className={`overlay-wrapper ${className || ''}`.trim()}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="overlay-header">
          <h3>{title}</h3>
          <button onClick={onOverlayClose} className="btn close">
            <i className="icon icon-close"></i>
          </button>
        </div>
        <div className="overlay-content">
          <div className="overlay-content-inner">
            {children}
          </div>
        </div>
        {buttons && <div className="overlay-footer">{buttons}</div>}
      </div>
    </div>
  )
}
