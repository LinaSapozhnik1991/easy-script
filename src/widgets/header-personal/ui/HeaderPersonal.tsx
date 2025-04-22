/* eslint-disable no-console */
import React from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { Logo, UserAvatar } from '@/shared/assets/icons'
import UserProfileComponent, {
  User
} from '@/entities/user-profile/ui/UserProfile'
import { Accordion } from '@/shared/ui/Accordion/Accordion'
import LogoutButton from '@/features/logout/ui/Logout'
import { logoutUser } from '@/features/logout/api'
import { Routers } from '@/shared/routes'

import styles from './HeaderPersonal.module.scss'
interface HeaderPersonalProps {
  user: User
}
const HeaderPersonal: React.FC<HeaderPersonalProps> = ({ user }) => {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push('/user-profile')
  }
  const handleLogout = async () => {
    try {
      await logoutUser()
      Cookies.remove('token')
      router.push(Routers.EasyScript)
    } catch (error) {
      console.error('Ошибка сети:', error)
    }
  }
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.userAccordion}>
        <Accordion
          mode="bordered"
          label={<UserProfileComponent user={user} />}
          items={[
            {
              content: (
                <span
                  className={styles.userOptionProfile}
                  onClick={handleProfileClick}>
                  Профиль <UserAvatar />
                </span>
              )
            },
            {
              content: <LogoutButton onLogout={handleLogout} />
            }
          ]}
        />
      </div>
    </header>
  )
}

export default HeaderPersonal
