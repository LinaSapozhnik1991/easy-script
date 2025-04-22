/* eslint-disable no-console */
/* eslint-disable import/named */
'use client'
import React, { FC, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { InputSizes, InputTypes } from '@/shared/ui/Input/input.types'
import Input from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button'
import { Check, Eye, EyeClosed } from '@/shared/assets/icons'

import { loginSchema } from '../model/validations'
import { loginUser } from '../api'

import styles from './Login.module.scss'

type FormData = {
  email: string
  password: string
}

type LoginFormProps = {
  registrationSuccess: boolean
  email?: string
  isLoginWindow: boolean
}
const LoginForm: FC<LoginFormProps> = ({
  registrationSuccess,
  email,
  isLoginWindow
}) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })
  useEffect(() => {
    if (email) {
      setValue('email', email)
    }
  }, [email, setValue])

  const [showPassword, setShowPassword] = useState(false)
  const [serverErrorEmail, setServerErrorEmail] = useState<string | null>(null)
  const [serverErrorPassword, setServerErrorPassword] = useState<string | null>(
    null
  )

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setValue('email', value)

    if (serverErrorEmail) {
      setServerErrorEmail(null)
    }
    await trigger('email')
  }

  const handlePasswordChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setValue('password', value)
    if (serverErrorPassword) {
      setServerErrorPassword(null)
    }
    await trigger('password')
  }

  const onSubmit: SubmitHandler<FormData> = async data => {
    setServerErrorEmail(null)
    setServerErrorPassword(null)
    try {
      const response = await loginUser(data)

      if (
        response &&
        response.success &&
        response.data &&
        response.data.token
      ) {
        console.log('Авторизация успешна, перенаправление на /dashboard')
        router.push('/dashboard')
      } else {
        console.error(
          'Ошибка: Токен отсутствует или ответ некорректен',
          response
        )
      }
    } catch (error) {
      console.error('Ошибка при входе:', error)

      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data?.message || 'Произошла ошибка'

        if (error.response.status === 422) {
          const errors = error.response.data.errors

          if (errors.email) {
            setServerErrorEmail(errors.email.join(', '))
          } else {
            setServerErrorEmail(null)
          }

          if (errors.password) {
            setServerErrorPassword(errors.password.join(', '))
          } else {
            setServerErrorPassword(null)
          }
        } else {
          setServerErrorPassword(serverMessage)
        }
      } else {
        setServerErrorEmail('Не удалось подключиться к серверу.')
        setServerErrorPassword('Не удалось подключиться к серверу.')
      }
    }
  }

  const watchedEmail = watch('email')
  const password = watch('password')
  const isFormFilled =
    watchedEmail && password && !errors.email && !errors.password
  return (
    <div className={styles.login}>
      <div className={styles.modalForm}>
        {registrationSuccess && (
          <span className={styles.alarm}>
            Почта подтверждена! Войдите в систему
          </span>
        )}
        {isLoginWindow && !registrationSuccess && !isFormFilled && (
          <span className={`${styles.alarm} ${styles.alarmSecond}`}>
            Войдите в систему, чтобы продолжить работу
          </span>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.containerInput}>
            <label htmlFor="email">Электронная почта:</label>
            <div className={styles.inputWrapper}>
              <Input
                id="email"
                {...register('email')}
                onChange={handleEmailChange}
                style={{ width: '400px' }}
                placeholder="Введите email"
                type={InputTypes.Email}
                inputSize={InputSizes.Large}
                error={!!errors.email || !!serverErrorEmail}
                maxLength={255}
              />
              {errors.email ? (
                <span className={styles.error}>{errors.email.message}</span>
              ) : serverErrorEmail ? (
                <span className={styles.error}>{serverErrorEmail}</span>
              ) : watchedEmail ? (
                <Check className={styles.checkIcon} />
              ) : null}
            </div>
          </div>

          <div className={styles.containerInput}>
            <label htmlFor="password">Пароль:</label>
            <div className={styles.inputWrapper}>
              <Input
                id="password"
                {...register('password')}
                onChange={handlePasswordChange}
                inputSize={InputSizes.Large}
                style={{ width: '400px' }}
                maxLength={16}
                placeholder="Введите пароль"
                type={showPassword ? InputTypes.Text : InputTypes.Password}
                error={!!errors.password || !!serverErrorPassword}
              />
              <div
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye /> : <EyeClosed />}
              </div>
              {errors.password ? (
                <span className={styles.error}>{errors.password.message}</span>
              ) : serverErrorPassword ? (
                <span className={styles.error}>{serverErrorPassword}</span>
              ) : password ? (
                <Check className={styles.checkIcon} />
              ) : null}
            </div>
          </div>

          <div className={styles.form_bottom}>
            <div className={styles.linkWrapper}>
              <Link href="#">Забыли пароль?</Link>
            </div>
            <div className={styles.btn}>
              <Button
                size="large"
                type="submit"
                disabled={!isFormFilled}
                primary={!!isFormFilled}>
                Войти
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
