'use client'
import React from 'react'

import EasyScript from '@/pages/easyScript/page'

import ModalRootLayout from './ModalRootLayout'

const Home: React.FC = () => {
  return (
    <ModalRootLayout>
      <EasyScript />
    </ModalRootLayout>
  )
}
export default Home
