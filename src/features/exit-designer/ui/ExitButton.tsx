import React from 'react'

import { Button } from '@/shared/ui/Button'
import { CloseWhite } from '@/shared/assets/icons'

import styles from './ExitButton.module.scss'

interface ExitProps {
  onClick: () => void
  hasUnsavedChanges?: boolean
}
const Exit: React.FC<ExitProps> = ({ onClick }) => {
  return (
    <div className={styles.exit}>
      <Button exitStyle size="largeScript" onClick={onClick}>
        <CloseWhite />
        Выйти из режима Конструктора
      </Button>
    </div>
  )
}

export default Exit
