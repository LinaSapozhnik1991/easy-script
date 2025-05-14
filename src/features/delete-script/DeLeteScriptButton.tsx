/* eslint-disable no-console */

import React, { useState } from 'react'

import { Delete } from '@/shared/assets/icons'

import { deleteScriptById } from './api'

interface DeleteScriptButtonProps {
  scriptId: string
  onDeleteSuccess: () => void
  onError: (error: string) => void
}

const DeleteScriptButton: React.FC<DeleteScriptButtonProps> = ({
  scriptId,
  onDeleteSuccess
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    console.log('Deleting script with ID:', scriptId)

    setLoading(true)
    try {
      await deleteScriptById(scriptId)
      onDeleteSuccess()
    } catch (error) {
      console.error('Delete script error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {<Delete />} Удалить
    </button>
  )
}

export default DeleteScriptButton
