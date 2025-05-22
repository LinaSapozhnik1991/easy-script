import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'
import { Scenario, Section } from '@/entities/section/ui/Section'

export interface AddModeProps {
  onAddSection: (newSection: Section) => Promise<void>
  scenarios: Scenario[] // Убедитесь, что вы используете этот пропс
}

const AddMode: React.FC<AddModeProps> = ({ onAddSection, scenarios }) => {
  const handleClick = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'Новый раздел',
      scriptId: '', // Убедитесь, что здесь корректное значение
      scenarioId: '', // Убедитесь, что здесь корректное значение
      scenarios: scenarios // Используйте переданные сценарии
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
