import React, { useState } from 'react'

import SegmentedControl from '@/shared/ui/SegmentedControl/SegmentedControl'

import styles from './ModeSelector.module.scss'

const ModeSelector: React.FC = () => {
  const [, setSelectedMode] = useState('Режим редактирования')

  const handleSelect = (mode: string) => {
    setSelectedMode(mode)
  }

  const options = [
    { title: 'Режим редактирования' },
    { title: 'Режим оператора' }
  ]

  return (
    <div className={styles.mode}>
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

export default ModeSelector
