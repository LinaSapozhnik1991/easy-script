/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'
import { EditorState } from 'draft-js'

import { instance } from '@/shared/api'

interface NodeData {
  title: string
  text: string
  weight: number | null
  is_target: boolean
}

interface SaveNodeParams {
  editorState: EditorState
  initialNodeData: NodeData
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string | number
}

export const saveNodeData = async ({
  editorState,
  initialNodeData,
  scriptId,
  scenarioId,
  sectionId,
  nodeId
}: SaveNodeParams): Promise<void> => {
  const token = Cookies.get('token')
  if (!token) {
    console.error('No authorization token found.')
    return
  }

  try {
    const contentState = editorState.getCurrentContent()
    const text = contentState.getPlainText()

    const updatedNode = {
      ...initialNodeData,
      text: text
    }

    const response = await instance.put(
      `/scripts/${Number(scriptId)}/scenarios/${Number(scenarioId)}/sections/${Number(sectionId)}/nodes/${Number(nodeId)}`,
      updatedNode,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Данные успешно сохранены:', response.data.data)
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access - please check your token.')
      } else if (error.response?.status === 403) {
        console.error(
          'Access to company is forbidden:',
          error.response.data.message
        )
      } else {
        console.error('Error updating node:', error.response?.data)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    throw error
  }
}
