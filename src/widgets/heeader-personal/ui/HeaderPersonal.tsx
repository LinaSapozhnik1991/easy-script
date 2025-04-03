import React from 'react'

import { Down, Logo, UserPhoto } from '@/shared/assets/icons'

import styles from './HeaderPersonal.module.scss'

const HeaderPersonal = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.user}>
        <span> юзер</span>
        <UserPhoto />
        <Down />
      </div>
    </header>
  )
}

export default HeaderPersonal
