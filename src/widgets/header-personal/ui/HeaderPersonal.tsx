import React from 'react'

import { Logo } from '@/shared/assets/icons'
import UserProfileComponent, {
  User
} from '@/entities/user-profile/ui/UserProfile'
import { Accordion } from '@/shared/ui/Accordion/Accordion'

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

      <div className={styles.userAccordion}>
        <Accordion
          mode="bordered"
          label={<UserProfileComponent user={user} />}
          items={[{ content: 'Профиль' }, { content: 'Выйти' }]}
        />
      </div>
    </header>
  )
}

export default HeaderPersonal
