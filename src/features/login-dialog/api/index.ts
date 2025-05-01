import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await instance.post('/users/login', data)

    const { data: responseData } = response.data

    const { token } = responseData

    if (token) {
      Cookies.set('token', token, { expires: 0.33 })
    } else {
      throw new Error('Произошла ошибка')
    }

    return response.data
  } catch (error) {
    throw error
  }
}
