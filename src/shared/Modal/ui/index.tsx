import React, { FC, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import usePortal from '../lib/hooks/usePortal'

import styles from './Modal.module.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}
// types/modalTypes.ts
export type ModalId = 'script-edit' | 'target-select' | 'confirmation'

export interface ModalContent {
  isOpen: boolean
  content: React.ReactNode | null
}

export interface ModalState {
  modals: Record<ModalId, ModalContent>
  openModal: (modalId: ModalId, content: React.ReactNode) => void
  closeModal: (modalId: ModalId) => void
}
const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const portalRoot = usePortal('modal-root')

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!isOpen || !portalRoot) return null

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>
        {children}
      </div>
    </>,
    portalRoot
  )
}

export default Modal
