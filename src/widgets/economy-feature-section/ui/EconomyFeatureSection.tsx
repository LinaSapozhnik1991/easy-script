import React, { useState } from 'react'

import styles from './EconomyFeature.module.scss'
import OpenModalLogin from '@/features/open-modal-login/ui/OpenModalLogin'
import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'
import useModalStore from '@/shared/Modal/model/useModalStore'

const EconomyFeatureSection = () => {
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
    <div className={styles.economy}>
      <div className={styles.economyText}>
        <h2 className={styles.economyTitle}>
          Сэкономьте время РОПа на создание скриптов, и он сосредоточится на
          главном — выполнение плана
        </h2>
        <div className={styles.line}></div>
        <div className={styles.dopInfo}>
          <div className={styles.dopIntoSmallText}>
            Тратите часы на написание и обновление скриптов вручную? Наш сервис
            упрощает процесс: удобный интерфейс, шаблоны и возможность
            совместной работы. <br /> Сосредоточьтесь на важном — мы позаботимся
            об остальном.
          </div>
          <div className={styles.dopInfoBigText}>
            Попробуйте бесплатно, а сэкономленное время используйте, как Вам
            нравится!
          </div>
        </div>
      </div>
      <div className={styles.btn}>
        <OpenModalLogin size="mediumXL" openModal={handleOpenModal}>
          Попробовать бесплатно
        </OpenModalLogin>
      </div>
    </div>
  )
}

export default EconomyFeatureSection
