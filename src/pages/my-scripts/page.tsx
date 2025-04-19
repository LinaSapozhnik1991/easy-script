'use client'
import React from 'react'
import Image from 'next/image'

import styles from './MyScripts.module.scss'

const MyScripts = () => {
  return (
    <div className={styles.myScripts}>
      <p>Здесь будут ваши скрипты</p>
      <table className={styles.allScripts}>
        <Image
          src="/lenivec.jpg"
          alt="Описание изображения"
          width={700}
          height={450}
          className={styles.dashboardImage}
        />
      </table>
    </div>
  )
}

export default MyScripts
