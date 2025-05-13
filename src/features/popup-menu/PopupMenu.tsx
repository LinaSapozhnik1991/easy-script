import React from 'react'
import styles from './PopupMenu.module.scss' // Импортируйте стили для вашего меню

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
        Посмотреть описание
      </button>
      <button
        onClick={() => {
          onInvite()
          onClose()
        }}>
        Пригласить
      </button>
      <button
        onClick={() => {
          onDelete()
          onClose()
        }}>
        Удалить
      </button>
    </div>
  )
}

export default PopupMenu
