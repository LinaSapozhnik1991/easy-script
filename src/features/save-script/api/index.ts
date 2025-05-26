/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { SaveScriptApiParams } from '@/features/save-script/types'

export const saveScriptApi = async (
  params: SaveScriptApiParams
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
  const token = Cookies.get('token')
  try {
    const response = await instance.put(`/scripts/${params.id}`, params, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error('Ошибка при сохранении скрипта:', error) // Логирование ошибки
    if (axios.isAxiosError(error)) {
      console.error('Ответ сервера:', error.response?.data) // Логирование ответа сервера
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка сохранения'
      }
    }
    return {
      success: false,
      message: 'Неизвестная ошибка'
    }
  }
}
