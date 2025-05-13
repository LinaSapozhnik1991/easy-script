'use  client'
import React from 'react'

import styles from './MyCompany.module.scss'

const MyCompany = () => {
  return (
    <div className={styles.myCompany}>
      <table className={styles.allCompany}>
        <h2>Здесь будет список компаний</h2>
      </table>
    </div>
  )
}

export default MyCompany
