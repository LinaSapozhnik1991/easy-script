import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import cx from 'classnames'

import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large' | 'mediumXL' | 'mediumXXL' | 'smallXL'
  label?: string
  onClick?: () => void
  as?: React.ElementType
  href?: string
  children?: ReactNode
  primaryBorder?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  primary = false,
  disabled = false,
  primaryBorder = false,
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
      [styles.medium]: size === 'medium',
      [styles.large]: size === 'large',
      [styles.mediumXL]: size === 'mediumXL',
      [styles.mediumXXL]: size === 'mediumXXL',
      [styles.smallXL]: size === 'smallXL',
      [styles.primary]: primary,
      [styles.disabled]: disabled,
      [styles.primaryBorder]: primaryBorder,
      [styles.default]: !primary
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
