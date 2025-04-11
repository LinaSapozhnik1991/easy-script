import React from 'react'

import { Down, Logo, UserAvatar } from '@/shared/assets/icons'
import UserProfile from '@/entities/user-profile'

import styles from './HeaderPersonal.module.scss'
interface HeaderPersonalProps {
  user: {
    name: string
  }
}
const HeaderPersonal: React.FC<HeaderPersonalProps> = ({ user }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.user}>
        <UserProfile user={user || { name: 'Юзер' }} />
        <span>{user?.name || 'Юзер'}</span>
        <UserAvatar />
        <Down />
      </div>
    </header>
  )
}

export default HeaderPersonal
