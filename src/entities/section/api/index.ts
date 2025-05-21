/* eslint-disable no-console */
import Cookies from 'js-cookie'
import axios from 'axios'

import { instance } from '@/shared/api'

export const getSections = async (scriptId: string, scenarioId: string) => {
  const token = Cookies.get('token')

  if (!token) {
    console.error('No authorization token found.')
    return
  }

  try {
    const response = await instance.get(
      `scripts/${scriptId}/scenarios/${scenarioId}/sections/`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (response.data.success) {
      const sections = response.data.data
      console.log('Разделы успешно получены:', sections)
      return sections
    } else {
      console.error('Ошибка при получении разделов:', response.data.message)
    }
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error)
  }
}
export interface DeleteSectionResponse {
  success: boolean
  message?: string
}

export const deleteSection = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string
): Promise<DeleteSectionResponse> => {
  // Указываем правильный возвращаемый тип
  const token = Cookies.get('token')

  if (!token) {
    return {
      success: false,
      message: 'Токен авторизации не найден'
    }
  }

  try {
    const response = await instance.delete<DeleteSectionResponse>(
      `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка при удалении раздела'
      }
    }
    return {
      success: false,
      message: 'Неизвестная ошибка'
    }
  }
}
