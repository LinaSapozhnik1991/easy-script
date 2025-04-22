import React from 'react'

import { Pencil } from '@/shared/assets/icons'

//import styles from './EditButton.module.scss' // Подключите ваши стили

interface EditButtonProps {
  onClick: () => void
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} aria-label="Редактировать">
      <Pencil />
    </button>
  )
}

export default EditButton
