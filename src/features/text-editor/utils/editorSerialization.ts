/* eslint-disable no-console */
// utils/editorSerialization.ts
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState
} from 'draft-js'

export const serializeEditorState = (editorState: EditorState): string => {
  const rawContent = convertToRaw(editorState.getCurrentContent())
  return JSON.stringify(rawContent) // Просто сохраняем rawContent без дополнительной обработки
}

export const deserializeToEditorState = (serialized: string): EditorState => {
  try {
    const rawContent: RawDraftContentState = JSON.parse(serialized)
    return EditorState.createWithContent(convertFromRaw(rawContent))
  } catch (error) {
    console.error('Failed to deserialize editor content:', error)
    return EditorState.createEmpty() // Возвращаем пустой редактор при ошибке
  }
}
