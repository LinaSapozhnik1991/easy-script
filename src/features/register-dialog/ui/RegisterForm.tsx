'use client'
import React, { FC, useState } from 'react'
import {
  FieldError,
  SubmitHandler,
  useForm,
  UseFormRegister
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import axios from 'axios'

import { InputSizes, InputTypes } from '@/shared/ui/Input/input.types'
import Input from '@/shared/ui/Input/Input'
import Checkbox from '@/shared/ui/Checkbox/Checkbox'
import { Button } from '@/shared/ui/Button'
import { Check, Eye, EyeClosed } from '@/shared/assets/icons'

import { registrationSchema } from '../model/validation'
import { formatPhoneNumber } from '../model/formatted/formatedPhone'
import { registerUser } from '../api'

import styles from './Register.module.scss'

type FormData = z.infer<typeof registrationSchema>

const InputField: FC<{
  id: keyof FormData
  label: string
  placeholder: string
  type: InputTypes
  register: UseFormRegister<FormData>
  error?: FieldError
  serverError?: string | null
  inputCompleted: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  showPasswordToggle?: () => void
  showPassword?: boolean
  trigger: (field?: keyof FormData) => Promise<boolean>
  validate?: { validate: (value: string) => boolean | string }
}> = ({
  id,
  label,
  placeholder,
  type,
  register,
  error,
  serverError,
  inputCompleted,
  onChange,
  trigger,
  showPasswordToggle,
  showPassword
}) => (
  <div className={styles.containerInput}>
    <label htmlFor={id} className={styles.label}>
      {label}
      {id === 'company' && (
        <span className={styles.optional}> (необязательно)</span>
      )}
      {id === 'password' && (
        <span className={styles.optional}> (минимум 8 символов)</span>
      )}
    </label>
    <div className={styles.inputWrapper}>
      <Input
        id={id}
        {...register(id)}
        placeholder={placeholder}
        type={type}
        style={{ width: '400px' }}
        inputSize={InputSizes.Large}
        error={!!error}
        onChange={onChange}
        onBlur={() => trigger(id)}
      />
      {showPasswordToggle && (
        <div className={styles.eyeIcon} onClick={showPasswordToggle}>
          {showPassword ? <Eye /> : <EyeClosed />}
        </div>
      )}
      <div className={styles.errorWrapper}>
        {error ? (
          <span className={styles.error}>{error.message}</span>
        ) : serverError ? (
          <span className={styles.error}>{serverError}</span>
        ) : inputCompleted ? (
          <Check className={styles.checkIcon} />
        ) : null}
      </div>
    </div>
  </div>
)
type RegisterFormProps = {
  onRegisterSuccess: (email: string) => void
}
const RegisterForm: FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  })
  const [serverErrorEmail, setServerErrorEmail] = useState<string | null>(null)
  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirmPassword
      })

      if (response.status === 201) {
        onRegisterSuccess(data.email)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.data

          setServerErrorEmail(null)

          if (errors.email) {
            setServerErrorEmail(errors.email.join(', '))
          }
        } else {
          setServerErrorEmail(
            'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
          )
        }
      } else {
        setServerErrorEmail('Не удалось подключиться к серверу')
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [agreementError, setAgreementError] = useState(false)
  const password = watch('password')

  const handleCheckboxChange = () => {
    setIsChecked(prev => {
      const newChecked = !prev
      setValue('agreement', newChecked)
      setAgreementError(!newChecked)
      return newChecked
    })
  }

  const handleChange =
    (field: keyof FormData) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const formattedValue =
        field === 'phone' ? formatPhoneNumber(value) : value

      setValue(field, formattedValue)
      clearErrors(field)
      await trigger(field)
    }
  /*useEffect(() => {
    setValue('company', 'Моя компания')
  }, [setValue])*/
  return (
    <div className={styles.registration}>
      <div className={styles.modalForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className={styles.containerInputTwo}>
            <InputField
              id="name"
              label="Имя:"
              placeholder="Введите ваше имя"
              type={InputTypes.Text}
              register={register}
              error={errors.name}
              inputCompleted={!!watch('name')}
              onChange={handleChange('name')}
              trigger={trigger}
            />

            <InputField
              id="company"
              label="Компания"
              placeholder="Введите название компании"
              type={InputTypes.Text}
              register={register}
              error={errors.company}
              inputCompleted={!!watch('company')}
              onChange={handleChange('company')}
              trigger={trigger}
            />
            <InputField
              id="phone"
              label="Номер телефона:"
              placeholder="Введите номер телефона (только цифры)"
              type={InputTypes.Tel}
              register={register}
              error={errors.phone}
              inputCompleted={!!watch('phone')}
              onChange={handleChange('phone')}
              trigger={trigger}
            />
            <InputField
              id="email"
              label="Электронная почта:"
              placeholder="Введите email"
              type={InputTypes.Email}
              register={register}
              error={errors.email}
              serverError={serverErrorEmail}
              inputCompleted={!!watch('email')}
              onChange={handleChange('email')}
              trigger={trigger}
            />

            <InputField
              id="password"
              label="Пароль"
              placeholder="Введите пароль"
              type={showPassword ? InputTypes.Text : InputTypes.Password}
              register={register}
              error={errors.password}
              inputCompleted={!!watch('password')}
              onChange={handleChange('password')}
              showPasswordToggle={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              trigger={trigger}
            />
            <InputField
              id="confirmPassword"
              label="Повторите пароль:"
              placeholder="Повторите ввод пароля"
              type={showConfirmPassword ? InputTypes.Text : InputTypes.Password}
              register={register}
              trigger={trigger}
              error={errors.confirmPassword}
              inputCompleted={!!watch('confirmPassword')}
              onChange={handleChange('confirmPassword')}
              showPasswordToggle={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              showPassword={showConfirmPassword}
              validate={{
                validate: value => value === password || 'Пароли не совпадают'
              }}
            />
          </fieldset>

          <div className={styles.form_bottom}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                id="agreement"
                {...register('agreement')}
                checked={isChecked}
                onChange={handleCheckboxChange}
                error={agreementError}
              />
              <label className={styles.labelCheck}>
                Даю согласие на обработку своих персональных данных <br />
                на условиях
                <span className={styles.policy}>
                  <Link href="/"> политики конфиденциальности</Link>
                </span>
              </label>
            </div>
            <div className={styles.btn}>
              <Button size="large" type="submit" primary disabled={!isChecked}>
                Зарегистрироваться
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
