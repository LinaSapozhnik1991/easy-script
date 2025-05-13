'use client'
import React from 'react'

import Construction from '@/pages/construction/[id]'

import UserLayout from '../UserLayout/UserLayout'

const ConstructionPage = () => {
  return (
    <UserLayout>
      <Construction />
    </UserLayout>
  )
}

export default ConstructionPage
