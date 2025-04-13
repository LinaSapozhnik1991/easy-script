'use client'
import React, { useState } from 'react'

import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'
import useModalStore from '@/shared/Modal/model/useModalStore'
import OpenModalLogin from '@/features/open-modal-login/ui/OpenModalLogin'

import { cardDataListOne, cardDataListTwo } from '../constans/data'

import styles from './Advantage.module.scss'

const AdvantagesSection = () => {
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
    <section className={styles.advantagesSection}>
      <h2 className={styles.advantageTitle}>
        Сервис EasyScript поможет с легкостью решить
        <br /> самые частые проблемы в продажах
      </h2>

      <ul className={styles.cards}>
        {cardDataListOne.map((card, index) => (
          <li
            key={index}
            className={`${styles.card}  ${card.alt ? styles.cardTopItemRight : styles.cardTopItemLeft}`}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.description}>{card.description}</p>
            </div>
            <h4 className={styles.cardEnd}>{card.endText}</h4>
          </li>
        ))}
      </ul>

      <div className={styles.economy}>
        <div className={styles.economyText}>
          <h2 className={styles.economyTitle}>
            Сэкономьте время РОПа на создание скриптов, и он сосредоточится на
            главном — выполнение плана
          </h2>
          <hr />
          <div className={styles.dopInfo}>
            <p className={styles.dopIntoSmallText}>
              Тратите часы на написание и обновление скриптов вручную? Наш
              сервис упрощает процесс: удобный интерфейс, шаблоны и возможность
              совместной работы. Сосредоточьтесь на важном — мы позаботимся об
              остальном.
            </p>
            <p className={styles.dopInfoBigText}>
              Попробуйте бесплатно, а сэкономленное время используйте как Вам
              нравится!
            </p>
          </div>
        </div>
        <div className={styles.btn}>
          <OpenModalLogin size="mediumXL" openModal={handleOpenModal}>
            Попробовать бесплатно
          </OpenModalLogin>
        </div>
      </div>

      <ul className={`${styles.cards}`}>
        {cardDataListTwo.map((card, index) => (
          <li
            key={index}
            className={`${styles.card}   ${card.alt ? styles.cardItemRight : styles.cardItemLeft}`}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.description}>{card.description}</p>
            </div>
            <h4 className={styles.cardEnd}>{card.endText}</h4>
          </li>
        ))}
      </ul>

      <div className={styles.analyst}>
        <div className={styles.image}></div>
        <div className={styles.analystText}>
          <h2 className={styles.analystTitle}>
            Знайте, что работает, а что — нет
          </h2>
          <p className={styles.subtitle}>
            Анализируйте эффективность скриптов и улучшайте свои продажи
          </p>
          <hr />
          <div className={styles.dopIntoSmallText}>
            <p>
              Не знаете, какие фразы и подходы работают лучше? Наш сервис
              предоставляет подробную аналитику использования скриптов. Вы
              увидите, какие фразы приводят к успеху, а какие нужно улучшить, и
              сможете постоянно оптимизировать свои продажи.
            </p>
          </div>
          <div className={styles.dopInfoBigText}>
            <p>Начните анализировать и улучшать!</p>
          </div>
          <div className={styles.btn}>
            <OpenModalLogin primary size="mediumXL" openModal={handleOpenModal}>
              Попробовать бесплатно
            </OpenModalLogin>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvantagesSection
