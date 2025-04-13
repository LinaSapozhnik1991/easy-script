import Cookies from 'js-cookie'

import instance from '@/shared/api'

import { User } from '../ui/UserProfile'

export const userMe = async (): Promise<User | null> => {
  const token = Cookies.get('token')
  if (!token) {
    return null
  }

  try {
    const response = await instance.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success && response.data.data.user) {
      return response.data.data.user
    } else {
      return null
    }
  } catch {
    return null
  }
}
