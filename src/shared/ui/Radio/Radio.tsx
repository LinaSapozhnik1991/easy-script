import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import styles from './Radio.module.scss'

interface RadioProps {
  id: string
  size: 'xsmall' | 'small' | 'medium' | 'large'
  label: string
  active?: boolean
  hover?: boolean
  isDefault?: boolean
  // checked?: boolean
  disabled?: boolean
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void
}

const Radio: React.FC<RadioProps> = ({
  id,
  size,
  label,
  isDefault = false,
  active = false,
  hover = false,
  disabled = false,
  onChange
}) => {
  const [checked, setChecked] = useState(isDefault)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = !checked
    setChecked(newChecked)

    if (onChange) {
      onChange(event, newChecked)
    }
  }
  useEffect(() => {
    setChecked(isDefault)
  }, [isDefault])
  const radioClass = classNames(styles.radio, {
    [styles.disabled]: disabled,
    [styles.active]: active,
    [styles.hover]: hover,
    [styles.default]: isDefault
  })
  return (
    <label className={radioClass} htmlFor={id}>
      <input
        type="radio"
        id={id}
        className={`${styles.visuallyHidden}`}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <div
        className={`${styles.circle} ${styles[size]} ${
          checked ? styles.checked : ''
        }`}>
        <div
          className={`${styles.innerCircle} ${checked ? styles.visible : ''} ${
            styles[size]
          }`}></div>
      </div>
      <span>{label}</span>
    </label>
  )
}

export default Radio
