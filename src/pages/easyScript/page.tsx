'use client'
import React, { useState } from 'react'

import MainSection from '@/widgets/main-feature-section/ui/MainSection'
import FeedbackSection from '@/widgets/feedback-section/ui'
import FooterMain from '@/widgets/footerMain'
import SentenseFeatureSection from '@/widgets/sentense-feature-section'
import ScrollUp from '@/shared/ui/ScrollUp/ScrollUp'
import Pagination from '@/shared/ui/Pagination/Pagination'
import AdvantagesSection from '@/widgets/advantage-section'

import styles from './EasyScript.module.scss'

const EasyScript = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  return (
    <div className={styles.scripts}>
      <MainSection />
      <AdvantagesSection />
      <FeedbackSection />
      <div className={styles.easy}>
        <SentenseFeatureSection />
      </div>
      <div className={styles.CaretUp}>
        <ScrollUp />
      </div>
      <FooterMain showLinks={false} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default EasyScript
