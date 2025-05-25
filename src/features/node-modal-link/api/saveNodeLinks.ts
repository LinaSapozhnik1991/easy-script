// nodeLinksApi.ts

import Cookies from 'js-cookie'
import axios from 'axios'

import { instance } from '@/shared/api'

export interface NodeLink {
  id: string
  title: string
}

export const saveNodeLinks = async (
  scriptId: string | number,
  scenarioId: string | number,
  sectionId: string | number,
  nodeId: string,
  linkedNodeIds: string[]
): Promise<void> => {
  const token = Cookies.get('token')
  if (!token) throw new Error('No authentication token found.')

  try {
    // Отправляем каждую ссылку отдельно
    await Promise.all(
      linkedNodeIds.map(async targetNodeId => {
        const payload = {
          target_node_id: Number(targetNodeId),
          text: 'Automatic link'
        }

        await instance.post(
          `scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}/links`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        )
      })
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Ошибка при сохранении ссылок'
      throw new Error(errorMessage)
    }
    throw new Error('Неизвестная ошибка при сохранении ссылок')
  }
}
