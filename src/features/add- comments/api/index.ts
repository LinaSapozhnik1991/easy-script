/* eslint-disable no-console */
import Cookies from 'js-cookie'
import axios from 'axios'

import { instance } from '@/shared/api'

export interface CommentData {
  id: number
  node_id: string
  comment: string
  created_at: string
  updated_at: string
  user_name?: string
}

export interface ApiResponse {
  success: boolean
  data?: CommentData
  errors?: {
    [key: string]: string[]
  }
  message?: string
}
export const addComment = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string,
  nodeId: string,
  commentText: string
): Promise<ApiResponse> => {
  const token = Cookies.get('token')

  if (!token) {
    return {
      success: false,
      message: 'Токен авторизации не найден'
    }
  }

  try {
    const response = await instance.post<ApiResponse>(
      `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}/comments`,
      { comment: commentText },
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
      if (error.response?.status === 422) {
        return {
          success: false,
          errors: error.response.data?.errors,
          message: error.response.data?.message || 'Ошибка валидации'
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка сервера'
      }
    }
    return {
      success: false,
      message: 'Неизвестная ошибка'
    }
  }
}
export const getComments = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string,
  nodeId: string
): Promise<CommentData[]> => {
  const token = Cookies.get('token')

  if (!token) {
    console.error('Токен авторизации не найден')
    return []
  }

  try {
    const url = `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}/comments`
    console.log(`Запрос комментариев: ${url}`)

    const response = await instance.get<{ data: CommentData[] }>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при загрузке комментариев:', error.response?.data)
    } else {
      console.error('Неизвестная ошибка:', error)
    }
    return []
  }
}
