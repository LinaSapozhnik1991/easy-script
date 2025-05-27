/* eslint-disable no-console */
import { create } from 'zustand'
import axios from 'axios'
import Cookies from 'js-cookie'
import { instance } from '@/shared/api'
import { Section, AnswerNode } from '../ui/Section'
import { CreateSectionParams } from '@/features/add-mode/api'

interface SectionState {
  sections: Section[]
  // Все узлы по секциям, для удобства, ключ — sectionId, значение — массив узлов
  nodesBySection: Record<string, AnswerNode[]>
  addSection: (section: Section) => void
  setSections: (sections: Section[]) => void
  removeSection: (id: string) => void
  setNodesForSection: (sectionId: string, nodes: AnswerNode[]) => void
  updateNode: (
    sectionId: string,
    nodeId: string,
    data: Partial<AnswerNode>
  ) => void
  createSection: (params: CreateSectionParams) => Promise<Section | null>
}

const useSectionStore = create<SectionState>((set, get) => ({
  sections: [],
  nodesBySection: {},

  addSection: section =>
    set(state => ({ sections: [...state.sections, section] })),

  setSections: sections => set({ sections }),

  removeSection: id =>
    set(state => ({
      sections: state.sections.filter(section => section.id !== id),
      // Можно и удалять узлы по удалённой секции, если хочешь
      nodesBySection: Object.fromEntries(
        Object.entries(get().nodesBySection).filter(([key]) => key !== id)
      )
    })),

  setNodesForSection: (sectionId, nodes) =>
    set(state => ({
      nodesBySection: {
        ...state.nodesBySection,
        [sectionId]: nodes
      }
    })),

  updateNode: (sectionId, nodeId, data) =>
    set(state => {
      const prevNodes = state.nodesBySection[sectionId] || []
      const updatedNodes = prevNodes.map(node =>
        node.id === nodeId ? { ...node, ...data } : node
      )
      return {
        nodesBySection: {
          ...state.nodesBySection,
          [sectionId]: updatedNodes
        }
      }
    }),

  createSection: async (params: CreateSectionParams) => {
    if (!params.title || !params.scriptId || !params.scenarioId) {
      console.error(
        'Invalid parameters: title, scriptId, or scenarioId is missing',
        params
      )
      return null
    }

    const token = Cookies.get('token')
    if (!token) {
      console.error('No authorization token found.')
      return null
    }

    try {
      const response = await instance.post(
        `/scripts/${params.scriptId}/scenarios/${params.scenarioId}/sections`,
        { title: params.title },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const newSection = response.data.data
      if (newSection) {
        set(state => ({ sections: [...state.sections, newSection] }))
      }
      console.log('Section created successfully:', newSection)
      return newSection
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating section:', {
          message: error.response?.data?.message || 'Unknown error',
          status: error.response?.status
        })
      } else {
        console.error('Unexpected error:', error)
      }
      return null
    }
  }
}))

export default useSectionStore
