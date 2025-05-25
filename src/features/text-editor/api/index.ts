/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'
import { EditorState, convertToRaw } from 'draft-js'

import { instance } from '@/shared/api'

interface NodeData {
  title: string
  text: string
  content?: string
  weight: number | null
  is_target: boolean
  raw_content?: string // Добавляем это поле в основной интерфейс
}

interface SaveNodeParams {
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string | number
  editorState: EditorState
  initialNodeData: NodeData
}

export interface ApiNodeResponse {
  success: boolean
  message: string
  data: NodeData
}

export const saveNodeData = async ({
  scriptId,
  scenarioId,
  sectionId,
  nodeId,
  editorState,
  initialNodeData
}: SaveNodeParams): Promise<void> => {
  const token = Cookies.get('token')
  if (!token) {
    throw new Error('Токен авторизации не найден')
  }

  try {
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)

    const response = await instance.put<ApiNodeResponse>(
      `/scripts/${scriptId}/scenarios/${scenarioId}/sections/${sectionId}/nodes/${nodeId}`,
      {
        ...initialNodeData,
        raw_content: JSON.stringify(rawContent),
        text: contentState.getPlainText(),
        content: contentState.getPlainText() // Дублируем для совместимости
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message || 'Ошибка сохранения данных')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка сохранения:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(
        error.response?.data?.message || 'Ошибка сохранения данных'
      )
    }
    throw error
  }
}
