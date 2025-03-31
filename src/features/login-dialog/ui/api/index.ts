import instance from '@/shared/api'

export const loginUser = async (userData: {
  email: string
  password: string
}) => {
  const response = await instance.post('/users/login', userData)
  return response
}
