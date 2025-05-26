import React from 'react'
import { convertToRaw } from 'draft-js'

import { Button } from '@/shared/ui/Button'
import { AnswerNode } from '@/entities/section/ui/Section'

import { SaveScriptParams } from '../types'
import { useSaveScript } from '../hook/useSaveScript'
import { saveScriptApi } from '../api'

interface SaveScriptProps extends SaveScriptParams {
  getSectionNodes: (
    sectionId: string,
    scriptId: string,
    scenarioId: string
  ) => Promise<AnswerNode[]>
  onSuccess?: (data?: unknown) => void
  onError?: (error: string) => void
}

export const SaveScript: React.FC<SaveScriptProps> = ({
  scriptId,
  scenarioId,
  sectionId,
  selectedAnswer,
  editorState,
  getSectionNodes,
  onSuccess,
  onError
}) => {
  useSaveScript({
    scriptId,
    scenarioId,
    sectionId,
    selectedAnswer,
    editorState,
    getSectionNodes
  })

  const handleClick = async () => {
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)

    const result = await saveScriptApi({
      id: scriptId,
      content: contentState.getPlainText(),
      rawContent,
      selectedAnswer,
      contentState
    })

    if (result.success) {
      onSuccess?.(result.data)
      alert('Скрипт сохранен!')
    } else {
      onError?.(result.message || 'Неизвестная ошибка')
    }
  }

  return (
    <Button borderMedium primary size="medium" onClick={handleClick}>
      Сохранить скрипт
    </Button>
  )
}
