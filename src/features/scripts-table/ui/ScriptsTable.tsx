/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react'

import { Burger, EditScript, Search } from '@/shared/assets/icons'
import { Script } from '@/entities/user-script'
import PopupMenu from '@/features/popup-menu/ui/PopupMenu'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'

import styles from './ScriptsTable.module.scss'
import { useRouter } from 'next/navigation'
import { Routers } from '@/shared/routes'

type SortableKeys = keyof Script | 'company'

interface ScriptTableProps {
  scripts: Script[]
}

const ScriptTable: React.FC<ScriptTableProps> = ({ scripts }) => {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('')
  const { deleteScript } = useScriptStore()

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys
    direction: 'ascending' | 'descending' | null
  } | null>(null)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [popupPosition, setPopupPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  const filteredScripts = React.useMemo(
    () =>
      scripts.filter(script =>
        script.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [scripts, filter]
  )

  const sortedScripts = React.useMemo(() => {
    if (!sortConfig) return filteredScripts

    return [...filteredScripts].sort((a, b) => {
      let aValue: string | undefined
      let bValue: string | undefined

      if (sortConfig.key === 'company') {
        aValue = String(a.company.name)
        bValue = String(b.company.name)
      } else {
        aValue = String(a[sortConfig.key])
        bValue = String(b[sortConfig.key])
      }

      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1
      return 0
    })
  }, [filteredScripts, sortConfig])

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' | null = 'ascending'
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : null
    }
    setSortConfig(direction ? { key, direction } : null)
  }

  const handleBurgerClick = (
    script: Script,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const popupWidth = 200
    const offset = 10

    const top = buttonRect.bottom + offset
    let left = buttonRect.left + buttonRect.width - popupWidth
    if (left < 0) {
      left = 0
    }
    if (left - popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth
    }

    setPopupPosition({ top, left })
    setSelectedScript(script)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedScript(null)
    setPopupPosition(null)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      handleClosePopup()
    }
  }

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, showPopup])

  const handleViewDescription = () => {
    console.log('Просмотр описания для', selectedScript)
  }
  const handleInvite = () => {
    console.log('Пригласить', selectedScript)
  }

  const handleDelete = async () => {
    if (selectedScript) {
      deleteScript(selectedScript.id)
      handleClosePopup()
    }
  }
  const handleScriptClick = (scriptId: string) => {
    router.push(`${Routers.Construction}/${scriptId}`)
  }
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.thNumber}`}>№</th>
            <th
              className={`${styles.th} ${styles.thName}`}
              onClick={() => requestSort('title')}
              style={{ cursor: 'pointer' }}>
              Название скрипта
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Поиск"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className={styles.inputFilter}
                />
                <Search className={styles.inputIcon} />
              </div>
            </th>
            <th
              className={`${styles.th} ${styles.thCompany}`}
              onClick={() => requestSort('company')}
              style={{ cursor: 'pointer' }}>
              Компания
            </th>
            <th
              className={`${styles.th} ${styles.thDate}`}
              onClick={() => requestSort('updated_at')}
              style={{ cursor: 'pointer' }}>
              Дата последнего изменения
            </th>
            <th className={`${styles.th} ${styles.thActions}`}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedScripts.map((script, index) => (
            <tr key={script.id} className={styles.dataScripts}>
              <td>{index + 1}</td>
              <td
                onClick={() => handleScriptClick(script.id)}
                style={{ cursor: 'pointer' }}
                className={styles.clickableTitle}>
                {script.title}
              </td>
              <td>{script.company.name}</td>
              <td>{new Date(script.updated_at).toLocaleDateString()}</td>
              <td>
                <div className={styles.actions}>
                  <button type="button" className={styles.btn}>
                    <EditScript />
                  </button>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={event => handleBurgerClick(script, event)}>
                    <Burger />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && selectedScript && popupPosition && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left
          }}>
          <PopupMenu
            scriptId={selectedScript.id}
            onClose={handleClosePopup}
            onViewDescription={handleViewDescription}
            onInvite={handleInvite}
            onDelete={handleDelete}
          />
        </div>
      )}
    </>
  )
}

export default ScriptTable
