/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import HeaderPersonal from '@/widgets/heeader-personal/ui/HeaderPersonal'
import FooterMain from '@/widgets/footerMain'
import { userMe } from '@/entities/user-profile/api'

import styles from './Dashboard.module.scss'

const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await userMe() // Получаем данные о пользователе
        setUserData(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message) // Теперь можно безопасно получить message
        } else {
          console.error('Произошла неизвестная ошибка') // Обработка неизвестной ошибки
        }
        router.push('/') // Перенаправляем на страницу входа в случае ошибки
      } finally {
        setLoading(false)
      }
    }

    getUserData()
  }, [router])

  if (loading) return <p>Загрузка...</p>
  if (!userData) return <p>Не удалось загрузить данные пользователя.</p>
  return (
    <>
      <HeaderPersonal user={userData} />
      <div className={styles.dashboard}>
        <div className={styles.dashboardCompany}>
          <p>Добро пожаловать</p>
        </div>
      </div>
      <FooterMain showLinks={true} />
    </>
  )
}

export default Dashboard
