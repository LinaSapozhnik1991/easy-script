import React, { useState } from 'react'

import styles from './ScriptsTable.module.scss'
import {
  CallScript,
  CloseScript,
  EditScript,
  Search
} from '@/shared/assets/icons'
interface Script {
  id: number
  name: string
  company: string
  lastModified: string
}

const initialScripts: Script[] = [
  {
    id: 1,
    name: 'Скрипт 1',
    company: 'Компания А',
    lastModified: '01.01.2023'
  },
  { id: 2, name: 'Скрипт 2', company: 'Компания Б', lastModified: '02.01.2023' }
]

const ScriptTable: React.FC = () => {
  const [filter, setFilter] = useState<string>('')
  const scripts = initialScripts

  const filteredScripts = scripts.filter(script =>
    script.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={`${styles.th} ${styles.thNumber}`}>№</th>
          <th className={`${styles.th} ${styles.thName}`}>
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
          <th className={`${styles.th} ${styles.thCompany}`}>Компания</th>
          <th className={`${styles.th} ${styles.thDate}`}>
            Дата последнего изменения
          </th>
          <th className={`${styles.th} ${styles.thActions}`}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {filteredScripts.map(script => (
          <tr key={script.id} className={styles.dataScripts}>
            <td>{script.id}</td>
            <td>{script.name}</td>
            <td>{script.company}</td>
            <td>{script.lastModified}</td>
            <td>
              <div className={styles.actions}>
                <button type="button" className={styles.btn}>
                  <EditScript />
                </button>
                <button type="button" className={styles.btn}>
                  <CallScript />
                </button>
                <button type="button" className={styles.btn}>
                  <CloseScript />
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
