/* eslint-disable no-console */
import React, { JSX, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useForm, Controller, Control, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { User } from '@/entities/user-profile/ui/UserProfile'
import { Button } from '@/shared/ui/Button'
import {
  Check,
  Mail,
  Pencil,
  Phone,
  Preloader,
  TgUser,
  UserAvatar,
  WaUser
} from '@/shared/assets/icons'
import { userMe } from '@/entities/user-profile/api'

import { updateUserData } from '../api'
import { userSchema } from '../model/validation'
import { formatPhoneNumber } from '../model/formatted/formattedPhone'

import styles from './UserCard.module.scss'

const UserDataRow: React.FC<{
  label: string
  value: string
  isEditing: boolean
  control?: Control<User>
  name?: keyof User
  iconMail?: JSX.Element
  icon?: JSX.Element
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: FieldValues
  ) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  errorMessage?: string
}> = ({
  label,
  value,
  isEditing,
  control,
  onChange,
  onKeyDown,
  name,
  iconMail,
  errorMessage,
  icon
}) => (
  <tr>
    <td className={styles.label}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </td>
    <td>
      {isEditing && control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className={`${styles.inputField} ${errorMessage ? styles.error : ''}`}
              placeholder={`Введите ${label.toLowerCase()}`}
              onKeyDown={onKeyDown}
              onChange={e => {
                if (onChange) {
                  onChange(e, field)
                } else {
                  field.onChange(e)
                }
              }}
            />
          )}
        />
      ) : (
        <span className={styles.value}>
          {value} {iconMail}
        </span>
      )}
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </td>
  </tr>
)
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^\d$/.test(event.key) &&
    event.key !== 'Backspace' &&
    event.key !== 'Tab'
  ) {
    event.preventDefault()
  }
}

const handlePhoneChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  field: FieldValues
) => {
  const rawValue = event.target.value.replace(/\D/g, '') // Удаляем все нецифровые символы
  const formattedValue = formatPhoneNumber(rawValue) // Используем вашу функцию форматирования
  field.onChange(formattedValue) // Обновляем состояние
}

const UserProfileCard: React.FC<{
  user: User | null
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
}> = ({ isEditing, onEdit, onCancel }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null)

  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      phone: '',
      email: '',
      whatsapp: '',
      telegram: ''
    }
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userMe()
        setUserInfo(user)
        if (user) {
          setValue('name', user.name)
          setValue('phone', user.phone || '')
          setValue('email', user.email)
          setValue('whatsapp', user.whatsapp || '')
          setValue('telegram', user.telegram || '')
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error)
      }
    }

    fetchUserData()
  }, [setValue])

  const onSubmit = async (data: User) => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Токен отсутствует')
      }
      await updateUserData(data, token)
      setUserInfo(data)
      onCancel()
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error)
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
                  onClick={handleSubmit(onSubmit)}
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className={`${styles.inputFieldName} ${errors.name ? styles.error : ''}`}
                      placeholder="Введите имя"
                      onChange={e => {
                        field.onChange(e)
                        trigger('name')
                      }}
                    />
                    {errors.name && (
                      <span className={styles.error}>
                        {errors.name.message}
                      </span>
                    )}
                  </>
                )}
              />
            ) : (
              <p>{userInfo.name}</p>
            )}
          </div>
        </div>
        <div className={styles.userData}>
          <form id="userProfileForm" onSubmit={handleSubmit(onSubmit)}>
            <table className={styles.dataTable}>
              <tbody>
                <UserDataRow
                  icon={<Phone />}
                  label="Номер телефона"
                  value={userInfo.phone || ''}
                  isEditing={isEditing}
                  control={control}
                  onKeyDown={handleKeyDown}
                  onChange={(e, field) => {
                    handlePhoneChange(e, field)
                    trigger('phone')
                  }}
                  name="phone"
                  errorMessage={errors.phone?.message}
                />
                <UserDataRow
                  icon={<Mail />}
                  label="Электронная почта"
                  value={userInfo.email || ''}
                  isEditing={false}
                  iconMail={<Check />}
                />
                <UserDataRow
                  icon={<TgUser />}
                  label="Telegram"
                  value={userInfo.telegram || ''}
                  isEditing={isEditing}
                  control={control}
                  onChange={(e, field) => {
                    field.onChange(e)
                    trigger('telegram')
                  }}
                  name="telegram"
                  errorMessage={errors.telegram?.message}
                />
                <UserDataRow
                  icon={<WaUser />}
                  label="WhatsApp"
                  value={userInfo.whatsapp || ''}
                  isEditing={isEditing}
                  control={control}
                  name="whatsapp"
                  onKeyDown={handleKeyDown}
                  onChange={(e, field) => {
                    handlePhoneChange(e, field)
                    trigger('whatsapp')
                  }}
                  errorMessage={errors.whatsapp?.message}
                />
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
