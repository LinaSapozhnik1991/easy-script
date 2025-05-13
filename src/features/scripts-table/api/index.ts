/* eslint-disable no-console */
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { Company, Script } from '@/entities/user-script'

interface ScriptsResponse {
  success: boolean
  data: Script[]
  meta: {
    total: number
    current_company: Company
  }
}

export const getScripts = async (): Promise<Script[] | { error: string }> => {
  const token = Cookies.get('token')
  if (!token) {
    return { error: 'Токен отсутствует. Пожалуйста, войдите в систему.' }
  }

  try {
    const response = await instance.get<ScriptsResponse>('/scripts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      return response.data.data
    } else {
      return { error: 'Не удалось получить скрипты.' }
    }
  } catch (error) {
    console.error('Ошибка при получении скриптов:', error)
    return { error: 'Произошла ошибка при получении данных.' }
  }
}
