'use client'

import React, { useEffect, useState } from 'react'

import useModalStore from '@/shared/Modal/model/useModalStore'
import Modal from '@/shared/Modal/ui'
import AuthSegmentedControl from '@/widgets/auth-segment-control/ui/AuthSegmentedControl'

const ModalRootLayout: React.FC<{ children: React.ReactNode }> = ({
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
  const [selectedOption, setSelectedOption] = useState('Регистрация')
  const handleSelectOption = (option: string) => {
    // eslint-disable-next-line no-console
    console.log('Selected option changed to:', option)
    setSelectedOption(option)
  }
  return (
    <>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <AuthSegmentedControl
          selectedOption={selectedOption}
          onSelect={handleSelectOption}
        />
      </Modal>
    </>
  )
}

export default ModalRootLayout
