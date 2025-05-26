/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
interface UpdateNodeParams {
  scriptId: string
  scenarioId: string
  sectionId: string
  nodeId: string
  isTarget: boolean
}

export const updateNodeTarget = async ({
  scriptId,
  scenarioId,
  sectionId,
  nodeId,
  isTarget
}: UpdateNodeParams): Promise<void> => {
  console.log('Request data:', {
    scriptId,
    scenarioId,
    sectionId,
    nodeId,
    isTarget
  })

  const token = Cookies.get('token')
  if (!token) {
    console.error('No authentication token found.')
  }
  try {
    const response = await instance.put(
      `scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}`,
      { is_target: isTarget },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 3000
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message || 'Ошибка обновления узла')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Ошибка при обновлении цели'
      )
    }
    throw new Error('Неизвестная ошибка')
  }
}
