import React, { useEffect, useState } from 'react'

import { CaretUp } from '../../assets/icons'

import styles from './ScrollUp.module.scss'

const ScrollUp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    isVisible && (
      <button
        className={styles.CaretUp}
        onClick={scrollToTop}
        type="button"
        aria-label="Scroll to top"
        role="button">
        <CaretUp />
      </button>
    )
  )
}

export default ScrollUp
