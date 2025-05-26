import React, { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { useNodesStore } from '@/entities/section/lib/useNodeStore'
import { AnswerNode } from '@/entities/section/ui/Section'
import { Check } from '@/shared/assets/icons'

import styles from './NodeModalLink.module.scss'
import { saveNodeLinks } from '../api/saveNodeLinks'

interface NodeModalLinkProps {
  sections: Array<{
    id: string
    title: string
    nodes?: AnswerNode[]
  }>
  onSelectNodes: (nodeIds: string[]) => void
  onClose: () => void
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string
}

const NodeModalLink: React.FC<NodeModalLinkProps> = ({
  sections,
  onSelectNodes,
  onClose,
  scriptId,
  scenarioId,
  sectionId,
  nodeId
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null) // Изменяем на строку или null
  const { getNodesBySection } = useNodesStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNodeSelect = (nodeId: string) => {
    // Устанавливаем только один выбранный узел
    setSelectedNode(prev => (prev === nodeId ? null : nodeId))
  }

  const handleSubmit = async () => {
    if (!selectedNode) {
      setError('Выберите одну ноду для ссылки')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Отправка запроса на сохранение ссылок
      await saveNodeLinks(
        scriptId,
        scenarioId,
        sectionId,
        nodeId,
        [selectedNode] // Передаем массив с единственным выбранным узлом
      )
      onSelectNodes([selectedNode]) // Вызов функции для обновления выбранного узла
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ошибка при сохранении ссылок'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.nodeModal}>
        <h3>Создание ссылки</h3>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.nodeList}>
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
                      checked={selectedNode === node.id} // Проверяем, выбран ли узел
                      onChange={() => handleNodeSelect(node.id)}
                      disabled={isLoading}
                    />
                    <label
                      className={styles.nodeTitle}
                      htmlFor={`target-${node.id}`}>
                      {node.title}
                    </label>
                    {selectedNode === node.id && (
                      <Check className={styles.flagIcon} />
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className={styles.modalActions}>
          <Button clear borderMedium onClick={onClose}>
            Отменить
          </Button>
          <Button
            primary
            borderMedium
            onClick={handleSubmit}
            disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeModalLink
