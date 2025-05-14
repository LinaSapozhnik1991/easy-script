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
import useScriptStore from '@/entities/user-script/lib/useScriptStore'

import styles from './MyScripts.module.scss'

const MyScripts = () => {
  const { openModal, closeModal } = useModalStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const scriptsPerPage = 10
  const { scripts, fetchScripts } = useScriptStore()

  useEffect(() => {
    const loadScripts = async () => {
      await fetchScripts()
      setTotalPages(Math.ceil(scripts.length / scriptsPerPage))
    }

    loadScripts()
  }, [fetchScripts, scripts.length])

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
