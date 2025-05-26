/* eslint-disable no-console */
import { convertFromRaw, convertToRaw, EditorState, RichUtils } from 'draft-js'

export const serializeEditorState = (editorState: EditorState): string => {
  const rawContent = convertToRaw(editorState.getCurrentContent())
  const styles = editorState.getCurrentInlineStyle().toArray() // Преобразуем в массив
  const serialized = JSON.stringify({ content: rawContent, styles })
  console.log('Serialized Editor State:', serialized) // Выводим сериализованное состояние
  return serialized
}

export const deserializeToEditorState = (serialized: string): EditorState => {
  try {
    const { content, styles } = JSON.parse(serialized)
    const rawContent = convertFromRaw(content)
    let editorState = EditorState.createWithContent(rawContent)

    styles.forEach((style: string) => {
      editorState = RichUtils.toggleInlineStyle(editorState, style)
    })

    return editorState
  } catch (error) {
    console.error('Failed to deserialize editor content:', error)
    return EditorState.createEmpty()
  }
}
