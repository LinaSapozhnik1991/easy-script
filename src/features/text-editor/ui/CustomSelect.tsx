import React, { useState } from 'react'

import styles from './CustomSelect.module.scss'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (newValue: string) => void
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className={styles.select} onClick={toggleDropdown}>
      <div className={styles.selected}>{value}</div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option.value)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
