import React from 'react'
import MainDashboard from '@/components/MainDashboard'
import Legal from '@/components/Legal'

export const metadata = {
  title: 'Cookie Policy — kwenchr',
  description: 'Understand how kwenchr uses cookies, session storage, and caching to enhance your experience.',
}

export default function CookiesPage() {
  return (
    <MainDashboard>
      <Legal initialTab="cookies" />
    </MainDashboard>
  )
}
