import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'

import styles from './SegmentedControl.module.scss'

export interface Option {
  title: string
  icon?: React.ReactNode
}
interface SegmentedControlProps {
  label?: string
  options: Option[]
  onSelect: (option: string) => void
  size?: 'large' | 'medium' | 'small' | 'xs'
  disabled?: boolean
  variant: 'line' | 'on'
  defaultSelected?: string
  orientation?: 'horizontal' | 'vertical'
  [key: string]: unknown
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  label,
  options,
  onSelect,
  size = 'medium',
  disabled = false,
  variant,
  defaultSelected,
  orientation = 'horizontal',
  ...props
}) => {
  const [selected, setSelected] = useState(
    defaultSelected || (options.length > 0 ? options[0].title : '')
  )

  const [underlinePosition, setUnderlinePosition] = useState(0)
  const segmentedControlRef = useRef<HTMLDivElement | null>(null)
  const [optionWidths, setOptionWidths] = useState<number[]>([])
  const [optionHeights, setOptionHeights] = useState<number[]>([])

  useEffect(() => {
    const selectedIndex = options.findIndex(option => option.title === selected)
    if (selectedIndex !== -1) {
      setUnderlinePosition(selectedIndex)
    }
  }, [selected, options])

  useEffect(() => {
    if (segmentedControlRef.current) {
      const widths = Array.from(segmentedControlRef.current.children).map(
        child => (child as HTMLElement).clientWidth
      )
      setOptionWidths(widths)

      if (orientation === 'vertical') {
        const heights = Array.from(segmentedControlRef.current.children).map(
          child => (child as HTMLElement).clientHeight
        )
        setOptionHeights(heights)
      }
    }
  }, [options, orientation])
  useEffect(() => {
    if (
      defaultSelected &&
      options.some(option => option.title === defaultSelected)
    ) {
      setSelected(defaultSelected)
    } else {
      setSelected(options.length > 0 ? options[0].title : '')
    }
  }, [defaultSelected, options])

  const handleSelect = (option: string) => {
    if (!disabled && selected !== option) {
      setSelected(option)
      onSelect(option)
    }
  }
  const underlineWidth = optionWidths[underlinePosition] || 1
  const underlineLeft = optionWidths
    .slice(0, underlinePosition)
    .reduce((a, b) => a + b, 0)
  /*const underlineTop = optionHeights
    .slice(0, underlinePosition)
    .reduce((a, b) => a + b, 0)*/
  const underlineTop =
    orientation === 'vertical'
      ? optionHeights.slice(0, underlinePosition).reduce((a, b) => a + b, 0) +
        (optionHeights[underlinePosition] || 0)
      : '100%'

  return (
    <div className={styles.segmentedControlWrapper} {...props}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        ref={segmentedControlRef}
        className={classNames(
          styles.segmentedControl,
          styles[size],
          styles[variant],
          { [styles.vertical]: orientation === 'vertical' }
        )}>
        {options.map(option => (
          <div
            key={option.title}
            className={classNames(styles.segmentOption, {
              [styles.active]:
                selected === option.title && !disabled && variant === 'on',
              [styles.disabled]: disabled,
              [styles.onIndicator]: variant === 'on'
            })}
            onClick={() => handleSelect(option.title)}>
            {option.icon}
            <span>{option.title}</span>
          </div>
        ))}
        {variant === 'line' && (
          <div
            className={styles.underline}
            style={{
              left: orientation === 'horizontal' ? `${underlineLeft}px` : '0',
              top: orientation === 'vertical' ? `${underlineTop}px` : '100%',
              width: `${underlineWidth}px`,
              transition: 'left 0.3s ease, top 0.3s ease, width 0.3s ease'
            }}
          />
        )}

        {variant === 'on' && (
          <div
            className={styles.onIndicator}
            style={{
              left: `${underlineLeft}px`,
              transition: 'left 0.3s ease'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default SegmentedControl
