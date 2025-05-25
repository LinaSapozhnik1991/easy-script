'use  client'
import React from 'react'

import styles from './MyCompany.module.scss'

const MyCompany = () => {
  return (
    <div className={styles.myCompany}>
      <div className={styles.allCompany}>
        <h2>Здесь будет список компаний</h2>
      </div>
    </div>
  )
}

export default MyCompany
