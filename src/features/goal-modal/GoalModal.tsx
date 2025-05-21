// GoalModal.tsx
import React, { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import Modal from '@/shared/Modal/ui'

import styles from './GoalModal.module.scss'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (goals: string[]) => void
}
const goalsList = [
  'Увеличить продажи',
  'Улучшить клиентский сервис',
  'Собрать отзывы'
]
const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const handleGoalChange = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleSubmit = () => {
    onSubmit(selectedGoals)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Пожалуйста, укажите цель</h2>
          <ul className={styles.goals}>
            {goalsList.map(goal => (
              <li key={goal}>
                <label>
                  <input
                    type="checkbox"
                    value={goal}
                    checked={selectedGoals.includes(goal)}
                    onChange={() => handleGoalChange(goal)}
                  />
                  {goal}
                </label>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Button onClick={onClose} borderMedium clear>
              Вернуться
            </Button>
            <Button onClick={handleSubmit} primary borderMedium>
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default GoalModal
