import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation' // Импортируйте usePathname

import {
  Company,
  CreditCard,
  Files,
  Instruction,
  NextArrow,
  Prev
} from '@/shared/assets/icons'
import { Routers } from '@/shared/routes'

import styles from './Sidebar.module.scss'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname() // Получаем текущий путь

  const options = useMemo(
    () => [
      { title: 'Мои скрипты', icon: <Files />, path: Routers.MyScripts },
      { title: 'Моя компания', icon: <Company />, path: Routers.MyCompany },
      { title: 'Инструкция', icon: <Instruction />, path: Routers.Instruction },
      { title: 'Тариф и оплата', icon: <CreditCard />, path: Routers.Billing }
    ],
    []
  )

  const [selectedOption, setSelectedOption] = useState(options[0].title)

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen')
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState))
    }
  }, [])

  const toggleSidebar = () => {
    setIsOpen(prevState => {
      const newState = !prevState
      localStorage.setItem('sidebarOpen', JSON.stringify(newState))
      return newState
    })
  }
  const handleSelect = (option: string) => {
    const selectedOption = options.find(opt => opt.title === option)
    if (selectedOption) {
      setSelectedOption(selectedOption.title)
      router.push(selectedOption.path)
    }
  }
  useEffect(() => {
    const currentOption = options.find(opt => opt.path === pathname)
    if (currentOption) {
      setSelectedOption(currentOption.title)
    }
  }, [options, pathname])

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.optionsList}>
        {options.map(option => (
          <div
            className={`${styles.option} ${selectedOption === option.title ? styles.selected : ''}`}
            key={option.title}
            onClick={() => handleSelect(option.title)}>
            {option.icon}
            {isOpen && <span>{option.title}</span>}
          </div>
        ))}
      </div>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? (
          <>
            <Prev />
            <span>Свернуть</span>
          </>
        ) : (
          <NextArrow />
        )}
      </button>
    </div>
  )
}

export default Sidebar
