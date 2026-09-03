import React from 'react'
import MainDashboard from '@/components/MainDashboard'
import Legal from '@/components/Legal'

export const metadata = {
  title: 'Privacy Policy — kwenchr',
  description: 'Learn how kwenchr collects, protects, and manages your personal and location data.',
}

export default function PrivacyPage() {
  return (
    <MainDashboard>
      <Legal initialTab="privacy" />
    </MainDashboard>
  )
}
