/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Slider from 'react-slick'

import { Checked, NextArrow, Prev } from '../../../shared/assets/icons'

import styles from './Feedback.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
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
      'Компания, занимающаяся проектированием наружного освещения, столкнулась с проблемами в продажах: длительные переговоры, низкая конверсия и отсутствие отдела продаж.',
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
      'Компания, занимающаяся проектированием наружного освещения Александр обратился с запросом на увеличение количества продаж. Команда не могла достичь плановых показателей, несмотря на хорошие общие результаты компании. Были выявлены проблемы: отсутствие структуры диалога, низкая эффективность работы с возражениями, низкая конверсия в переписке.',
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

const SampleNextArrow: React.FC<
  React.ComponentPropsWithoutRef<'div'>
> = props => {
  const { onClick } = props
  return (
    <div className={styles.nextArrow} onClick={onClick}>
      <NextArrow />
    </div>
  )
}

const SamplePrevArrow: React.FC<
  React.ComponentPropsWithoutRef<'div'>
> = props => {
  const { onClick } = props
  return (
    <div className={styles.prevArrow} onClick={onClick}>
      <Prev />
    </div>
  )
}

const FeedbackSection: React.FC = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [currentTimes, setCurrentTimes] = useState<number[]>(
    Array(reviews.length).fill(0)
  )
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = (index: number) => {
    setPlayingIndex(index)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleCurrentTimeChange = (index: number, time: number) => {
    const newTimes = [...currentTimes]
    newTimes[index] = time
    setCurrentTimes(newTimes)
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current: number, next: number) => {
      setPlayingIndex(null)
    }
  }

  return (
    <div className={styles.sliderContainer}>
      <h2 className={styles.feedbackTitle}>Отзывы о работе с EasyScript</h2>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className={styles.review}>
            <div className={styles.feedback}>
              <div className={styles.feedbackContent}>
                <p className={styles.director}>{review.director}</p>
                <p className={styles.name}> {review.name} </p>
                <p className={styles.issues}>{review.issues}</p>

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
                  imageSrc={review.imageSrc}
                  isPlaying={playingIndex === index}
                  onPlay={() => handlePlay(index)}
                  onPause={handlePause}
                  currentTime={currentTimes[index]}
                  setCurrentTime={time => handleCurrentTimeChange(index, time)}
                />
              </div>
            </div>
            <h3 className={styles.resultTitle}>
              Клиент получил следующие результаты:
            </h3>
            <div className={styles.results}>
              {review.results.map((result, i) => (
                <div className={styles.result} key={i}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default FeedbackSection
