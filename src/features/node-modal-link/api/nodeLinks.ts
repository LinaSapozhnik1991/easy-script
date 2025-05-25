// nodeLinksApi.ts
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

export interface NodeLink {
  id: string
  title: string
}

export const getAvailableNodeLinks = async (
  scriptId: string | number,
  scenarioId: string | number,
  sectionId: string | number,
  nodeId: string
): Promise<NodeLink[]> => {
  const token = Cookies.get('token')
  if (!token) {
    throw new Error('No authentication token found.')
  }

  try {
    const response = await instance.get(
      `scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}/links`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    )

    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Ошибка при загрузке доступных нод'
      )
    }

    return response.data.links
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Ошибка при загрузке доступных нод'
      )
    }
    throw new Error('Неизвестная ошибка')
  }
}
