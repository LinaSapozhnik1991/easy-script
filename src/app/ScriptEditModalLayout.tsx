'use client'

import React, { useEffect } from 'react'

import useModalStore from '@/shared/Modal/model/useModalStore'
import Modal from '@/shared/Modal/ui'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import ScriptEditModal from '@/features/script-edit-modal/ui/ScriptEditModal'

const ScriptEditModalLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  useEffect(() => {
    const modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(modalRoot)

    return () => {
      document.body.removeChild(modalRoot)
    }
  }, [])

  const { isOpen, closeModal } = useModalStore()
  const { scriptName } = useScriptStore()
  const { scriptId } = useScriptStore()
  return (
    <>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ScriptEditModal
          scriptName={scriptName || 'Без названия'}
          onClose={closeModal}
          scriptId={scriptId}
        />
      </Modal>
    </>
  )
}

export default ScriptEditModalLayout
