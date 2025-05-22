import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'

import 'draft-js/dist/Draft.css'
import {
  Bold,
  Close,
  Cursive,
  Link,
  TextColor,
  Underline
} from '@/shared/assets/icons'

import { saveNodeData } from '../api'

import styles from './TextEditor.module.scss'
import CustomSelect from './CustomSelect'

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
  FONT_SIZE_48px: { fontSize: '48px' }
}

export interface NodeData {
  title: string
  text: string
  weight: number | null
  is_target: boolean
}
interface TextEditorProps {
  editorState: EditorState
  onEditorStateChange: (state: EditorState) => void
  scriptId: string | number
  scenarioId: string | number
  sectionId: string | number
  nodeId: string
  initialNodeData: NodeData
}

const TextEditor: React.FC<TextEditorProps> = ({
  editorState,
  onEditorStateChange,
  scriptId,
  scenarioId,
  sectionId,
  nodeId,
  initialNodeData
}) => {
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [currentFontSize, setCurrentFontSize] = useState('18px')
  const [currentTextColor, setCurrentTextColor] = useState('BLACK')

  const options = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '32px', label: '32' },
    { value: '48px', label: '48' }
  ]

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onEditorStateChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const setEditorState = (newState: EditorState) => {
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
    setEditorState(RichUtils.toggleInlineStyle(editorState, style))
  }

  const addLink = () => {
    const url = prompt('Введите URL ссылки:', 'http://')
    if (url) {
      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url }
      )
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity
      })
      setEditorState(
        RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        )
      )
    }
  }

  const applyTextColor = (colorKey: string) => {
    toggleInlineStyle(colorKey)
    closeColorPicker()
  }

  const applyBackgroundColor = (colorKey: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, colorKey))
    closeColorPicker()
  }

  const closeColorPicker = () => {
    setColorPickerVisible(false)
  }

  const isStyleActive = (style: string) =>
    editorState.getCurrentInlineStyle().has(style)
  const handleSave = async () => {
    try {
      await saveNodeData({
        editorState,
        initialNodeData,
        scriptId,
        scenarioId,
        sectionId,
        nodeId
      })
    } catch {}
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorPanel}>
        <div className={styles.editorButton}>
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
          <button onClick={() => setColorPickerVisible(!colorPickerVisible)}>
            <TextColor />
          </button>
          <button onClick={addLink}>
            <Link />
          </button>

          <CustomSelect
            options={options}
            value={currentFontSize}
            onChange={(newSize: string) => {
              setCurrentFontSize(newSize)
              const newEditorState = RichUtils.toggleInlineStyle(
                editorState,
                `FONT_SIZE_${newSize}`
              )
              setEditorState(newEditorState)
            }}
          />
          <button className={styles.saveAnswer} onClick={handleSave}>
            Сохранить
          </button>
        </div>

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

            <button className={styles.closeButton} onClick={closeColorPicker}>
              <Close />
            </button>
          </div>
        )}
      </div>
      <hr />
      <div className={styles.text}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  )
}

export default TextEditor
