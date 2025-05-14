import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'

const AddMode = () => {
  return (
    <Button scriptStyle size="largeMode">
      <PlusGreen /> Добавить раздел
    </Button>
  )
}

export default AddMode
