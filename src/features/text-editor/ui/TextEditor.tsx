/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { Editor, EditorState, RichUtils, SelectionState } from 'draft-js'

import 'draft-js/dist/Draft.css'
import {
  Bold,
  Close,
  Cursive,
  Link,
  TextColor,
  Underline
} from '@/shared/assets/icons'
import { getSections } from '@/entities/section/api'
import NodeModalLink from '@/features/node-modal-link/ui/NodeModalLink'

import { saveNodeData } from '../api'
import {
  deserializeToEditorState,
  serializeEditorState
} from '../utils/editorSerialization'

import CustomSelect from './CustomSelect'
import styles from './TextEditor.module.scss'

// Стили для редактора
const styleMap = {
  RED: { color: 'rgba(186, 26, 26, 1)' },
  GREEN: { color: 'rgba(0, 105, 110, 1)' },
  BLACK: { color: 'black' },
  GRAY: { color: 'rgba(111, 121, 121, 1)' },
  BACKGROUND_RED: { backgroundColor: 'rgba(186, 26, 26, 1)', color: 'white' },
  BACKGROUND_GREEN: { backgroundColor: 'rgba(0, 105, 110, 1)', color: 'white' },
  BACKGROUND_BLACK: { backgroundColor: 'black', color: 'white' },
  BACKGROUND_GRAY: {
    backgroundColor: 'rgba(111, 121, 121, 1)',
    color: 'white'
  },
  FONT_SIZE_12px: { fontSize: '12px' },
  FONT_SIZE_14px: { fontSize: '14px' },
  FONT_SIZE_16px: { fontSize: '16px' },
  FONT_SIZE_18px: { fontSize: '18px' },
  FONT_SIZE_20px: { fontSize: '20px' },
  FONT_SIZE_24px: { fontSize: '24px' },
  FONT_SIZE_32px: { fontSize: '32px' },
  FONT_SIZE_48px: { fontSize: '48px' },
  LINK: { color: 'blue', textDecoration: 'underline' }
}

interface NodeData {
  title: string
  text: string
  weight: number | null
  is_target: boolean
  raw_content?: string
}

interface TextEditorProps {
  editorState: EditorState
  onEditorStateChange: (state: EditorState) => void
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string
  initialNodeData: NodeData
  onSave?: () => Promise<void>
  onNodeLinkClick?: (nodeId: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({
  editorState,
  onEditorStateChange,
  scriptId,
  scenarioId,
  sectionId,
  nodeId,
  initialNodeData,
  onNodeLinkClick
}) => {
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [currentFontSize, setCurrentFontSize] = useState('18px')
  const [currentTextColor, setCurrentTextColor] = useState('BLACK')
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [availableNodes, setAvailableNodes] = useState<
    Array<{ id: string; title: string }>
  >([])

  const fontSizeOptions = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '32px', label: '32' },
    { value: '48px', label: '48' }
  ]

  useEffect(() => {
    const fetchAvailableNodeLinks = async () => {
      try {
        const nodes = await getSections(String(scriptId), String(scenarioId))
        setAvailableNodes(nodes)
      } catch (error) {
        console.error('Ошибка загрузки доступных нод:', error)
      }
    }

    fetchAvailableNodeLinks()
  }, [scriptId, scenarioId, sectionId, nodeId])

  // Инициализация редактора с сохраненным форматированием
  useEffect(() => {
    if (initialNodeData.raw_content) {
      try {
        const editorStateFromSerialized = deserializeToEditorState(
          initialNodeData.raw_content
        )
        onEditorStateChange(editorStateFromSerialized)
      } catch (error) {
        console.error('Ошибка загрузки форматированного текста:', error)
      }
    }
  }, [initialNodeData.raw_content, onEditorStateChange])

  const handleAddLink = () => {
    setShowNodeModal(true)
  }

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onEditorStateChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const updateEditorState = (newState: EditorState) => {
    const currentInlineStyle = newState.getCurrentInlineStyle()
    if (currentInlineStyle.has(currentTextColor)) {
      newState = RichUtils.toggleInlineStyle(newState, currentTextColor)
    }
    const oldFontSize = currentFontSize
    if (currentInlineStyle.has(`FONT_SIZE_${oldFontSize}`)) {
      newState = RichUtils.toggleInlineStyle(
        newState,
        `FONT_SIZE_${oldFontSize}`
      )
    }
    newState = RichUtils.toggleInlineStyle(
      newState,
      `FONT_SIZE_${currentFontSize}`
    )
    newState = RichUtils.toggleInlineStyle(newState, currentTextColor)

    onEditorStateChange(newState)
  }

  const toggleInlineStyle = (style: string) => {
    if (['RED', 'GREEN', 'BLACK', 'GRAY'].includes(style)) {
      setCurrentTextColor(style)
    }
    updateEditorState(RichUtils.toggleInlineStyle(editorState, style))
  }

  const addNodeLink = async (selectedNodeIds: string[]) => {
    if (!selectedNodeIds.length) return

    const selection = editorState.getSelection()
    let newSelection = selection

    if (selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent()
      const block = contentState.getBlockForKey(selection.getStartKey())
      const text = block.getText()
      let start = selection.getStartOffset()
      let end = selection.getEndOffset()

      while (start > 0 && !/\s/.test(text[start - 1])) start--
      while (end < text.length && !/\s/.test(text[end])) end++

      newSelection = selection.merge({
        anchorOffset: start,
        focusOffset: end
      }) as SelectionState
    }

    let contentState = editorState.getCurrentContent()
    let newEditorState = editorState

    selectedNodeIds.forEach(nodeId => {
      contentState = contentState.createEntity('NODE_LINK', 'MUTABLE', {
        nodeId
      })
      const entityKey = contentState.getLastCreatedEntityKey()

      newEditorState = RichUtils.toggleLink(
        EditorState.push(newEditorState, contentState, 'apply-entity'),
        newSelection,
        entityKey
      )

      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'LINK')
      contentState = newEditorState.getCurrentContent()
    })

    onEditorStateChange(newEditorState)
    setShowNodeModal(false)
  }

  const handleEditorClick = (e: React.MouseEvent) => {
    const editor = e.currentTarget as HTMLElement
    const selection = window.getSelection()

    if (editor && selection && selection.rangeCount === 0) {
      const contentState = editorState.getCurrentContent()
      const selectionState = editorState.getSelection()
      const block = contentState.getBlockForKey(selectionState.getStartKey())
      const entityKey = block.getEntityAt(selectionState.getStartOffset())

      if (entityKey) {
        const entity = contentState.getEntity(entityKey)
        if (entity.getType() === 'NODE_LINK' && onNodeLinkClick) {
          const { nodeId: linkedNodeId } = entity.getData()
          onNodeLinkClick(linkedNodeId)
          e.preventDefault()
        }
      }
    }
  }

  const applyTextColor = (colorKey: string) => {
    toggleInlineStyle(colorKey)
    setColorPickerVisible(false)
  }

  const applyBackgroundColor = (colorKey: string) => {
    updateEditorState(RichUtils.toggleInlineStyle(editorState, colorKey))
    setColorPickerVisible(false)
  }

  const isStyleActive = (style: string) => {
    return editorState.getCurrentInlineStyle().has(style)
  }

  const handleSave = async () => {
    try {
      const serializedContent = serializeEditorState(editorState)
      const saveButton = document.querySelector(`.${styles.saveAnswer}`)
      const saveMessage = document.querySelector(`.${styles.saveMessage}`)

      // Показываем сообщение и запускаем анимацию
      saveButton?.classList.add(styles.saveAnimation)
      saveMessage?.setAttribute('style', 'display: block')

      await saveNodeData({
        scriptId,
        scenarioId,
        sectionId,
        nodeId,
        editorState,
        initialNodeData: {
          ...initialNodeData,
          text: editorState.getCurrentContent().getPlainText(),
          raw_content: serializedContent
        }
      })

      // Убираем анимацию через 2 секунды
      setTimeout(() => {
        saveButton?.classList.remove(styles.saveAnimation)
        saveMessage?.setAttribute('style', 'display: none')
      }, 2000)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  return (
    <div className={styles.editor} onClick={handleEditorClick}>
      <div className={styles.editorPanel}>
        <div className={styles.editorButtons}>
          <button
            onMouseDown={e => {
              e.preventDefault()
              toggleInlineStyle('BOLD')
            }}
            className={isStyleActive('BOLD') ? styles.active : ''}>
            <Bold />
          </button>
          <button
            onMouseDown={e => {
              e.preventDefault()
              toggleInlineStyle('ITALIC')
            }}
            className={isStyleActive('ITALIC') ? styles.active : ''}>
            <Cursive />
          </button>
          <button
            onMouseDown={e => {
              e.preventDefault()
              toggleInlineStyle('UNDERLINE')
            }}
            className={isStyleActive('UNDERLINE') ? styles.active : ''}>
            <Underline />
          </button>

          {/* Кнопка цвета текста */}
          <button onClick={() => setColorPickerVisible(!colorPickerVisible)}>
            <TextColor />
          </button>

          {/* Кнопка добавления ссылки */}
          <button onClick={handleAddLink}>
            <Link />
          </button>

          {/* Выбор размера шрифта */}
          <CustomSelect
            options={fontSizeOptions}
            value={currentFontSize}
            onChange={(newSize: string) => {
              setCurrentFontSize(newSize)
              const newEditorState = RichUtils.toggleInlineStyle(
                editorState,
                `FONT_SIZE_${newSize}`
              )
              updateEditorState(newEditorState)
            }}
          />

          {/* Кнопка сохранения */}
          <button className={styles.saveAnswer} onClick={handleSave}>
            Сохранить
          </button>
          <div className={styles.saveMessage}>Сохранено!</div>
        </div>

        {/* Палитра цветов */}
        {colorPickerVisible && (
          <div className={styles.colorPicker}>
            <div className={styles.colorContent}>
              <div className={styles.colorText}>
                <button
                  className={`${styles.colorLetter} ${styles.blackLetter}`}
                  onClick={() => applyTextColor('BLACK')}>
                  A
                </button>
                <button
                  className={`${styles.colorLetter} ${styles.redLetter}`}
                  onClick={() => applyTextColor('RED')}>
                  A
                </button>
                <button
                  className={`${styles.colorLetter} ${styles.greenLetter}`}
                  onClick={() => applyTextColor('GREEN')}>
                  A
                </button>
                <button
                  className={`${styles.colorLetter} ${styles.grayLetter}`}
                  onClick={() => applyTextColor('GRAY')}>
                  A
                </button>
              </div>

              <div className={styles.colorSquares}>
                <button
                  className={`${styles.colorButton} ${styles.blackButton}`}
                  onClick={() => applyBackgroundColor('BACKGROUND_BLACK')}>
                  A
                </button>
                <button
                  className={`${styles.colorButton} ${styles.redButton}`}
                  onClick={() => applyBackgroundColor('BACKGROUND_RED')}>
                  A
                </button>
                <button
                  className={`${styles.colorButton} ${styles.greenButton}`}
                  onClick={() => applyBackgroundColor('BACKGROUND_GREEN')}>
                  A
                </button>
                <button
                  className={`${styles.colorButton} ${styles.grayButton}`}
                  onClick={() => applyBackgroundColor('BACKGROUND_GRAY')}>
                  A
                </button>
              </div>
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setColorPickerVisible(false)}>
              <Close />
            </button>
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      {/* Редактор */}
      <div className={styles.editorContent}>
        <Editor
          editorState={editorState}
          onChange={updateEditorState}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={styleMap}
        />
      </div>
      {showNodeModal && (
        <NodeModalLink
          sections={availableNodes}
          onSelectNodes={addNodeLink}
          onClose={() => setShowNodeModal(false)}
          scriptId={scriptId}
          scenarioId={scenarioId}
          sectionId={sectionId}
          nodeId={nodeId}
        />
      )}
    </div>
  )
}

export default TextEditor
