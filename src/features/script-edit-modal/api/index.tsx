/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { ScriptResponse } from '@/entities/user-script'

interface EditScriptParams {
  title: string
  description?: string
  companyId: string | null
  target?: string
}

export const editScript = async (
  id: string | null,
  params: EditScriptParams
): Promise<ScriptResponse | null> => {
  if (!params.title || !params.companyId) {
    console.error('Missing required parameters for editing script.')
    return null
  }

  if (!id) {
    console.error('Script ID is required.')
    return null
  }

  const token = Cookies.get('token')
  if (!token) {
    console.error('No authentication token found.')
    return null
  }

  try {
    const response = await instance.put(
      `/scripts/${id}`,
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

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access: Token may be expired or invalid.')
      } else if (error.response?.status === 403) {
        console.error(
          'Access to company is forbidden:',
          error.response.data.message
        )
      } else {
        console.error('Error editing script:', error.response?.data)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    return null
  }
}
