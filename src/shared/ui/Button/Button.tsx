import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import cx from 'classnames'

import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  primary?: boolean
  exitStyle?: boolean
  noBorderScript?: boolean
  backgroundColor?: string
  borderMedium?: boolean
  scriptStyle?: boolean
  size?:
    | 'small'
    | 'smallClient'
    | 'smallOperator'
    | 'medium'
    | 'mediumScript'
    | 'mediumConstructor'
    | 'large'
    | 'largeScript'
    | 'mediumXL'
    | 'mediumXXL'
    | 'smallXL'
    | 'largeMode'
  label?: string
  onClick?: () => void
  as?: React.ElementType
  href?: string
  children?: ReactNode
  primaryBorder?: boolean
  clear?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  primary = false,
  disabled = false,
  exitStyle = false,
  scriptStyle = false,
  noBorderScript = false,
  primaryBorder = false,
  borderMedium = false,
  clear = false,
  size = 'medium',
  onClick,
  href,
  children,
  as: Component = 'button',
  ...props
}) => {
  const buttonClass = cx([
    styles.button,
    {
      [styles.small]: size === 'small',
      [styles.smallClient]: size === 'smallClient',
      [styles.smallOperator]: size === 'smallOperator',
      [styles.medium]: size === 'medium',
      [styles.large]: size === 'large',
      [styles.mediumXL]: size === 'mediumXL',
      [styles.mediumConstructor]: size === 'mediumConstructor',
      [styles.mediumXXL]: size === 'mediumXXL',
      [styles.smallXL]: size === 'smallXL',
      [styles.mediumScript]: size === 'mediumScript',
      [styles.largeScript]: size === 'largeScript',
      [styles.largeMode]: size === 'largeMode',
      [styles.primary]: primary,
      [styles.disabled]: disabled,
      [styles.primaryBorder]: primaryBorder,
      [styles.default]: !primary,
      [styles.exitStyle]: exitStyle,
      [styles.scriptStyle]: scriptStyle,
      [styles.borderMedium]: borderMedium,
      [styles.clear]: clear,
      [styles.noBorderScript]: noBorderScript
    }
  ])
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    if (onClick) {
      onClick()
    }
  }
  return (
    <Component
      className={buttonClass}
      disabled={disabled}
      onClick={handleClick}
      href={Component === 'a' ? href : undefined}
      {...props}>
      {children}
    </Component>
  )
}
