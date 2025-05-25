import { EditorState } from 'draft-js'

import { AnswerNode } from '@/entities/section/ui/Section'

export interface Node {
  id: string
  is_target: boolean
}

export interface SaveScriptParams {
  scriptId: string
  scenarioId: string
  selectedAnswer: AnswerNode | null
  editorState: EditorState
}

export interface SaveScriptResult {
  success: boolean
  data?: unknown
  error?: string
}

export interface SaveScriptApiParams {
  id: string
  content: string
}
