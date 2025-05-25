/* eslint-disable no-console */
import { toast } from 'react-toastify'

import { getSectionNodes } from '@/entities/section/api/node'
import { AnswerNode } from '@/entities/section/ui/Section'

import { SaveScriptParams, SaveScriptResult } from '../types'
import { saveScriptApi } from '../api'

export const useSaveScript = ({
  scriptId,
  scenarioId,
  selectedAnswer,
  editorState
}: SaveScriptParams & {
  getSectionNodes: (
    sectionId: string,
    scriptId: string,
    scenarioId: string
  ) => Promise<AnswerNode[]>
}): { saveScript: () => Promise<SaveScriptResult> } => {
  const saveScript = async (): Promise<SaveScriptResult> => {
    try {
      if (!selectedAnswer) {
        toast.error('Выберите ответ для редактирования')
        return { success: false, error: 'No answer selected' }
      }

      if (!editorState.getCurrentContent().hasText()) {
        toast.error('Текст ответа не может быть пустым')
        return { success: false, error: 'Empty content' }
      }

      const nodes = await getSectionNodes(
        selectedAnswer.sectionId,
        scriptId,
        scenarioId
      )
      const hasTarget = nodes.some(node => node.is_target)

      if (!hasTarget) {
        toast.warning('Необходимо выбрать хотя бы одну цель')
        return { success: false, error: 'No target selected' }
      }

      const response = await saveScriptApi({
        id: scriptId,
        content: editorState.getCurrentContent().getPlainText()
      })

      if (response.success) {
        toast.success('Скрипт успешно сохранён')
        return { success: true, data: response.data }
      }

      toast.error(response.message || 'Ошибка при сохранении')
      return { success: false, error: response.message }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Произошла ошибка при сохранении')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return { saveScript }
}
