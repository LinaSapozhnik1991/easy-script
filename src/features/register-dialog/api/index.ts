import instance from '@/shared/api'

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
