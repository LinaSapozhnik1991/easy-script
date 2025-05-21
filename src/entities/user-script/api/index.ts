/* eslint-disable no-console */
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { Script } from '@/entities/user-script'

interface ScriptResponse {
  success: boolean
  data: Script & { scenarios?: Array<{ id: string; name: string }> }
}
interface ApiError {
  message?: string
  data: {
    message: string
  }
}

export const getScriptById = async (
  id: string | null
): Promise<Script | { error: string }> => {
  if (!id) {
    return { error: 'ID скрипта не может быть пустым.' }
  }

  const token = Cookies.get('token')
  if (!token) {
    return { error: 'Токен отсутствует. Пожалуйста, войдите в систему.' }
  }

  try {
    const response = await instance.get<ScriptResponse>(`/scripts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      return response.data.data
    } else {
      return {
        error: 'Не удалось получить скрипт. Пожалуйста, проверьте ID скрипта.'
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Ошибка:', error.message)
      return { error: 'Произошла ошибка: ' + error.message }
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    ) {
      const apiError = error as { response?: { data?: ApiError } }
      console.error('Ошибка при получении скрипта:', apiError.response?.data)
      return {
        error:
          'Ошибка сервера: ' +
          (apiError.response?.data?.message || 'Неизвестная ошибка.')
      }
    } else {
      console.error('Неизвестная ошибка:', error)
      return { error: 'Произошла неизвестная ошибка.' }
    }
  }
}
