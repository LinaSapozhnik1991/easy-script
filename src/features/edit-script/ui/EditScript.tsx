import React, { ReactNode } from 'react'

import { Button } from '../../../shared/ui/Button'

interface OpenModalEditScriptProps {
  children: ReactNode
  openModal: () => void
}
const OpenModalEditScript: React.FC<OpenModalEditScriptProps> = ({
  children,
  openModal
}) => {
  return (
    <Button scriptStyle size="medium" onClick={openModal}>
      {children}
    </Button>
  )
}

export default OpenModalEditScript
