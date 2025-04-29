import { FC, Fragment, HTMLAttributes, ReactNode, useState } from 'react'
import cx from 'classnames'
import { Button } from '../Button'
import { Down } from '@/shared/assets/icons'

import styles from './Dropdown.module.scss'

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  items: DropdownItem
  className?: string
  disabled?: boolean
  mode: 'bordered' | 'filled' | 'clear'
  separator?: boolean
}

type DropdownItem = {
  content: React.ReactNode
  disabled?: boolean
  link?: string
}[]

const dropdownListHeight = {
  open: 60,
  close: 0
}

const dropdownMaxElements = 4

export const Dropdown: FC<DropdownProps> = ({
  items,
  label,
  className,
  disabled,
  mode,
  separator,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const dropdownClass = cx([
    styles.dropdown,
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

  const dropdownListClass = cx([
    styles.dropdownList,
    items.length > dropdownMaxElements ? styles.dropdownListOverflow : '',
    isOpen ? styles.dropdownListOpen : styles.dropdownListClosed
  ])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={dropdownClass} {...props}>
      <Button
        onClick={handleClick}
        className={styles.dropdownBtn}
        type="button"
        disabled={disabled}>
        {label}
        <Down className={isOpen ? styles.openSvg : styles.closeSvg} />
      </Button>

      <ul
        className={dropdownListClass}
        style={{
          height: isOpen
            ? dropdownListHeight.open * items.length
            : dropdownListHeight.close
        }}>
        {items.map((item, index) => (
          <Fragment key={index}>
            <li
              className={styles.dropdownItem}
              style={{ paddingBottom: separator ? 0 : 4 }}>
              <Button type="button" disabled={item.disabled} href={item.link}>
                {item.content} {item.link}
              </Button>
            </li>

            {separator && index < items.length - 1 && (
              <hr className={styles.dropdownSeparator} />
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
