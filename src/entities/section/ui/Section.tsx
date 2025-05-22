/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react'

import { CloseGreen, UpDown } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'

import { addAnswer } from '../api/node'
import { deleteSection } from '../api'

import styles from './SectionComponent.module.scss'

export interface Section {
  id: string
  title: string
  scriptId: string | number
  scenarioId: string
  scenarios: Scenario[]
  weight?: string | null
}

export interface Scenario {
  id: string
  title: string
  script_id?: string
  scenarioId: string
  scriptId: string | number
  description?: string | null
  weight?: number
}

interface Node {
  id: string
  content: string
  type: string
  isNew?: boolean
}

export type Scenarios = Scenario

const SectionComponent: React.FC<{
  section: Section
  onUpdateTitle: (id: string, title: string) => void
  scenarios: Scenario[]
  scenarioId: string
  onSectionDeleted: (sectionId: string) => void
}> = ({ section, onUpdateTitle, onSectionDeleted }) => {
  const [title, setTitle] = useState(section.title)
  const [nodes, setNodes] = useState<Node[]>([])
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editingNodeContent, setEditingNodeContent] = useState('')
  const [isAddingNewNode, setIsAddingNewNode] = useState(false)
  const newNodeInputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isAddingNewNode && newNodeInputRef.current) {
      newNodeInputRef.current.focus()
    }
  }, [isAddingNewNode])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getScriptIdByScenarioId = (
    scenarios: Scenario[],
    scenarioId: string
  ): string | null => {
    if (!Array.isArray(scenarios)) {
      console.error(
        'Expected scenarios to be an array but received:',
        scenarios
      )
      return null
    }

    const scenario = scenarios.find(s => s.scenarioId === scenarioId)
    return scenario && scenario.scriptId ? scenario.scriptId.toString() : null
  }

  const handleSaveNewNode = async () => {
    if (!editingNodeContent.trim()) {
      return
    }

    const tempId = 'temp-' + Date.now()
    const newNode = {
      id: tempId,
      content: editingNodeContent.trim(),
      type: 'answer',
      isNew: true
    }

    setNodes(prev => [...prev, newNode])
    setEditingNodeId(tempId)
    setEditingNodeContent('')

    try {
      const scriptId = section.scriptId
      if (!scriptId) {
        throw new Error('Не удалось определить scriptId для данного раздела')
      }

      const createdNode = await addAnswer(
        String(scriptId),
        section.scenarioId,
        section.id,
        editingNodeContent.trim(),
        editingNodeContent.trim(),
        null,
        false
      )

      if (createdNode && createdNode.id) {
        setNodes(prev =>
          prev.map(n =>
            n.id === tempId
              ? {
                  id: String(createdNode.id),
                  content: createdNode.text || createdNode.title || '',
                  type: createdNode.type || 'answer',
                  isNew: false
                }
              : n
          )
        )
      } else {
        throw new Error('Пустой ответ от сервера')
      }
    } catch (error) {
      console.error('Ошибка при добавлении ответа:', error)
      setErrorMessage('Ошибка при добавлении ответа')
      setNodes(prev => prev.filter(n => n.id !== tempId))
    } finally {
      setIsAddingNewNode(false)
    }
  }

  const handleNodeContentBlur = async (nodeId: string) => {
    const nodeIndex = nodes.findIndex(n => n.id === nodeId)
    if (nodeIndex === -1) return

    if (nodes[nodeIndex].isNew) {
      if (!editingNodeContent.trim()) {
        setNodes(prev => prev.filter(n => n.id !== nodeId))
      } else {
        await handleSaveNewNode()
      }
    } else {
      const newNodes = [...nodes]
      newNodes[nodeIndex] = { ...nodes[nodeIndex], content: editingNodeContent }
      setNodes(newNodes)
    }

    setEditingNodeId(null)
    setEditingNodeContent('')
  }

  const handleNodeEditClick = (node: Node) => {
    setEditingNodeId(node.id)
    setEditingNodeContent(node.content)
    setIsAddingNewNode(false)
  }

  const handleNodeContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingNodeContent(e.target.value)
  }

  const handleAddTitle = () => {
    if (title.trim()) {
      onUpdateTitle(section.id, title)
    } else {
      alert('Заголовок не может быть пустым')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isAddingNewNode) {
        handleSaveNewNode()
      } else if (editingNodeId) {
        handleNodeContentBlur(editingNodeId)
      }
    } else if (e.key === 'Escape') {
      setIsAddingNewNode(false)
      setEditingNodeId(null)
      setEditingNodeContent('')
    }
  }

  const handleDeleteSection = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот раздел?')) {
      return
    }

    setIsDeleting(true)
    setErrorMessage('')

    try {
      const result = await deleteSection(
        String(section.scriptId),
        section.scenarioId,
        section.id
      )

      if (result.success) {
        onSectionDeleted(section.id)
      } else {
        setErrorMessage(result.message || 'Не удалось удалить раздел')
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Произошла неизвестная ошибка при удалении'
      )
    } finally {
      setIsDeleting(false)
    }
  }
  const handleAddNodeClick = () => {
    setIsAddingNewNode(true)
    setEditingNodeContent('')
  }
  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
  }
  return (
    <section className={styles.section}>
      <div className={styles.topRow}>
        <div className={styles.upDownIcon}>
          <UpDown />
        </div>

        <div className={styles.staticContent}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleAddTitle}
            placeholder="..."
            className={styles.titleInput}
          />

          <ul>
            {isAddingNewNode && (
              <li>
                <input
                  ref={newNodeInputRef}
                  type="text"
                  value={editingNodeContent}
                  onChange={handleNodeContentChange}
                  onBlur={handleSaveNewNode}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите заголовок ответа..."
                  className={styles.titleInputAnswer}
                  autoFocus
                />
              </li>
            )}
            {nodes.map(node => (
              <li
                key={node.id}
                onClick={() => handleNodeEditClick(node)}
                className={styles.liAnswer}>
                <div className={styles.upDownIcon}>
                  <UpDown />
                </div>
                {node.content}
                <CloseGreen onClick={() => handleDeleteNode(node.id)} />
              </li>
            ))}
          </ul>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>

        <div className={styles.clearIcon} onClick={handleDeleteSection}>
          {isDeleting ? <span>...</span> : <CloseGreen />}
        </div>
      </div>

      <div className={styles.btn}>
        <Button scriptStyle size="largeMode" onClick={handleAddNodeClick}>
          Добавить заголовок ответа
        </Button>
      </div>
    </section>
  )
}

export default SectionComponent
