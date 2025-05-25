'use client'

import React from 'react'

import styles from './Billing.module.scss'

const Billing: React.FC = () => {
  return (
    <>
      <div className={styles.billingPage}>
        <div className={styles.billingContent}>
          <h2>Здесь обязательно будут указаны ваши тарифы и оплата</h2>
        </div>
      </div>
    </>
  )
}

export default Billing
