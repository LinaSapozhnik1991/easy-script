import React, { FC } from 'react'

import ResendEmail from '@/features/resend-email/ui/ResendEmail'

import styles from './Verification.module.scss'
type VerificationProps = {
  email: string
  onClose: () => void
}

const Verification: FC<VerificationProps> = ({ email }) => {
  return (
    <div className={styles.verificationWrapper}>
      <h2 className={styles.head}>Верификация электронной почты</h2>
      <div className={styles.horizontalLine}></div>
      <div className={styles.content}>
        <p>
          Мы отправили письмо на почту{' '}
          <a href={`mailto:${email}`} className={styles.link}>
            {email}
          </a>
          , перейдите по ссылке из письма, чтобы завершить процедуру
          регистрации.
        </p>
        <ResendEmail />
      </div>
    </div>
  )
}

export default Verification
