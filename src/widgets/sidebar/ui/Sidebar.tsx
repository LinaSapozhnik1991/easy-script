import React, { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Analyst,
  Company,
  CreditCard,
  Files,
  Instruction,
  NextArrow,
  Prev
} from '@/shared/assets/icons'
import { Routers } from '@/shared/routes'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname()

  const options = useMemo(
    () => [
      { title: 'Мои скрипты', icon: <Files />, path: Routers.MyScripts },
      { title: 'Моя компания', icon: <Company />, path: Routers.MyCompany },
      { title: 'Аналитика', icon: <Analyst />, path: Routers.Dashboard },
      { title: 'Инструкция', icon: <Instruction />, path: Routers.Instruction },
      { title: 'Тариф и оплата', icon: <CreditCard />, path: Routers.Billing }
    ],
    []
  )

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    const currentOption = options.find(opt => opt.path === pathname)
    if (currentOption) {
      setSelectedOption(currentOption.title)
    }
  }, [options, pathname])

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <nav>
        <ul className={styles.optionsList}>
          {options.map(option => (
            <li
              key={option.title}
              className={`${styles.option} ${selectedOption === option.title ? styles.selected : ''}`}>
              <Link
                href={option.path}
                onClick={() => setSelectedOption(option.title)}>
                {option.icon}
                {isOpen && <span>{option.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
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
