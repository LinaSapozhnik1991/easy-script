'use client'
import React from 'react'
import styles from './MyScripts.module.scss'
import Image from 'next/image'

const MyScripts = () => {
  return (
    <div className={styles.myScripts}>
      <table className={styles.allScripts}>
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

export default MyScripts
