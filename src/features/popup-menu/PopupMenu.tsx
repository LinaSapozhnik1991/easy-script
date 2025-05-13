import React from 'react'
import styles from './PopupMenu.module.scss' // Импортируйте стили для вашего меню
import { Delete, Instruction, PersonCall } from '@/shared/assets/icons'

interface PopupMenuProps {
  onClose: () => void
  onViewDescription: () => void
  onInvite: () => void
  onDelete: () => void
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  onClose,
  onViewDescription,
  onInvite,
  onDelete
}) => {
  return (
    <div className={styles.popupMenu}>
      <button
        onClick={() => {
          onViewDescription()
          onClose()
        }}>
        <Instruction /> Посмотреть описание
      </button>
      <button
        onClick={() => {
          onInvite()
          onClose()
        }}>
        <PersonCall /> Пригласить
      </button>
      <button
        onClick={() => {
          onDelete()
          onClose()
        }}>
        <Delete /> Удалить
      </button>
    </div>
  )
}

export default PopupMenu
