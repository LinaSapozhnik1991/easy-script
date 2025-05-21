import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'
import { Section } from '@/entities/section/ui/Section'
import { Scenarios } from '@/entities/user-script'

export interface AddModeProps {
  onAddSection: (newSection: Section) => Promise<void>
  scenarios: Scenarios[]
}

const AddMode: React.FC<AddModeProps> = ({ onAddSection }) => {
  const handleClick = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'Новый раздел',
      scriptId: '',
      scenarioId: '',
      scenarios: []
    }
    onAddSection(newSection)
  }
  return (
    <Button scriptStyle size="largeMode" onClick={handleClick}>
      <PlusGreen /> Добавить раздел
    </Button>
  )
}

export default AddMode
