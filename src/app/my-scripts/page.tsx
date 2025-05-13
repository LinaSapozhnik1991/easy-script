'use client'
import React from 'react'

import MyScripts from '@/pages/my-scripts/page'

import UserLayout from '../UserLayout/UserLayout'
import ScriptModalLayout from '../ScriptModalLayout'

const ScriptsPage = () => {
  return (
    <UserLayout>
      <ScriptModalLayout>
        <MyScripts />
      </ScriptModalLayout>
    </UserLayout>
  )
}

export default ScriptsPage
