/* eslint-disable no-console */
import Cookies from 'js-cookie'

import instance from '@/shared/api'

export interface Creator {
  id: number
  name: string
}

export interface Company {
  id: number
  name: string
}

export interface Type {
  id: number
  name: string
}

export interface Script {
  id: number
  title: string
  description: string
  target: string
  company_id: number
  user_id: number
  type_id: number
  created_at: string
  updated_at: string
  creator: Creator
  company: Company
  type: Type
}

interface ScriptsResponse {
  success: boolean
  data: Script[]
  meta: {
    total: number
    current_company: Company
  }
}

// Функция для получения скриптов
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
