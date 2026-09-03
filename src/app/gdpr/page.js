import React from 'react'
import MainDashboard from '@/components/MainDashboard'
import Legal from '@/components/Legal'

export const metadata = {
  title: 'GDPR Compliance & Data Rights — kwenchr',
  description: 'Understand your privacy rights under GDPR, including data access, rectification, portability, and deletion on kwenchr.',
}

export default function GdprPage() {
  return (
    <MainDashboard>
      <Legal initialTab="gdpr" />
    </MainDashboard>
  )
}
