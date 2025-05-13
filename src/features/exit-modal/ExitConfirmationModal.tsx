import React from 'react'

import { Button } from '@/shared/ui/Button'

import styles from './ExitConfirmation.module.scss'

interface ExitConfirmationModalProps {
  onClose: () => void
  onExitWithoutSaving: () => void
  onStayInEditor: () => void
  onSaveAndExit: () => void
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onClose,
  //onExitWithoutSaving,
  onStayInEditor,
  onSaveAndExit
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Вы действительно хотите выйти из режима Конструктора?</h2>
        <div className={styles.btn}>
          <Button exitStyle borderMedium onClick={onClose}>
            Выйти без сохранения
          </Button>
          <Button primaryBorder borderMedium onClick={onStayInEditor}>
            Остаться в редакторе
          </Button>
          <Button primary borderMedium onClick={onSaveAndExit}>
            Сохранить и выйти
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExitConfirmationModal
