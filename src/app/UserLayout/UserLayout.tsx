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
import Sidebar from '@/widgets/sidebar/ui/Sidebar'

import styles from './UserLayout.module.scss'

type Content = {
  title: string
  component: React.ReactNode
}
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentContent] = useState<Content | null>(null)
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
    <div className={styles.layout}>
      <HeaderPersonal user={userData} />
      <div className={styles.content}>
        <Sidebar />{' '}
        <main className={styles.main}>
          {currentContent ? currentContent.component : children}{' '}
        </main>
      </div>
      <FooterMain showLinks={true} />
    </div>
  )
}

export default UserLayout
