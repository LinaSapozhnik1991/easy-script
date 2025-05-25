/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react'

import { CloseGreen, Flag, UpDown } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'

import { addAnswer, deleteNode, getSectionNodes } from '../api/node'
import { deleteSection } from '../api'
import { useNodesStore } from '../lib/useNodeStore'

import styles from './SectionComponent.module.scss'

export interface Section {
  id: string
  title: string
  scriptId?: string
  script_id?: string
  scenarioId?: string
  scenario_id?: string
  scenarios?: Scenario[]
  weight?: string | null
  isNew?: boolean
}

export interface Scenario {
  id: string
  title: string
  scriptId?: string
  scenarioId: string
  description?: string | null
  weight?: number
}

export interface AnswerNode {
  sectionId: string
  title: string
  id: string
  content?: string
  text: string
  type: string
  isNew?: boolean
  scenarioId?: string | null
  weight?: number | null
  is_target?: boolean
}

export type Scenarios = Scenario

const SectionComponent: React.FC<{
  section: Section
  onUpdateTitle: (id: string, title: string) => void
  scenarios: Scenario[]
  scenarioId: string
  scenario_Id: string
  scriptId: string
  script_id: string
  onSectionDeleted: (sectionId: string) => void
  onAnswerClick?: (answer: AnswerNode) => void
  selectedAnswerId?: string | null
  setSections?: React.Dispatch<React.SetStateAction<Section[]>>
  children?: React.ReactNode
}> = ({
  section,
  onUpdateTitle,
  onAnswerClick,
  onSectionDeleted,
  selectedAnswerId,
  scriptId,
  scenarioId,
  children
}) => {
  const [title, setTitle] = useState(section.title)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editingNodeContent, setEditingNodeContent] = useState('')
  const [isAddingNewNode, setIsAddingNewNode] = useState(false)
  const newNodeInputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loadingNodes, setLoadingNodes] = useState(false)

  const {
    getNodesBySection,
    setNodesForSection,
    addNode,
    updateNode,
    removeNode
  } = useNodesStore()

  const nodes = getNodesBySection(section.id) || []

  useEffect(() => {
    const loadNodes = async () => {
      setLoadingNodes(true)
      try {
        const fetchedNodes = await getSectionNodes(
          String(scriptId),
          String(scenarioId),
          String(section.id)
        )
        setNodesForSection(section.id, fetchedNodes)
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      } finally {
        setLoadingNodes(false)
      }
    }

    loadNodes()
  }, [scriptId, scenarioId, section.id, setNodesForSection])

  useEffect(() => {
    if (isAddingNewNode && newNodeInputRef.current) {
      newNodeInputRef.current.focus()
    }
  }, [isAddingNewNode])

  const handleSaveNewNode = async () => {
    if (!editingNodeContent.trim()) return

    const tempId = 'temp-' + Date.now()
    const newNode: AnswerNode = {
      id: tempId,
      content: editingNodeContent.trim(),
      text: editingNodeContent.trim(),
      type: 'answer',
      isNew: true,
      sectionId: section.id,
      title: editingNodeContent.trim(),
      scenarioId: section.scenarioId
    }

    addNode(section.id, newNode)
    setEditingNodeId(tempId)
    setEditingNodeContent('')

    try {
      const scriptId = section.scriptId
      if (!scriptId) {
        throw new Error('Не удалось определить scriptId для данного раздела')
      }

      const createdNode = await addAnswer(
        String(scriptId),
        section.scenarioId as string,
        section.id,
        editingNodeContent.trim(),
        editingNodeContent.trim(),
        null,
        false
      )

      if (createdNode && createdNode.id) {
        updateNode(section.id, tempId, {
          id: String(createdNode.id),
          content: createdNode.text || createdNode.title || '',
          type: createdNode.type || 'answer',
          isNew: false
        })
      } else {
        throw new Error('Пустой ответ от сервера')
      }
    } catch (error) {
      console.error('Ошибка при добавлении ответа:', error)
      setErrorMessage('Ошибка при добавления ответа')
      removeNode(section.id, tempId)
    } finally {
      setIsAddingNewNode(false)
    }
  }

  const handleNodeContentBlur = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    if (node.isNew) {
      if (!editingNodeContent.trim()) {
        removeNode(section.id, nodeId)
      } else {
        await handleSaveNewNode()
      }
    } else {
      updateNode(section.id, nodeId, { content: editingNodeContent })
    }

    setEditingNodeId(null)
    setEditingNodeContent('')
  }

  const handleNodeClick = (node: AnswerNode) => {
    if (onAnswerClick) {
      onAnswerClick({
        ...node,
        text: node.text || node.content || '',
        sectionId: section.id,
        scenarioId: section.scenarioId as string
      })
    }
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

  const handleDeleteSection = async (section: Section) => {
    if (!section.scriptId || !section.scenarioId) {
      console.error('Отсутствует scriptId или scenarioId')
      return
    }

    try {
      const result = await deleteSection(
        section.id,
        section.scriptId,
        section.scenarioId
      )
      if (result.success) {
        onSectionDeleted(section.id)
      }
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const handleAddNodeClick = () => {
    setIsAddingNewNode(true)
    setEditingNodeContent('')
  }

  const handleDeleteNode = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    if (!section.scriptId || !section.scenarioId) {
      console.error('Отсутствует scriptId или scenarioId')
      return
    }

    try {
      const result = await deleteNode(
        section.scriptId,
        section.scenarioId,
        section.id,
        nodeId
      )
      if (result.success) {
        removeNode(section.id, nodeId)
      } else {
        console.error('Не удалось удалить ноду')
      }
    } catch (error) {
      console.error('Ошибка удаления ноды:', error)
    }
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

          {loadingNodes ? (
            <div className={styles.loading}>Загрузка ответов...</div>
          ) : (
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
                  onClick={() => handleNodeClick(node)}
                  className={`${styles.liAnswer} ${selectedAnswerId === node.id ? styles.activeAnswer : ''}`}>
                  <div className={styles.upDownIcon}>
                    <UpDown />
                  </div>
                  <div className={styles.answerContent}>
                    <div className={styles.answerTitle}>{node.title}</div>
                    {node.is_target && <Flag className={styles.flagIcon} />}
                  </div>
                  <CloseGreen onClick={() => handleDeleteNode(node.id)} />
                </li>
              ))}
            </ul>
          )}
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>

        <div
          className={styles.clearIcon}
          onClick={() => {
            handleDeleteSection(section).catch(console.error)
          }}>
          <CloseGreen />
        </div>
      </div>
      {children && (
        <div className={styles.targetSelectionContent}>{children}</div>
      )}

      <div className={styles.btn}>
        <Button scriptStyle size="largeMode" onClick={handleAddNodeClick}>
          Добавить заголовок ответа
        </Button>
      </div>
    </section>
  )
}

export default SectionComponent
