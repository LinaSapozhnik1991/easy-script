import axios from 'axios'
import Cookies from 'js-cookie'
export const instance = axios.create({
  baseURL: 'https://easy-script.koston.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('refreshToken')
  if (!refreshToken) {
    return null
  }

  try {
    const response = await instance.post('/auth/refresh-token', {
      refreshToken
    })
    const { token } = response.data
    Cookies.set('token', token, { expires: 7 })
    return token
  } catch {
    return null
  }
}
