/* eslint-disable no-console */
import React, { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import Modal from '@/shared/Modal/ui'

import styles from './DeclineModal.module.scss'

interface DeclineModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

const DeclineModal: React.FC<DeclineModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    onSubmit(reason)
    onClose()
    console.log('setReason', setReason)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Цель не достигнута</h2>
          <div className={styles.comments}>
            <p>Пожалуйста укажите причину:</p>
            <div className={styles.commentContainer}>
              <textarea
                placeholder="Запишите здесь вопросы и возражения клиента, ответы на которые не учтены в скрипте"
                className={styles.youComments}></textarea>
              <button className={styles.saveBtn}>Сохранить</button>
            </div>
          </div>
          <div className={styles.btn}>
            <Button onClick={onClose} size="largeScript" borderMedium clear>
              Вернуться
            </Button>
            <Button
              onClick={handleSubmit}
              size="largeScript"
              primary
              borderMedium>
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeclineModal
