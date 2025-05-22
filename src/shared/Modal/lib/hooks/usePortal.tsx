import { useEffect, useState } from 'react'

const usePortal = (id: string) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const element = document.createElement('div')
    element.setAttribute('id', id)
    document.body.appendChild(element)

    setPortalRoot(element)
    return () => {
      if (element && document.body.contains(element)) {
        document.body.removeChild(element)
      }
    }
  }, [id])

  return portalRoot
}

export default usePortal
