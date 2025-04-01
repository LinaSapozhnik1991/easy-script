import React from 'react'

import { Logo } from '@/shared/assets/icons'

import styles from './HeaderPersonal.module.scss'

const HeaderPersonal = () => {
  return (
    <header className={styles.heder}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.user}>юзер</div>
    </header>
  )
}

export default HeaderPersonal
