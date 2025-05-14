/* eslint-disable no-console */
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

export const deleteScriptById = async (scriptId: string): Promise<boolean> => {
  const id = scriptId
  if (!id) {
    console.error('Script ID is required for deletion.')
    return false
  }

  const token = Cookies.get('token')
  if (!token) {
    console.error('No authentication token found.')
    return false
  }

  try {
    console.log('Attempting to delete script with ID:', id)
    await instance.delete(`/scripts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Script deleted successfully.')
    return true
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error occurred:', error)
      if (error.response?.status === 401) {
        console.error('Unauthorized access: Token may be expired or invalid.')
      } else if (error.response?.status === 403) {
        console.error(
          'Access to company is forbidden:',
          error.response.data.message
        )
      } else {
        console.error('Error deleting script:', error.response?.data)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    return false
  }
}
