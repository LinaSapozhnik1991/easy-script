/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line import/order
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'

import { Checked, NextArrow, Prev } from '../../../shared/assets/icons'

import styles from './Feedback.module.scss'
import VideoPlayer from './VideoPlayer'

interface ReviewProps {
  director: string
  name: string
  issues: string
  successFactors: string[]
  results: string[]
  videoSrc: string
  imageSrc: string
}

const reviews: ReviewProps[] = [
  {
    director: 'Генеральный директор ООО “Мунлайт”',
    name: 'Роман Владимирович',
    issues:
      'Компания, занимающаяся проектированием наружного освещения, столкнулась с проблемами в продажах: длительные переговоры, низкая конверсия и отсутствие отдела продаж. Генеральный директор Роман Владимирович обратился за помощью, чтобы улучшить процессы продаж.',
    successFactors: [
      ' Четкая структура скрипта',
      ' Эффективная работа с возражениями',
      ' Обучение и поддержка, обеспечившие долгосрочный результат'
    ],
    results: [
      'Общая конверсия по всем направлениям выросла на 84%',
      'Конверсия заявок по действующим клиентам выросла с 5% до 50%',
      'Конверсия из нового контакта в заявку увеличилась на 40%',
      'Цикл сделки сократился на две трети'
    ],
    videoSrc: '/Благодарность от Мунлайт.webm',
    imageSrc: '/mun.png'
  },
  {
    director: 'Совладелец онлайн-школы рисования NY SCHOOL',
    name: 'Александр',
    issues:
      ' Александр обратился с запросом на увеличение количества продаж. Команда не могла достичь плановых показателей, несмотря на хорошие общие результаты компании. Были выявлены проблемы: отсутствие структуры диалога, низкая эффективность работы с возражениями, низкая конверсия в переписке.',
    successFactors: [
      ' Четкая структура скрипта',
      ' Эффективная работа с возражениями',
      ' Обучение и поддержка, обеспечившие долгосрочный результат'
    ],
    results: [
      'Конверсия входящих заявок выросла, а среднее время звонка сократилось вдвое',
      'Доход менеджеров увеличился',
      'Количество “игноров” в переписке сократилось на треть',
      'Клиенты стали чаще принимать решения сразу'
    ],
    videoSrc: '/IMG_1413.webm',
    imageSrc: '/ny.png'
  }
]

interface ArrowProps {
  onClick: () => void
}

const SampleNextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      className={styles.nextArrow}
      onClick={onClick}
      aria-label="Next"
      onFocus={handleFocus}
      role="button"
      tabIndex={0}
      type="button">
      <NextArrow />
    </button>
  )
}

const SamplePrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      className={styles.prevArrow}
      onClick={onClick}
      onFocus={handleFocus}
      aria-label="Previous"
      role="button"
      type="button"
      tabIndex={0}>
      <Prev />
    </button>
  )
}
const handleFocus = () => {
  console.log('Next button focused')
  setTimeout(() => {
    console.log('Current focused element:', document.activeElement)
  }, 0)
}
const FeedbackSection: React.FC = () => {
  const swiperRef = useRef<SwiperRef | null>(null)
  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext() // Используйте swiper для доступа к методам
    }
  }

  const handlePrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev() // Используйте swiper для доступа к методам
    }
  }

  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [currentTimes, setCurrentTimes] = useState<number[]>(
    Array(reviews.length).fill(0)
  )
  const [isMobile, setIsMobile] = useState(false)
  const [imageSrc, setImageSrc] = useState<string[]>(
    reviews.map(review => review.imageSrc)
  )

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 375
      setIsMobile(mobile)
      const updatedImageSrc = reviews.map(review =>
        mobile ? `/mobile/${review.imageSrc}` : review.imageSrc
      )
      setImageSrc(updatedImageSrc)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePlay = (index: number) => {
    setPlayingIndex(index)
  }

  const handlePause = () => {
    setPlayingIndex(null)
  }

  const handleCurrentTimeChange = (index: number, time: number) => {
    const newTimes = [...currentTimes]
    newTimes[index] = time
    setCurrentTimes(newTimes)
  }

  return (
    <div className={styles.sliderContainer}>
      <h2 className={styles.feedbackTitle}>Отзывы о работе с EasyScript</h2>
      <SamplePrevArrow onClick={handlePrevSlide} />
      <SampleNextArrow onClick={handleNextSlide} />
      <Swiper
        ref={swiperRef}
        loop={true}
        navigation={{
          nextEl: '.nextArrow',
          prevEl: '.prevArrow'
        }}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={swiper => handlePause()}>
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className={styles.review}>
            <div className={styles.feedback}>
              <div className={styles.feedbackUser}>
                <p className={styles.director}>{review.director}</p>
                <p className={styles.name}>{review.name}</p>
                <p className={styles.issues}>{review.issues}</p>
              </div>
              <div className={styles.succed}>
                <h3 className={styles.success}>
                  Благодаря ключевым факторам успеха:
                </h3>
                <ul className={styles.successList}>
                  {review.successFactors.map((factor, i) => (
                    <li className={styles.successLink} key={i}>
                      <Checked />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.videoContainers}>
                <VideoPlayer
                  videoSrc={review.videoSrc}
                  imageSrc={imageSrc[index]}
                  isPlaying={playingIndex === index}
                  onPlay={() => handlePlay(index)}
                  onPause={handlePause}
                  currentTime={currentTimes[index]}
                  setCurrentTime={time => handleCurrentTimeChange(index, time)}
                />
              </div>
            </div>
            <h3 className={styles.resultTitle}>
              Клиент получил следующие результаты
            </h3>
            <div className={styles.results}>
              {review.results.map((result, i) => (
                <div className={styles.result} key={i}>
                  {result}
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {isMobile && (
        <div className={styles.nextSlideContainer}>
          <div className={styles.nextSlideText}>Следующий отзыв</div>
        </div>
      )}
    </div>
  )
}

export default FeedbackSection
