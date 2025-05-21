/* eslint-disable no-console */
import React, { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import SegmentedControl from '@/shared/ui/SegmentedControl/SegmentedControl'

import styles from './ModeSelector.module.scss'

interface Option {
  title: string
}

interface ModeSelectorProps {
  selectedOption: string
  onSelect: (option: string) => void
}

const ModeSelector: FC<ModeSelectorProps> = ({ selectedOption, onSelect }) => {
  const options: Option[] = [
    { title: 'Режим редактирования' },
    { title: 'Режим оператора' }
  ]

  const router = useRouter()
  const { id, mode } = router.query

  useEffect(() => {
    if (!router.isReady) return
    if (
      mode &&
      (mode === 'Режим оператора' || mode === 'Режим редактирования') &&
      mode !== selectedOption
    ) {
      onSelect(mode as string)
    }
  }, [router.isReady, mode, selectedOption, onSelect])

  const handleSelect = (selectedTitle: string) => {
    onSelect(selectedTitle)

    if (!id) {
      console.warn('ID отсутствует, навигация невозможна')
      return
    }

    const newRoute =
      selectedTitle === 'Режим оператора'
        ? `/operator/${id}?mode=operator`
        : `/construction/${id}?mode=construction`

    console.log('Navigating to:', newRoute) // Логирование нового маршрута
    router.push(newRoute).catch(err => {
      console.error('Navigation error:', err)
    })
  }

  return (
    <div className={styles.mode}>
      <SegmentedControl
        label=""
        options={options}
        selected={selectedOption}
        onSelect={handleSelect}
        size="medium"
        variant="on"
        orientation="horizontal"
      />
    </div>
  )
}

export default ModeSelector
