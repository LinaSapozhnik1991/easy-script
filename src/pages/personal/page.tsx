import React from 'react'

import HeaderPersonal from '@/widgets/heeader-personal/ui/HeaderPersonal'

import styles from './PersonalAccount.module.scss'
import FooterMain from '@/widgets/footerMain'

const Personal = () => {
  return (
    <>
      <HeaderPersonal />
      <div className={styles.personal}>
        <div className={styles.personalCompany}>
          <p>Добро пожаловать</p>
        </div>
      </div>
      <FooterMain showLinks={true} />
    </>
  )
}

export default Personal
