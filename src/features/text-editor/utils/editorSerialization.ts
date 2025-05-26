/* eslint-disable no-console */
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState
} from 'draft-js'

export const serializeEditorState = (
  editorState: EditorState,
  styles: { fontSize: string; color: string }
) => {
  const rawContent = convertToRaw(editorState.getCurrentContent())
  return JSON.stringify({
    content: rawContent,
    styles // Добавляем стили в сериализованные данные
  })
}

export const deserializeToEditorState = (serialized: string): EditorState => {
  try {
    const rawContent: RawDraftContentState = JSON.parse(serialized)
    return EditorState.createWithContent(convertFromRaw(rawContent))
  } catch (error) {
    console.error('Failed to deserialize editor content:', error)
    return EditorState.createEmpty()
  }
}
