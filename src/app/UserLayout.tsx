// UserLayout.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { userMe } from '@/entities/user-profile/api'
import { User } from '@/entities/user-profile/ui/UserProfile'
import HeaderPersonal from '@/widgets/header-personal/ui/HeaderPersonal'
import FooterMain from '@/widgets/footerMain'
import { Preloader } from '@/shared/assets/icons'

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUserData = async () => {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/')
        return
      }
      try {
        const data: User | null = await userMe()
        setUserData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Не удалось загрузить данные пользователя.')
        }
      } finally {
        setLoading(false)
      }
    }

    getUserData()
  }, [])

  if (loading) return <Preloader />
  if (error) return <p>Ошибка: {error}</p>
  if (!userData) return <p>Не удалось загрузить данные пользователя.</p>

  return (
    <>
      <HeaderPersonal user={userData} />
      {children}
      <FooterMain showLinks={true} />
    </>
  )
}

export default UserLayout
