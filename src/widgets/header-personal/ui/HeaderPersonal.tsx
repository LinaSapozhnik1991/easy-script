/* eslint-disable no-console */
import React from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { Down, Logo, Person, Up } from '@/shared/assets/icons'
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
  setUserName: React.Dispatch<React.SetStateAction<string>>
}

const HeaderPersonal: React.FC<HeaderPersonalProps> = ({
  user,
  setUserName
}) => {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(Routers.UserProfile)
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
          label={<UserProfileComponent user={user} setUserName={setUserName} />}
          iconClose={<Up />}
          iconOpen={<Down />}
          items={[
            {
              content: (
                <span
                  className={styles.userOptionProfile}
                  onClick={handleProfileClick}>
                  Профиль <Person />
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
