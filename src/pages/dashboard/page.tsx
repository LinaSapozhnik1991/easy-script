'use client'

import React from 'react'
import Image from 'next/image'

import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.dashboardAnalyst}>
          <p>Здесь обязательно будет аналитика</p>
          <Image
            src="/Worked.jpg"
            alt="Описание изображения"
            width={500}
            height={300}
            className={styles.dashboardImage}
          />
        </div>
      </div>
    </>
  )
}

export default Dashboard
