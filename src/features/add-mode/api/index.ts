/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

export interface CreateSectionParams {
  title: string
  scriptId: string
  scenarioId: string
}

interface SectionResponse {
  id: string
  title: string
}
export const createSection = async (
  params: CreateSectionParams
): Promise<SectionResponse | null> => {
  if (!params.title || !params.scriptId || !params.scenarioId) {
    console.error('Invalid parameters:', params)
    return null
  }

  const token = Cookies.get('token')
  if (!token) {
    console.error('No authorization token found.')
    return null
  }

  console.log('Creating section with params:', {
    title: params.title,
    scriptId: params.scriptId,
    scenarioId: params.scenarioId
  })

  try {
    const response = await instance.post(
      `/scripts/${Number(params.scriptId)}/scenarios/${Number(params.scenarioId)}/sections`,
      {
        title: params.title,
        type: 'operator',
        weight: null
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log('Section created successfully:', response.data.data)
    return response.data.data as SectionResponse
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
        console.error('Error creating section:', error.response?.data)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    return null
  }
}
