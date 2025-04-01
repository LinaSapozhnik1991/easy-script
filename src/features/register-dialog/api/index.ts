import instance from '@/shared/api'
import axios from 'axios'

export const registerUser = async (userData: {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}) => {
  const response = await instance.post('/users/register', userData)
  return response
}
export const sendVerificationEmail = async (email: string) => {
  try {
    const response = await instance.post('/users/email/verify', { email })
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data)
    } else {
      throw new Error('Неизвестная ошибка при отправке верификационного email')
    }
  }
}
