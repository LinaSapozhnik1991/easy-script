/* eslint-disable no-console */
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

import { AnswerNode } from '../ui/Section'

export const addAnswer = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string,
  title: string,
  text: string,
  weight: number | null = null,
  isTarget: boolean = false
) => {
  const token = Cookies.get('token')

  try {
    const response = await instance.post(
      `/scripts/${Number(scriptId)}/scenarios/${Number(scenarioId)}/sections/${Number(sectionId)}/nodes`,
      {
        title,
        text,
        weight,
        is_target: isTarget,
        type: 'answer'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data.data
  } catch (error) {
    console.error('Error adding answer:', error)
    throw error
  }
}

// В файле api.ts
export const getSectionNodes = async (
  scriptId: string,
  scenarioId: string,
  sectionId: string
): Promise<AnswerNode[]> => {
  const token = Cookies.get('token')

  try {
    const response = await instance.get<{
      success: boolean
      data: Array<{
        id: string
        title: string
        content: string
        text: string
      }>
    }>(
      `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (response.data.success) {
      return response.data.data.map(node => ({
        id: String(node.id),
        title: node.title,
        text: node.text,
        content: node.text,
        sectionId: String(sectionId),
        type: 'answer'
      }))
    }
    return []
  } catch (error) {
    console.error('Ошибка при получении узлов раздела:', error)
    return []
  }
}
