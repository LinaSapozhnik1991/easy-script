/* eslint-disable no-console */
import React from 'react'

import SegmentedControl from '@/shared/ui/SegmentedControl/SegmentedControl'

import styles from './FilterComponent.module.scss'
const FilterComponent = () => {
  const options = [
    { title: 'Все Компании' },
    { title: 'Мои скрипты' },
    { title: 'Доступные скрипты' }
  ]

  const handleSelect = (selectedOption: string) => {
    console.log('Выбранный вариант:', selectedOption)
  }

  return (
    <div className={styles.filter}>
      <SegmentedControl
        label=""
        options={options}
        onSelect={handleSelect}
        size="medium"
        variant="on"
        orientation="horizontal"
      />
    </div>
  )
}

export default FilterComponent
