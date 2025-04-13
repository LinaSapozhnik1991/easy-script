import React from 'react'

import { Down, Logo } from '@/shared/assets/icons'
import UserProfileComponent, {
  User
} from '@/entities/user-profile/ui/UserProfile'

import styles from './HeaderPersonal.module.scss'
interface HeaderPersonalProps {
  user: User
}
const HeaderPersonal: React.FC<HeaderPersonalProps> = ({ user }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.user}>
        <UserProfileComponent user={user} />
        <button type="button">
          <Down />
        </button>
      </div>
    </header>
  )
}

export default HeaderPersonal
