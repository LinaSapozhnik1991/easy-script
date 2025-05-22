import React from 'react'

import { Button } from '@/shared/ui/Button'

import styles from './ModalSection.module.scss'
import { Section } from './Section'

interface ModalSectionNodeProps {
  sections: Section[]
  onClose: () => void
  onSelectGoals: (selectedGoals: string[]) => void
}

const ModalSectionNode: React.FC<ModalSectionNodeProps> = ({
  sections,
  onClose
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Выберите цели</h2>
        {sections.map(section => (
          <div key={section.id} className={styles.section}>
            <h3>{section.title}</h3>
          </div>
        ))}
        <div className={styles.btn}>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  )
}

export default ModalSectionNode
