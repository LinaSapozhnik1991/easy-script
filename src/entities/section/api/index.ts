/* eslint-disable no-console */
import Cookies from 'js-cookie'
import axios from 'axios'

import { instance } from '@/shared/api'

import { Section } from '../ui/Section'

export const getSections = async (
  scriptId: string,
  scenarioId: string
): Promise<Section[]> => {
  const token = Cookies.get('token')

  try {
    const response = await instance.get<{
      success: boolean
      data: Array<{
        id: string
        title: string
        script_id: string
        scenario_id: string
        answers?: Array<{
          id: string
          title: string
          content: string
        }>
      }>
    }>(`scripts/${scriptId}/scenarios/${scenarioId}/sections/`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.success) {
      return response.data.data.map(section => ({
        id: section.id,
        title: section.title,
        scriptId: section.script_id,
        scenarioId: section.scenario_id,
        nodes: section.answers
          ? section.answers.map(answer => ({
              id: answer.id,
              title: answer.title,
              content: answer.content,
              sectionId: section.id,
              type: 'answer'
            }))
          : [],
        scenarios: [],
        weight: null
      }))
    }
    return []
  } catch (error) {
    console.error('Ошибка при получении разделов:', error)
    return []
  }
}

export interface DeleteSectionResponse {
  success: boolean
  message?: string
}

export const deleteSection = async (
  sectionId: string,
  scriptId: string,
  scenarioId: string
): Promise<DeleteSectionResponse> => {
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
