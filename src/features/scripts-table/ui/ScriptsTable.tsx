import React, { useState } from 'react'

import { Burger, EditScript, Search } from '@/shared/assets/icons'
import { Script } from '@/entities/user-script'

import styles from './ScriptsTable.module.scss'

type SortableKeys = keyof Script | 'company'

interface ScriptTableProps {
  scripts: Script[]
}

const ScriptTable: React.FC<ScriptTableProps> = ({ scripts }) => {
  const [filter, setFilter] = useState<string>('')

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys
    direction: 'ascending' | 'descending' | null
  } | null>(null)

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

  return (
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
            <td>{script.title}</td>
            <td>{script.company.name}</td>
            <td>{new Date(script.updated_at).toLocaleDateString()}</td>
            <td>
              <div className={styles.actions}>
                <button type="button" className={styles.btn}>
                  <EditScript />
                </button>
                <button type="button" className={styles.btn}>
                  <Burger />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ScriptTable
