import React, { FC, useState } from 'react'

import SegmentedControl from '@/shared/ui/SegmentedControl/SegmentedControl'
import { LoginForm } from '@/features/login-dialog'
import { RegisterForm } from '@/features/register-dialog'

import styles from './AuthSegmentedControl.module.scss'

type AuthSegmentedControlProps = {
  selectedOption: string
  onSelect: (option: string) => void
}

const AuthSegmentedControl: FC<AuthSegmentedControlProps> = ({
  selectedOption,
  onSelect
}) => {
  const options = ['Регистрация', 'Вход']
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const handleRegisterSuccess = (registeredEmail: string) => {
    setRegistrationSuccess(true)
    setEmail(registeredEmail)
    onSelect('Вход')
  }

  return (
    <div className={styles.Auth}>
      <div className={styles.SegmentedControl}>
        <SegmentedControl
          variant="line"
          options={options}
          defaultSelected={selectedOption}
          onSelect={onSelect}
        />
      </div>
      <div className={styles.horizontalLine}></div>
      {selectedOption === 'Вход' ? (
        <LoginForm registrationSuccess={registrationSuccess} email={email} />
      ) : (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  )
}

export default AuthSegmentedControl
