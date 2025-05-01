'use client'
import React from 'react'

import { AllCompanies } from '@/features/all-company/ui/AllCompanies'
import FilterComponent from '@/features/filter-row/ui/FilterComponent'
import BuildScripts from '@/features/build-scripts/ui/BuildScripts'
import ScriptTable from '@/features/scripts-table/ui/ScriptsTable'

import styles from './MyScripts.module.scss'

const MyScripts = () => {
  const companiesData = [
    { name: 'Компания A', id: '1', disabled: false },
    { name: 'Компания B', id: '2', disabled: false },
    { name: 'Компания C', id: '3', disabled: false },
    { name: 'Компания D', id: '4', disabled: false },
    { name: 'Компания E', id: '5', disabled: false },
    { name: 'Компания F', id: '5', disabled: false }
  ]
  return (
    <div className={styles.myScripts}>
      <div className={styles.scriptsHead}>
        <div className={styles.scriptHeadLeft}>
          <AllCompanies
            companies={companiesData}
            label="Все компании"
            disabled={false}
            mode="bordered"
          />
          <FilterComponent />
        </div>
        <div className={styles.buildScripts}>
          <BuildScripts />
        </div>
      </div>

      <div className={styles.allScripts}>
        <ScriptTable />
      </div>
    </div>
  )
}

export default MyScripts
