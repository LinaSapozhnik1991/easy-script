import React from 'react'
import { Button } from '@/shared/ui/Button'
import styles from './ExitConfirmation.module.scss'

interface ExitConfirmationModalProps {
  onClose: () => void
  onExitWithoutSaving: () => void
  onStayInEditor: () => void
  onSaveAndExit: () => void
  isLoading?: boolean
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onClose,
  onExitWithoutSaving,
  onStayInEditor,
  onSaveAndExit,
  isLoading = false
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Вы действительно хотите выйти из режима конструктора?</h2>

        <div className={styles.btn}>
          <Button
            exitStyle
            borderMedium
            onClick={onExitWithoutSaving}
            disabled={isLoading}>
            Выйти без сохранения
          </Button>
          <Button
            primaryBorder
            borderMedium
            onClick={() => {
              onStayInEditor()
              onClose()
            }}
            disabled={isLoading}>
            Остаться в редакторе
          </Button>
          <Button
            primary
            borderMedium
            onClick={onSaveAndExit}
            loading={isLoading}
            disabled={isLoading}>
            Сохранить и выйти
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExitConfirmationModal
