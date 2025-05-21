import { Company } from '../company'
import { Section } from '../section/ui/Section'

export interface Creator {
  id: string
  name: string
}

export interface Type {
  id: string
  name: string
}
export interface Scenarios {
  scenarioId: string
  id: number | string
  script_id: number | string
  title: string
  description?: string | null
  weight?: number
}
export interface Script {
  id: string
  title: string
  description: string
  target: string
  company_id: string
  user_id: number
  type_id: number
  created_at: string
  updated_at: string
  creator: Creator
  company: Company
  scenarios: Scenarios[]
  type: Type
  companies?: Company[]
  sections?: Section[]
}
export interface ScriptResponse {
  id: string
  title: string
  description: string
  target: string
  company_id: number
  user_id: number
  type_id: number
  created_at: string
  updated_at: string
  script: Script
  scenarios: Scenarios[]
}
