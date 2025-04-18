import React, { FC } from 'react'

import { UserAvatar } from '@/shared/assets/icons'

import styles from './UserProfile.module.scss'

export interface User {
  id: string
  name: string
  email: string
  phone: string
}

export interface UserProfileProps {
  user: User
}

const UserProfileComponent: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className={styles.userProfile}>
      <UserAvatar />
      <div className={styles.userPersonal}>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  )
}
export default UserProfileComponent
