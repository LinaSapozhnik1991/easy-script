import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string
    }
  }
}

export const logoutUser = async () => {
  const token = Cookies.get('token')

  try {
    const response = await instance.post(
      '/users/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Ошибка выхода: ' + error.message)
    } else if (typeof error === 'object' && error !== null) {
      const axiosError = error as AxiosErrorResponse
      const errorMessage =
        axiosError.response?.data?.message || 'Неизвестная ошибка'
      throw new Error('Ошибка выхода: ' + errorMessage)
    } else {
      throw new Error('Ошибка выхода: ' + String(error))
    }
  }
}
