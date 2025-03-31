import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'

import styles from './SegmentedControl.module.scss'

interface SegmentedControlProps {
  label?: string
  options: string[]
  onSelect: (option: string) => void
  size?: 'large' | 'medium' | 'small' | 'xs'
  disabled?: boolean
  variant: 'line' | 'on'
  defaultSelected?: string

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
  ...props
}) => {
  const [selected, setSelected] = useState(defaultSelected || options[0])
  const [underlinePosition, setUnderlinePosition] = useState(0)
  const segmentedControlRef = useRef<HTMLDivElement | null>(null)
  const [optionWidths, setOptionWidths] = useState<number[]>([])

  useEffect(() => {
    const selectedIndex = options.indexOf(selected)
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
    }
  }, [options])
  useEffect(() => {
    setSelected(defaultSelected || options[0])
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

  return (
    <div className={styles.segmentedControlWrapper} {...props}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        ref={segmentedControlRef}
        className={classNames(
          styles.segmentedControl,
          styles[size],
          styles[variant]
        )}>
        {options.map(option => (
          <div
            key={option}
            className={classNames(styles.segmentOption, {
              [styles.active]:
                selected === option && !disabled && variant === 'on',
              [styles.disabled]: disabled
            })}
            onClick={() => handleSelect(option)}>
            {option}
          </div>
        ))}
        {variant === 'line' && (
          <>
            <div
              className={styles.underline}
              style={{
                left: `${underlineLeft}px`,
                width: `${underlineWidth}px`,
                transition: 'left 0.3s ease, width 0.3s ease'
              }}
            />
          </>
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
