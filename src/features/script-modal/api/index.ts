/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { ScriptResponse } from '@/entities/user-script'

interface CreateScriptParams {
  title: string
  id?: number
  description?: string
  companyId: string | null
  target?: string
  scenarios?: {
    id: string
    name: string
  }[]
}

export const createScript = async (
  params: CreateScriptParams
): Promise<ScriptResponse | null> => {
  if (!params.title || !params.companyId) {
    console.error('Invalid parameters:', params)
    return null
  }

  const token = Cookies.get('token')
  if (!token) {
    console.error('No authorization token found.')
    return null
  }

  try {
    const response = await instance.post(
      '/scripts',
      {
        title: params.title,
        description: params.description || '',
        company_id: params.companyId,
        target: params.target || 'defaultTarget'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log('Script created successfully:', response.data.data)
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
        console.error('Error creating script:', error.response?.data)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    return null
  }
}
