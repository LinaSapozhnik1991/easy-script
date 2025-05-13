import { Company } from '../company'

export interface Creator {
  id: string
  name: string
}

export interface Type {
  id: string
  name: string
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
  type: Type
  companies?: Company[]
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
}
