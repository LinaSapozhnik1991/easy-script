import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'
import { Scenario, Section } from '@/entities/section/ui/Section'

export interface AddModeProps {
  onAddSection: (newSection: Section) => Promise<void>
  scenarios: Scenario[]
}

const AddMode: React.FC<AddModeProps> = ({ onAddSection, scenarios }) => {
  const handleClick = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'Новый раздел',
      scriptId: '',
      scenarioId: '',
      scenarios: scenarios
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
