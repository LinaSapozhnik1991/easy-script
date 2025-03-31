import React, { ReactNode } from 'react'

import { Button } from '../../../shared/ui/Button'

interface OpenModalLoginProps {
  primary?: boolean
  size?: 'small' | 'medium' | 'large' | 'mediumXL' | 'mediumXXL' | 'smallXL'
  children: ReactNode
  openModal: () => void
}
const OpenModalLogin: React.FC<OpenModalLoginProps> = ({
  primary = false,
  size,
  children,
  openModal
}) => {
  return (
    <Button primary={primary} size={size} onClick={openModal}>
      {children}
    </Button>
  )
}

export default OpenModalLogin
