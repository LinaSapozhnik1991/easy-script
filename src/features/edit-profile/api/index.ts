/* eslint-disable no-console */
import { User } from '@/entities/user-profile/ui/UserProfile'
import instance from '@/shared/api'

// Функция для обновления данных пользователя
export const updateUserData = async (userData: User, token: string) => {
  // Проверяем наличие токена
  if (!token) {
    throw new Error('Токен не предоставлен')
  }

  // Логируем отправляемые данные
  console.log('Отправляемые данные:', userData)

  try {
    // Выполняем PUT-запрос для обновления данных пользователя
    const response = await instance.put('/users/profile', userData, {
      headers: {
        Authorization: `Bearer ${token}` // Добавляем токен в заголовок
      }
    })

    // Логируем ответ от сервера
    console.log('Ответ от сервера:', response.data)

    // Проверяем успешность ответа
    if (response.data.success) {
      return response.data.data // Возвращаем обновленные данные
    } else {
      throw new Error(response.data.message) // Генерируем ошибку, если что-то пошло не так
    }
  } catch (error) {
    // Логируем ошибку и пробрасываем её дальше
    console.error('Ошибка при обновлении данных пользователя:', error)
    throw error
  }
}
