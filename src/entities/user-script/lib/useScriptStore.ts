/* eslint-disable no-console */
import { create } from 'zustand'

import { Script } from '../index'

interface StoreState {
  script: Script | null
  scriptName: string | null
  companyName: string | null
  companies: { id: string; name: string }[]
  scriptId: string | null
  setScript: (newScript: Script) => void
  setCompanies: (newCompanies: { id: string; name: string }[]) => void
}

const useScriptStore = create<StoreState>(set => ({
  script: null,
  scriptName: null,
  companyName: null,
  companies: [],
  scriptId: null,
  setScript: createdScript => {
    console.log('Устанавливаем новый скрипт:', createdScript)
    set({
      script: createdScript,
      scriptName: createdScript.title || null,
      companyName: createdScript.company.name || null,
      scriptId: createdScript.id || null
    })
  },
  setCompanies: newCompanies => {
    console.log('Устанавливаем новые компании:', newCompanies)
    set({ companies: newCompanies })
  }
}))

export default useScriptStore
