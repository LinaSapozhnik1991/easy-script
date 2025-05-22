/* eslint-disable no-console */
// eslint-disable-next-line import/named
import axios, { AxiosError, AxiosResponse } from 'axios'
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
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string | number
  editorState: EditorState
  initialNodeData: NodeData
}

export const saveNodeData = async ({
  scriptId,
  scenarioId,
  sectionId,
  nodeId,
  editorState,
  initialNodeData
}: SaveNodeParams): Promise<NodeData> => {
  const token = Cookies.get('token')
  if (!token) {
    console.error('No authorization token found.')
    throw new Error('No authorization token')
  }

  try {
    const content = editorState.getCurrentContent().getPlainText()

    const updatedNode: NodeData = {
      ...initialNodeData,
      text: content,
      title: initialNodeData.title,
      weight: initialNodeData.weight,
      is_target: initialNodeData.is_target
    }

    const response: AxiosResponse<NodeData> = await instance.put(
      `/scripts/${Number(scriptId)}/scenarios/${Number(scenarioId)}/sections/${Number(sectionId)}/nodes/${Number(nodeId)}`,
      updatedNode,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Node saved successfully:', response.data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>
      console.error('Error saving node:', axiosError.response?.data)
      throw new Error(
        axiosError.response?.data?.message || 'Failed to save node'
      )
    }
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}
