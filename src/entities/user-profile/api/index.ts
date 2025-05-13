import Cookies from 'js-cookie'
import axios from 'axios'

import { instance, refreshAccessToken } from '@/shared/api'

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
      const user: User = {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        phone: response.data.data.user.phone || '',
        companies: response.data.data.companies || [],
        currentCompany: response.data.data.current_company || null
      }
      return user
    } else {
      return null
    }
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          const response = await instance.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          })
          if (response.data.success && response.data.data.user) {
            const user: User = {
              id: response.data.data.user.id,
              name: response.data.data.user.name,
              email: response.data.data.user.email,
              phone: response.data.data.user.phone || '',
              companies: response.data.data.companies || [],
              currentCompany: response.data.data.current_company || null
            }
            return user
          }
        }
      }
    }
    return null
  }
}
