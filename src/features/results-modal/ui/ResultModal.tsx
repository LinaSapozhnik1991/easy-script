/* eslint-disable no-console */
import React, { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import Modal from '@/shared/Modal/ui'
import GoalModal from '@/features/goal-modal/GoalModal'

import styles from './ResultModal.module.scss'
import DeclineModal from '@/features/decline-modal/ui/DeclineModal'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  onResult: (result: string) => void
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  onResult
}) => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  const handleResult = (result: string) => {
    if (result === 'Цель достигнута') {
      setIsGoalModalOpen(true)
    } else if (result === 'Отказ') {
      setIsDeclineModalOpen(true) // Открываем модальное окно отказа
    } else {
      onResult(result)
      onClose()
    }
  }

  const handleGoalSubmit = (goals: string[]) => {
    console.log('Выбранные цели:', goals)
    onResult('Цель достигнута с целями: ' + goals.join(', '))
  }

  const handleDeclineSubmit = (reason: string) => {
    console.log('Причина отказа:', reason)
    onResult('Цель не достигнута: ' + reason)
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Сообщите о результате разговора</h2>
            <div className={styles.btn}>
              <Button
                exitStyle
                size="smallOperator"
                borderMedium
                onClick={() => {
                  handleResult('Отказ')
                  onClose()
                }}>
                Отказ
              </Button>
              <Button
                primaryBorder
                scriptStyle
                size="smallOperator"
                borderMedium
                onClick={() => {
                  handleResult('Перезвонить')
                  onClose()
                }}>
                Перезвонить
              </Button>
              <Button
                primary
                borderMedium
                size="smallOperator"
                onClick={() => {
                  handleResult('Цель достигнута')
                  onClose()
                }}>
                Цель достигнута
              </Button>
            </div>
            <div className={styles.comments}>
              <p>Комментарий</p>
              <div className={styles.commentContainer}>
                <textarea
                  placeholder="Запишите здесь вопросы и возражения клиента, ответы на которые не учтены в скрипте"
                  className={styles.youComments}></textarea>
                <button className={styles.saveBtn}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
      />
      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onSubmit={handleDeclineSubmit}
      />
    </>
  )
}

export default ResultModal
