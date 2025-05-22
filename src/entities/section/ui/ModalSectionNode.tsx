import React, { useState } from 'react'

import { Button } from '@/shared/ui/Button'

import styles from './ModalSection.module.scss' // Создайте соответствующий файл стилей
import { Section } from './Section'

interface ModalSectionNodeProps {
  sections: Section[]
  onClose: () => void
  onSelectGoals: (selectedGoals: string[]) => void
}

const ModalSectionNode: React.FC<ModalSectionNodeProps> = ({
  sections,
  onClose,
  onSelectGoals
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleConfirm = () => {
    onSelectGoals(selectedGoals)
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Выберите цели</h2>
        {sections.map(section => (
          <div key={section.id} className={styles.section}>
            <h3>{section.title}</h3>
            {section.goals.map(goal => (
              <label key={goal.id}>
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal.id)}
                  onChange={() => toggleGoalSelection(goal.id)}
                />
                {goal.title}
              </label>
            ))}
          </div>
        ))}
        <div className={styles.btn}>
          <Button onClick={handleConfirm}>Подтвердить</Button>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  )
}

export default ModalSectionNode
