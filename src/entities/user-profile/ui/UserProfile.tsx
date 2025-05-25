import React, { FC } from 'react'

import { UserAvatar } from '@/shared/assets/icons'
import { Company } from '@/entities/company'

import styles from './UserProfileComponent.module.scss'

export interface User {
  id?: string
  name: string
  email: string
  phone: string
  whatsapp?: string
  telegram?: string
  company?: string
  companies?: Company[]
  currentCompany?: Company | null
}

export interface UserProfileProps {
  user: User
  setUserName: (newName: string) => void
}

const UserProfileComponent: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className={styles.userProfile}>
      <UserAvatar />
      <div className={styles.userPersonal}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
    </div>
  )
}
export default UserProfileComponent
