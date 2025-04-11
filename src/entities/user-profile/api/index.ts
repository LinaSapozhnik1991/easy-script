import instance from '@/shared/api'

export const userMe = async () => {
  const response = await instance.get('/user')
  return response.data
}
