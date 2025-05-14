import React from 'react'

import { Button } from '@/shared/ui/Button'
import { PlusGreen } from '@/shared/assets/icons'

const AddHeadMode = () => {
  return (
    <Button scriptStyle size="largeMode">
      <PlusGreen /> Добавить заголовок раздела
    </Button>
  )
}

export default AddHeadMode
