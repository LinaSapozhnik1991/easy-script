'use client'

import React, { useEffect } from 'react'

import useModalStore from '@/shared/Modal/model/useModalStore'
import Modal from '@/shared/Modal/ui'
import ScriptModal from '@/features/script-modal/ui/ScriptModal'

const ScriptModalLayout: React.FC<{ children: React.ReactNode }> = ({
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

  return (
    <>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ScriptModal onClose={closeModal} />
      </Modal>
    </>
  )
}

export default ScriptModalLayout
