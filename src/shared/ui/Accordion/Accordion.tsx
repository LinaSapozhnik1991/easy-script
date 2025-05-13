import React, { useState, FC, HTMLAttributes, useRef, useEffect } from 'react'
import cx from 'classnames'

import { Button } from '../Button'

import styles from './Accordion.module.scss'

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: AccordionItem
  label: React.ReactNode
  className?: string
  disabled?: boolean
  mode: 'bordered' | 'filled' | 'clear'
  iconOpen?: React.ReactNode
  iconClose?: React.ReactNode
  onSelect?: (selectedId: string) => void
  errorClassName?: string
}

type AccordionItem = {
  id?: string
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
  errorClassName,
  disabled,
  mode,
  iconOpen,
  iconClose,
  onSelect,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const accordionRef = useRef<HTMLDivElement | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const accordionClass = cx([
    styles.accordion,
    isOpen && styles.open,
    {
      [styles.borderedOpen]: mode === 'bordered' && isOpen,
      [styles.filledOpen]: mode === 'filled' && isOpen,
      [styles.clearOpen]: mode === 'clear' && isOpen,
      [styles.bordered]: mode === 'bordered',
      [styles.filled]: mode === 'filled',
      [styles.clear]: mode === 'clear',
      [styles.errorClassName]: errorClassName
    },
    className
  ])

  const accordionListClass = cx([
    styles.accordionList,
    items.length > accordionMaxElements ? styles.accordionListOverflow : '',
    isOpen ? styles.accordionListOpen : styles.accordionListClosed
  ])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      accordionRef.current &&
      !accordionRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (id: string) => {
    setSelectedId(id)
    if (onSelect) {
      onSelect(id)
    }
    setIsOpen(false)
  }

  return (
    <div className={accordionClass} ref={accordionRef} {...props}>
      <Button
        onClick={handleClick}
        className={styles.accordionBtn}
        type="button"
        disabled={disabled}>
        {label}
        {isOpen ? (
          iconClose && React.isValidElement(iconClose) ? (
            <span className={styles.icon}>{React.cloneElement(iconClose)}</span>
          ) : null
        ) : iconOpen && React.isValidElement(iconOpen) ? (
          <span className={styles.icon}>{React.cloneElement(iconOpen)}</span>
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
          <li
            key={index}
            className={cx(styles.accordionItem, {
              [styles.selected]: selectedId === item.id
            })}>
            <Button
              type="button"
              onClick={() => {
                if (item.id) {
                  handleItemClick(item.id)
                }
              }}
              disabled={item.disabled}>
              <div>{item.content}</div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
