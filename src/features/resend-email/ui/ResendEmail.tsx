import React from 'react'

import styles from './ResendEmail.module.scss'

const ResendEmail = () => {
  return (
    <p className={styles.resent}>
      Не получили письмо?{' '}
      <a href="#" className={styles.linkResent}>
        Отправить повторно
      </a>
    </p>
  )
}

export default ResendEmail
