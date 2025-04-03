/* eslint-disable no-console */
import React, { useState } from 'react'

import OpenModalLogin from '@/features/open-modal-login/ui/OpenModalLogin'
import useModalStore from '@/shared/Modal/model/useModalStore'
import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'

import { Logo } from '../../../shared/assets/icons'

import styles from './MainSection.module.scss'
const MainSection = () => {
  const { openModal } = useModalStore()
  const [selectedOption, setSelectedOption] = useState('Регистрация')

  const handleOpenModal = () => {
    openModal(
      <AuthSegmentedControl
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
      />
    )
  }
  return (
    <section className={styles.main}>
      <div className={styles.mainHead}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.mainText}>
          <div className={styles.mainText_name}>
            <p className={styles.easyScript}>EasyScript</p>
            <p className={styles.dopText}>
              Создайте скрипт с эффектом живой беседы
            </p>
          </div>

          <div className={styles.quoteContainer}>
            <blockquote className={styles.quote}>
              По опыту компаний из пятидесяти разных ниш, с которыми я работал,
              правильно внедрённые скрипты помогают повысить конверсию в среднем
              на 35%.
            </blockquote>
            <cite className={styles.autor}>
              Алексей Гичко
              <br />
              скриптолог, тренер отделов продаж
            </cite>
          </div>
        </div>
      </div>
      <div className={styles.btn}>
        <OpenModalLogin openModal={handleOpenModal} primary size="mediumXXL">
          Попробовать бесплатно
        </OpenModalLogin>
      </div>
    </section>
  )
}

export default MainSection
