import Cookies from 'js-cookie'
import axios from 'axios'

import { instance } from '@/shared/api'

export interface AddCommentResponse {
  success: boolean
  data?: {
    id: string
    text: string
  }
  message?: string
}

export const addComment = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string,
  nodeId: string,
  commentText: string
): Promise<AddCommentResponse> => {
  const token = Cookies.get('token')

  if (!token) {
    return {
      success: false,
      message: 'Токен авторизации не найден'
    }
  }

  try {
    const response = await instance.post<AddCommentResponse>(
      `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}/comments`,
      { text: commentText },
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
        message:
          error.response?.data?.message || 'Ошибка при добавлении комментария'
      }
    }
    return {
      success: false,
      message: 'Неизвестная ошибка'
    }
  }
}
