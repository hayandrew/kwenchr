import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="columns">
      <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <span>&copy; {currentYear} kwenchr, inc. All rights reserved.</span>
        <a href="#privacy" style={{ opacity: 0.8 }}>Privacy Policy</a>
      </div>
    </footer>
  )
}
