import React from 'react'

import { Button } from '@/shared/ui/Button'
import styles from './EndTheCall.module.scss'
import Modal from '@/shared/Modal/ui'
import useModalStore from '@/shared/Modal/model/useModalStore'
interface EndTheCallProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}
const EndTheCall: React.FC<EndTheCallProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const { closeModal } = useModalStore()

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Вы действительно хотите завершить звонок?</h2>
          <div className={styles.btn}>
            <Button
              exitStyle
              borderMedium
              onClick={() => {
                onConfirm()
                closeModal()
              }}>
              Завершить
            </Button>
            <Button
              primaryBorder
              borderMedium
              onClick={() => {
                onCancel()
                closeModal()
              }}>
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EndTheCall
