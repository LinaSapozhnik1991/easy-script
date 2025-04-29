import React from 'react'

import { Plus, Close } from '@/shared/assets/icons' // Импортируем иконки
import { Accordion } from '@/shared/ui/Accordion/Accordion'

//import styles from './BuildScripts.model.scss'
const BuildScripts = () => {
  const items = [
    { content: 'Пустой скрипт' },
    { content: 'Шаблон 1' },
    { content: 'Шаблон 2' },
    { content: 'Шаблон 3' },
    { content: 'Шаблон 4' },
    { content: 'Шаблон 5' }
  ]

  return (
    <div>
      <Accordion
        items={items}
        label="Создать скрипт"
        mode="filled"
        iconOpen={<Plus />}
        iconClose={<Close />}
      />
    </div>
  )
}

export default BuildScripts
