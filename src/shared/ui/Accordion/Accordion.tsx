import React, { useState, FC, HTMLAttributes } from 'react'
import cx from 'classnames'

import { Button } from '../Button'

import styles from './Accordion.module.scss'

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem
  label: React.ReactNode
  className?: string
  disabled?: boolean
  mode: 'bordered' | 'filled' | 'clear'
  iconOpen?: React.ReactNode
  iconClose?: React.ReactNode
}

type AccordionItem = {
  content: React.ReactNode
  disabled?: boolean
}[]

const accordionListHeight = {
  open: 60,
  close: 0
}

const accordionMaxElements = 4

export const Accordion: FC<AccordionProps> = ({
  items,
  label,
  className,
  disabled,
  mode,
  iconOpen,
  iconClose,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const accordionClass = cx([
    styles.accordion,
    isOpen && styles.open,
    {
      [styles.borderedOpen]: mode === 'bordered' && isOpen,
      [styles.filledOpen]: mode === 'filled' && isOpen,
      [styles.clearOpen]: mode === 'clear' && isOpen,
      [styles.bordered]: mode === 'bordered',
      [styles.filled]: mode === 'filled',
      [styles.clear]: mode === 'clear'
    },
    className
  ])

  const accordionListClass = cx([
    styles.accordionList,
    items.length > accordionMaxElements ? styles.accordionListOverflow : '',
    isOpen ? styles.accordionListOpen : styles.accordionListClosed
  ])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={accordionClass} {...props}>
      <Button
        onClick={handleClick}
        className={styles.accordionBtn}
        type="button"
        disabled={disabled}>
        {label}
        {isOpen ? (
          iconClose && React.isValidElement(iconClose) ? (
            <span className={styles.icon}>{React.cloneElement(iconClose)}</span> // Оборачиваем в span
          ) : null
        ) : iconOpen && React.isValidElement(iconOpen) ? (
          <span className={styles.icon}>{React.cloneElement(iconOpen)}</span> // Оборачиваем в span
        ) : null}
      </Button>

      <ul
        className={accordionListClass}
        style={{
          height: isOpen
            ? accordionListHeight.open * items.length
            : accordionListHeight.close
        }}>
        {items.map((item, index) => (
          <li key={index} className={styles.accordionItem}>
            <Button type="button" disabled={item.disabled}>
              {item.content}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
