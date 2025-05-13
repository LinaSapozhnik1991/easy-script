'use client'
import { useEffect, useState } from 'react'

import FilterComponent from '@/features/filter-row/ui/FilterComponent'
import BuildScripts from '@/features/build-scripts/ui/BuildScripts'
import ScriptTable from '@/features/scripts-table/ui/ScriptsTable'
import useModalStore from '@/shared/Modal/model/useModalStore'
import ScriptModal from '@/features/script-modal/ui/ScriptModal'
import { AllCompanies } from '@/features/all-company/ui/AllCompanies'
import { Plus } from '@/shared/assets/icons'
import Pagination from '@/shared/ui/Pagination/Pagination'
import { getScripts } from '@/features/scripts-table/api'
import { Script } from '@/entities/user-script'

import styles from './MyScripts.module.scss'

const MyScripts = () => {
  const { openModal, closeModal } = useModalStore()
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage')
    return savedPage ? Number(savedPage) : 1
  })
  const [totalPages, setTotalPages] = useState(0)
  const scriptsPerPage = 10
  const [scripts, setScripts] = useState<Script[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('currentPage')
      if (savedPage) {
        setCurrentPage(Number(savedPage))
      }
    }
  }, [])

  useEffect(() => {
    const fetchScripts = async () => {
      const result = await getScripts()
      if ('error' in result) {
        return
      }
      setScripts(result)
      setTotalPages(Math.ceil(result.length / scriptsPerPage))
    }

    fetchScripts()
  }, [])

  useEffect(() => {
    localStorage.setItem('currentPage', String(currentPage))
  }, [currentPage])

  const handleOpenModal = () => {
    openModal(<ScriptModal onClose={closeModal} />)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const indexOfLastScript = currentPage * scriptsPerPage
  const indexOfFirstScript = indexOfLastScript - scriptsPerPage
  const currentScripts = scripts.slice(indexOfFirstScript, indexOfLastScript)

  return (
    <div className={styles.myScripts}>
      <div className={styles.scriptsHead}>
        <div className={styles.scriptHeadLeft}>
          <AllCompanies label="Все компании" mode="bordered" />
          <FilterComponent />
        </div>
        <div className={styles.buildScripts}>
          <BuildScripts openModal={handleOpenModal}>
            Создать скрипт <Plus />
          </BuildScripts>
        </div>
      </div>

      <div className={styles.allScripts}>
        <ScriptTable scripts={currentScripts} />
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default MyScripts
