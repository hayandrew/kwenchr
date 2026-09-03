import React from 'react'
import MainDashboard from '@/components/MainDashboard'
import Legal from '@/components/Legal'

export const metadata = {
  title: 'Terms of Service — kwenchr',
  description: 'Terms of Service and 21+ responsible drinking policy for using kwenchr nightlife and drink specials platform.',
}

export default function TermsPage() {
  return (
    <MainDashboard>
      <Legal initialTab="terms" />
    </MainDashboard>
  )
}
