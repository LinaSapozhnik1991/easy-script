'use client'

import React from 'react'

import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.dashboardAnalyst}>
          <p>Здесь обязательно будет аналитика</p>
        </div>
      </div>
    </>
  )
}

export default Dashboard
