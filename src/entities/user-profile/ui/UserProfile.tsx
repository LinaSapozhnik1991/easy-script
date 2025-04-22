import React, { FC } from 'react'

import { UserAvatar } from '@/shared/assets/icons'

import styles from './UserProfileComponent.module.scss'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  telegram: string
  company: string
}

export interface UserProfileProps {
  user: User
}

const UserProfileComponent: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className={styles.userProfile}>
      <UserAvatar />
      <div className={styles.userPersonal}>
        <p className={styles.name}>{user.name}</p>
        <p className={styles.email}>{user.email}</p>
      </div>
    </div>
  )
}
export default UserProfileComponent
