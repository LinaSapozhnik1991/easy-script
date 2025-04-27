/* eslint-disable no-console */
import { User } from '@/entities/user-profile/ui/UserProfile'
import instance from '@/shared/api'
export const updateUserData = async (userData: User, token: string) => {
  if (!token) {
    throw new Error('Токен не предоставлен')
  }
  console.log('Отправляемые данные:', userData)

  try {
    const response = await instance.put('/users/profile', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Ответ от сервера:', response.data)

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error)
    throw error
  }
}
