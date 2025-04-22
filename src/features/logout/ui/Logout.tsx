import React from 'react'

import { Logout } from '@/shared/assets/icons'

import styles from './Logout.module.scss'
interface LogoutButtonProps {
  onLogout: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <span onClick={onLogout} className={styles.logoutButton}>
      Выйти из аккаунта <Logout />
    </span>
  )
}

export default LogoutButton
