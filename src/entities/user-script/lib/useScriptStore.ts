/* eslint-disable no-console */
import { create } from 'zustand'
import { getScripts } from '@/features/scripts-table/api'
import { Scenarios, Script } from '../index'

interface StoreState {
  script: Script | null
  scriptName: string | null
  companyName: string | null
  companies: { id: string; name: string }[]
  scripts: Script[]
  scenarios: Scenarios[]
  scriptId: string | null
  setScript: (newScript: Script) => void
  setCompanies: (newCompanies: { id: string; name: string }[]) => void
  setScenarios: (newScenarios: Scenarios[]) => void
  fetchScripts: () => Promise<void>
  deleteScript: (scriptId: string) => Promise<void>
}

const useScriptStore = create<StoreState>(set => ({
  script: null,
  scriptName: null,
  companyName: null,
  companies: [],
  scripts: [],
  scriptId: null,
  scenarios: [],

  setScript: createdScript => {
    console.log('Устанавливаем новый скрипт:', createdScript)
    set({
      script: createdScript,
      scriptName: createdScript.title ?? null,
      companyName: createdScript.company?.name ?? null,
      scenarios: createdScript.scenarios ?? [],
      scriptId: createdScript.id ?? null
    })
  },

  setCompanies: newCompanies => {
    console.log('Устанавливаем новые компании:', newCompanies)
    set({ companies: newCompanies })
  },

  setScenarios: newScenarios => {
    console.log('Устанавливаем новые сценарии:', newScenarios)
    set({ scenarios: newScenarios })
  },

  fetchScripts: async () => {
    console.log('Загружаем скрипты...')
    const result = await getScripts()
    if (!('error' in result)) {
      set({ scripts: result })
    } else {
      console.error('Ошибка при загрузке скриптов:', result.error)
    }
  },

  deleteScript: async scriptId => {
    console.log('Удаляем скрипт с ID:', scriptId)
    // Если у вас есть API для удаления — вызывайте его здесь
    set(state => ({
      scripts: state.scripts.filter(script => script.id !== scriptId)
    }))
  }
}))

export default useScriptStore
