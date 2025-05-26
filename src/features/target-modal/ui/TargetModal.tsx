/* eslint-disable no-console */
'use client'
import { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { useNodesStore } from '@/entities/section/lib/useNodeStore'
import { AnswerNode, Section } from '@/entities/section/ui/Section'
import { Flag } from '@/shared/assets/icons'

import { updateNodeTarget } from '../api'

import styles from './TargetModal.module.scss'

interface TargetModalProps {
  sections: Section[]
  onSelectTargets: (targetIds: string[]) => void
  onClose: () => void
  scriptId: string
  scenarioId: string
  sectionId: string
}

const TargetSelectionModal = ({
  sections,
  onSelectTargets,
  onClose,
  scriptId,
  sectionId,
  scenarioId
}: TargetModalProps) => {
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getNodesBySection } = useNodesStore()

  const handleSubmit = async () => {
    if (selectedTargets.length === 0) {
      setError('цель не выбрана')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await Promise.all(
        selectedTargets.map(nodeId =>
          updateNodeTarget({
            scriptId,
            scenarioId,
            sectionId,
            nodeId,
            isTarget: true
          })
        )
      )
      onSelectTargets(selectedTargets)
      onClose()
    } catch (err) {
      console.error('Ошибка при сохранении целей:', err)
      setError('Не удалось сохранить цели. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckboxChange = (answerId: string) => {
    setSelectedTargets(prev =>
      prev.includes(answerId)
        ? prev.filter(id => id !== answerId)
        : [...prev, answerId]
    )
    setError(null)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.targetModal}>
        <h3>Выберите цели</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.targetList}>
          {sections.map(section => {
            const nodes = getNodesBySection(section.id)
            return (
              <div key={section.id} className={styles.sectionBlock}>
                <h4>{section.title}</h4>
                {nodes?.map((node: AnswerNode) => (
                  <div key={node.id} className={styles.answerItem}>
                    <input
                      type="checkbox"
                      id={`target-${node.id}`}
                      checked={selectedTargets.includes(node.id)}
                      onChange={() => handleCheckboxChange(node.id)}
                      disabled={isLoading}
                    />
                    <label
                      className={styles.nodeTitle}
                      htmlFor={`target-${node.id}`}>
                      {node.title}
                    </label>
                    {selectedTargets.includes(node.id) && (
                      <Flag className={styles.flagIcon} />
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className={styles.modalActions}>
          <Button
            clear
            borderMedium
            size="mediumModalTarget"
            onClick={onClose}
            disabled={isLoading}>
            Отменить
          </Button>
          <Button
            primary
            borderMedium
            size="mediumModalTarget"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TargetSelectionModal
