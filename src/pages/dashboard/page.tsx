'use client'

import React from 'react'

import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.dashboardAnalyst}>
          <h2>Здесь обязательно будет аналитика</h2>
        </div>
      </div>
    </>
  )
}

export default Dashboard
