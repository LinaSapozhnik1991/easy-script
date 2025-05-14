/* eslint-disable no-console */
import { create } from 'zustand'
import { getScripts } from '@/features/scripts-table/api' // Импортируйте вашу функцию API
import { Script } from '../index'

interface StoreState {
  script: Script | null
  scriptName: string | null
  companyName: string | null
  companies: { id: string; name: string }[]
  scripts: Script[]
  scriptId: string | null
  setScript: (newScript: Script) => void
  setCompanies: (newCompanies: { id: string; name: string }[]) => void
  fetchScripts: () => Promise<void> // Добавлено для загрузки скриптов
  deleteScript: (scriptId: string) => Promise<void> // Изменено на async
}

const useScriptStore = create<StoreState>(set => ({
  script: null,
  scriptName: null,
  companyName: null,
  companies: [],
  scripts: [],
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
    // Здесь добавьте логику для удаления скрипта через API, если необходимо
    // Например, await deleteScriptFromAPI(scriptId);
    set(state => ({
      scripts: state.scripts.filter(script => script.id !== scriptId)
    }))
  }
}))

export default useScriptStore
