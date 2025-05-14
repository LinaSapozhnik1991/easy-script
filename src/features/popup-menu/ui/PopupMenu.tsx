/* eslint-disable no-console */
import React from 'react'

import { Instruction, PersonCall } from '@/shared/assets/icons'
import DeleteScriptButton from '@/features/delete-script/DeLeteScriptButton'

import styles from './PopupMenu.module.scss'

interface PopupMenuProps {
  onClose: () => void
  onViewDescription: () => void
  onInvite: () => void
  onDelete: () => void
  scriptId: string
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  onClose,
  onViewDescription,
  onInvite,
  onDelete,
  scriptId
}) => {
  const handleDeleteSuccess = () => {
    onDelete()
    onClose()
  }

  const handleError = (error: string) => {
    console.error(error)
  }
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
      <DeleteScriptButton
        scriptId={scriptId}
        onDeleteSuccess={handleDeleteSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default PopupMenu
