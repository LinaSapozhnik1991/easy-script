'use client'
import React from 'react'

import Billing from '@/pages/billing/page'

import UserLayout from '../UserLayout/UserLayout'

const DashboardPage = () => {
  return (
    <UserLayout>
      <Billing />
    </UserLayout>
  )
}

export default DashboardPage
