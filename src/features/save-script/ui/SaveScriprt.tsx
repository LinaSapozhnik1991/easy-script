import React from 'react'

import { Button } from '@/shared/ui/Button'
import { AnswerNode } from '@/entities/section/ui/Section'

import { SaveScriptParams } from '../types'
import { useSaveScript } from '../hook/useSaveScript'

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
  selectedAnswer,
  editorState,
  getSectionNodes,
  onSuccess,
  onError
}) => {
  const { saveScript } = useSaveScript({
    scriptId,
    scenarioId,
    selectedAnswer,
    editorState,
    getSectionNodes
  })

  const handleClick = async () => {
    const result = await saveScript()
    if (result.success) {
      onSuccess?.(result.data)
    } else {
      onError?.(result.error || 'Неизвестная ошибка')
    }
  }

  return (
    <Button borderMedium primary size="medium" onClick={handleClick}>
      Сохранить скрипт
    </Button>
  )
}
