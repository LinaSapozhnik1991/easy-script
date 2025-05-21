'use client'
import React from 'react'

import Operator from '@/pages/operator/[id]'

import UserLayout from '../UserLayout/UserLayout'

const OperatorPage = () => {
  return (
    <UserLayout>
      <Operator />
    </UserLayout>
  )
}

export default OperatorPage
