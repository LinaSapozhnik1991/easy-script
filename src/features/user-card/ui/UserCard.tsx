/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { User } from '@/entities/user-profile/ui/UserProfile'
import { Button } from '@/shared/ui/Button'
import { Check, Pencil, Preloader, UserAvatar } from '@/shared/assets/icons'
import { userMe } from '@/entities/user-profile/api'

import { updateUserData } from '../api'

import styles from './UserCard.module.scss'

const UserCard: React.FC<{
  user: User | null
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ isEditing, onEdit, onCancel }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [formData, setFormData] = useState<User | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userMe()
        setUserInfo(user)
        setFormData(user)
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      try {
        const token = Cookies.get('token')
        if (!token) {
          throw new Error('Токен отсутствует')
        }
        await updateUserData(formData, token)
        setUserInfo(formData)
        onCancel()
      } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error)
      }
    }
  }

  if (!userInfo) {
    return <Preloader />
  }

  return (
    <div className={styles.userProfileInfo}>
      <div className={styles.userCard}>
        <div className={styles.userCardHead}>
          <h2>Личные данные</h2>
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <>
                <Button
                  primaryBorder
                  type="button"
                  size="small"
                  onClick={onCancel}>
                  Отмена
                </Button>
                <Button
                  primary
                  type="submit"
                  size="small"
                  form="userProfileForm">
                  Сохранить
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={onEdit}
                className={styles.editButton}>
                <Pencil />
              </button>
            )}
          </div>
        </div>
        <div className={styles.user}>
          <UserAvatar />
          <div className={styles.name}>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData?.name || ''}
                onChange={handleChange}
                placeholder="Введите имя"
                className={styles.inputField}
              />
            ) : (
              <p>{userInfo.name}</p>
            )}
          </div>
        </div>
        <div className={styles.userData}>
          {isEditing ? (
            <form id="userProfileForm" onSubmit={handleSubmit}>
              <table className={styles.dataTable}>
                <tbody>
                  <tr>
                    <td>Номер телефона</td>
                    <td>
                      <input
                        type="text"
                        name="phone"
                        value={formData?.phone || ''}
                        onChange={handleChange}
                        placeholder="Введите номер телефона"
                        className={styles.inputField}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Почта</td>
                    <td className={styles.userValue}>
                      {userInfo.email} <Check />
                    </td>
                  </tr>
                  <tr>
                    <td>WhatsApp</td>
                    <td>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData?.whatsapp || ''}
                        onChange={handleChange}
                        placeholder="Введите WhatsApp"
                        className={styles.inputField}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Telegram</td>
                    <td>
                      <input
                        type="text"
                        name="telegram"
                        value={formData?.telegram || ''}
                        onChange={handleChange}
                        placeholder="Введите Telegram"
                        className={styles.inputField}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          ) : (
            <table className={styles.dataTable}>
              <tbody>
                <tr>
                  <td>Номер телефона</td>
                  <td className={styles.userValue}>{userInfo.phone}</td>
                </tr>
                <tr>
                  <td>Почта</td>
                  <td className={styles.userValue}>{userInfo.email}</td>
                </tr>
                <tr>
                  <td>WhatsApp</td>
                  <td className={styles.userValue}>{userInfo.whatsapp}</td>
                </tr>
                <tr>
                  <td>Telegram</td>
                  <td className={styles.userValue}>{userInfo.telegram}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserCard
