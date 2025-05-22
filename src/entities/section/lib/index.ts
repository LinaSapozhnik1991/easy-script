/* eslint-disable no-console */
import { create } from 'zustand'
import axios from 'axios'
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'
import { CreateSectionParams } from '@/features/add-mode/api'

import { Section } from '../ui/Section'

interface SectionState {
  sections: Section[]
  addSection: (section: Section) => void
  setSections: (sections: Section[]) => void
  removeSection: (id: string) => void
  createSection: (params: CreateSectionParams) => Promise<Section | null>
}

const useSectionStore = create<SectionState>(set => ({
  sections: [],
  addSection: section =>
    set(state => ({ sections: [...state.sections, section] })),
  setSections: sections => set({ sections }),
  removeSection: id =>
    set(state => ({
      sections: state.sections.filter(section => section.id !== id)
    })),
  createSection: async (
    params: CreateSectionParams
  ): Promise<Section | null> => {
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
        { headers: { Authorization: `Bearer ${token}` } }
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
