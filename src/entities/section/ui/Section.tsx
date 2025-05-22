/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react'

import { CloseGreen, UpDown } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'

import { addAnswer, getSectionNodes } from '../api/node'
import { deleteSection } from '../api'

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
  content: string
  type: string
  isNew?: boolean
  scenarioId?: string | null
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
}> = ({
  section,
  onUpdateTitle,
  onAnswerClick,
  onSectionDeleted,
  selectedAnswerId,
  scriptId,

  scenarioId
}) => {
  const [title, setTitle] = useState(section.title)
  const [nodes, setNodes] = useState<AnswerNode[]>([])
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editingNodeContent, setEditingNodeContent] = useState('')
  const [isAddingNewNode, setIsAddingNewNode] = useState(false)
  const newNodeInputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loadingNodes, setLoadingNodes] = useState(false)
  //const { isDeleting } = useState(false)
  useEffect(() => {
    const loadNodes = async () => {
      setLoadingNodes(true)
      try {
        const fetchedNodes = await getSectionNodes(
          scriptId,
          scenarioId,
          section.id
        )
        setNodes(fetchedNodes)
      } catch (error) {
        console.error('Failed to load nodes:', error)
      } finally {
        setLoadingNodes(false)
      }
    }

    loadNodes()
  }, [scriptId, scenarioId, section.id])
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
    const newNode: AnswerNode = {
      id: tempId,
      content: editingNodeContent.trim(),
      type: 'answer',
      isNew: true,
      sectionId: section.id,
      title: editingNodeContent.trim(),
      scenarioId: section.scenarioId
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
        section.scenarioId as string,
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
                  ...n,
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
  /* const handleAnswerClick = (node: AnswerNode) => {
    if (onAnswerClick) {
      onAnswerClick({
        ...node,
        sectionId: section.id,
        scenarioId: section.scenarioId
      })
    }
  }*/
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

  /*const handleNodeEditClick = (node: Node) => {
    setEditingNodeId(node.id)
    setEditingNodeContent(node.content)
    setIsAddingNewNode(false)
  }*/
  const handleNodeClick = (node: AnswerNode) => {
    if (onAnswerClick) {
      onAnswerClick(node)
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
    console.log('Deleting section:', section)
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
                  className={`${styles.liAnswer} ${
                    selectedAnswerId === node.id ? styles.activeAnswer : ''
                  }`}>
                  <div className={styles.upDownIcon}>
                    <UpDown />
                  </div>
                  {node.title}
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

      <div className={styles.btn}>
        <Button scriptStyle size="largeMode" onClick={handleAddNodeClick}>
          Добавить заголовок ответа
        </Button>
      </div>
    </section>
  )
}

export default SectionComponent
