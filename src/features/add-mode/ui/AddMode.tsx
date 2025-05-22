import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'
import { Scenario, Section } from '@/entities/section/ui/Section'

export interface AddModeProps {
  onAddSection: (newSection: Section) => Promise<void>
  scenarios: Scenario[]
  scriptId: string
  scenarioId: string
}

const AddMode: React.FC<AddModeProps> = ({
  onAddSection,
  scenarios,
  scriptId,
  scenarioId
}) => {
  const handleClick = () => {
    const newSection: Section = {
      id: `temp-${Date.now()}`,
      title: 'Новый раздел',
      scriptId: scriptId,
      script_id: scriptId,
      scenario_id: scenarioId,
      scenarioId: scenarioId,
      scenarios: scenarios,
      isNew: true
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
