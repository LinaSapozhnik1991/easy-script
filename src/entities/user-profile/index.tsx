import React, { FC } from 'react'

import { UserAvatar } from '@/shared/assets/icons'

export interface User {
  name: string
  email: string
  phone: string
}

interface UserProfileProps {
  user: User
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <UserAvatar />
    </div>
  )
}

export default UserProfile
