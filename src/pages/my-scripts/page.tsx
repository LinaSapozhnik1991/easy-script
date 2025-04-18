'use  client'
import React, { useEffect, useState } from 'react'

import { getScripts, Script } from './api'
import styles from './MyScripts.module.scss'
import Pagination from '@/shared/ui/Pagination/Pagination'

const MyScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchScripts = async () => {
      const scriptsData = await getScripts()
      if (scriptsData) {
        setScripts(scriptsData)
        setTotalPages(Math.ceil(scriptsData.length / 10))
      } else {
        setError('Не удалось получить скрипты')
      }
    }

    fetchScripts()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  return (
    <div className={styles.myScripts}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className={styles.allScripts}>
        <tbody>
          {scripts.map((script, index) => (
            <tr key={script.id}>
              <td>{index + 1}</td>
              <td>{script.title}</td>
              <td>{script.company.name}</td>
              <td>{new Date(script.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default MyScripts
