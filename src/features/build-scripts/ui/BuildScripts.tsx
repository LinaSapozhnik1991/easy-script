import React, { ReactNode } from 'react'

import { Button } from '../../../shared/ui/Button'

interface OpenModalBuildScriptProps {
  children: ReactNode
  openModal: () => void
}
const OpenModalBuildScript: React.FC<OpenModalBuildScriptProps> = ({
  children,
  openModal
}) => {
  return (
    <Button primary size="mediumScript" onClick={openModal}>
      {children}
    </Button>
  )
}

export default OpenModalBuildScript
