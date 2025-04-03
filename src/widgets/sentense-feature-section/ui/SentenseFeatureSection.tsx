import React, { useState } from 'react'

import OpenModalLogin from '@/features/open-modal-login/ui/OpenModalLogin'
import useModalStore from '@/shared/Modal/model/useModalStore'
import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'

import styles from './SentenseFeature.module.scss'

const SentenseFeatureSection = () => {
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
    <div className={styles.sentense}>
      <div className={styles.sentenseHead}>
        <h2 className={styles.sentenseTitle}>
          Хотите получить максимальный результат?
        </h2>
        <p className={styles.dopInfo}>
          Оформите годовую подписку и получите в подарок бонус от автора сервиса
          Алексея Гичко, специалиста-скриптолога, тренера отдела продаж со
          стажем более 20 лет
        </p>
      </div>
      <div className={styles.line}></div>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardAudit}`}>
          <h5 className={styles.cardTitle}>Аудит Ваших продаж</h5>
        </div>
        <div className={`${styles.card} ${styles.cardGuide}`}>
          <h5 className={styles.cardTitle}>
            Гайд «Семь неочевидных точек роста отдела продаж»
          </h5>
        </div>
        <div className={` ${styles.cardConsult} ${styles.card}`}>
          <h5 className={styles.cardTitle}>
            Пять консультаций по разработке ваших скриптов
          </h5>
        </div>
      </div>
      <OpenModalLogin openModal={handleOpenModal} primary size="smallXL">
        Отправить заявку
      </OpenModalLogin>
    </div>
  )
}

export default SentenseFeatureSection
