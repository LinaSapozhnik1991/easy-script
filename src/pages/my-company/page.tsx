'use  client'
import React from 'react'
import Image from 'next/image'

import styles from './MyCompany.module.scss'

const MyCompany = () => {
  return (
    <div className={styles.myCompany}>
      <table className={styles.allCompany}>
        <Image
          src="/Worked.jpg"
          alt="Описание изображения"
          width={700}
          height={400}
          className={styles.dashboardImage}
        />
      </table>
    </div>
  )
}

export default MyCompany
