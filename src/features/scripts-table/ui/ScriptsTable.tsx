import React, { useState } from 'react'

import styles from './ScriptsTable.module.scss'
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
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.thNumber}`}>№</th>
            <th className={`${styles.th} ${styles.thName}`}>
              Название скрипта
              <input
                type="text"
                placeholder="Фильтр по названию"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className={styles.inputFilter}
              />
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
                <div className="actions"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScriptTable
