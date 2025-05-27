/* eslint-disable no-console */
import { convertFromRaw, convertToRaw, EditorState, RichUtils } from 'draft-js'

export const serializeEditorState = (editorState: EditorState): string => {
  const rawContent = convertToRaw(editorState.getCurrentContent())
  const styles = editorState.getCurrentInlineStyle().toArray()
  const fontSizeStyle = styles.find(style => style.startsWith('FONT_SIZE_'))
  const textColorStyle = styles.find(style =>
    ['RED', 'GREEN', 'BLACK', 'GRAY'].includes(style)
  )

  return JSON.stringify({
    content: rawContent,
    styles,
    currentStyles: {
      fontSize: fontSizeStyle,
      textColor: textColorStyle
    }
  })
}

export const deserializeToEditorState = (serialized: string): EditorState => {
  try {
    const { content, styles, currentStyles } = JSON.parse(serialized)
    const rawContent = convertFromRaw(content)
    let editorState = EditorState.createWithContent(rawContent)

    // Применяем все сохраненные стили
    styles.forEach((style: string) => {
      editorState = RichUtils.toggleInlineStyle(editorState, style)
    })

    // Применяем текущие стили, если они есть
    if (currentStyles) {
      if (currentStyles.fontSize) {
        editorState = RichUtils.toggleInlineStyle(
          editorState,
          currentStyles.fontSize
        )
      }
      if (currentStyles.textColor) {
        editorState = RichUtils.toggleInlineStyle(
          editorState,
          currentStyles.textColor
        )
      }
    }

    return editorState
  } catch (error) {
    console.error('Failed to deserialize editor content:', error)
    return EditorState.createEmpty()
  }
}
