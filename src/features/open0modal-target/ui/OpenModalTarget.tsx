import React, { ReactNode } from 'react'

import { Button } from '../../../shared/ui/Button'

interface OpenModalTargetProps {
  children: ReactNode
  openPopup: () => void
}
const OpenModalTarget: React.FC<OpenModalTargetProps> = ({
  children,
  openPopup
}) => {
  return (
    <Button scriptStyle size="largeMode" onClick={openPopup}>
      {children}
    </Button>
  )
}

export default OpenModalTarget
