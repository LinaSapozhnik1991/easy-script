import React, { useState } from 'react'

import OpenModalLogin from '@/features/open-modal-login/ui/OpenModalLogin'
import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'
import useModalStore from '@/shared/Modal/model/useModalStore'

import styles from './AnalystFeature.module.scss'

const AnalystFeatureSection = () => {
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
    <div className={styles.analyst}>
      <div className={styles.image}></div>
      <div className={styles.analystText}>
        <h2 className={styles.analystTitle}>
          Знайте, что работает, а что — нет
        </h2>
        <p className={styles.subtitle}>
          Анализируйте эффективность скриптов и улучшайте свои продажи
        </p>
        <div className={styles.line}></div>

        <div className={styles.dopIntoSmallText}>
          Не знаете, какие фразы и подходы работают лучше? Наш сервис
          предоставляет подробную аналитику использования скриптов. Вы увидите,
          какие фразы приводят к успеху, а какие нужно улучшить, и сможете
          постоянно оптимизировать свои продажи
        </div>

        <div className={styles.dopInfoBigText}>
          Начните анализировать и улучшать!
        </div>

        <div className={styles.btn}>
          <OpenModalLogin openModal={handleOpenModal} primary size="mediumXL">
            Попробовать бесплатно{' '}
          </OpenModalLogin>
        </div>
      </div>
    </div>
  )
}

export default AnalystFeatureSection
