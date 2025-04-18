import React from 'react'
import classNames from 'classnames'

import { NextArrow, Prev } from '@/shared/assets/icons'

import styles from './Pagination.module.scss'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange
}) => {
  const renderPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages === 0) {
      return pages
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      if (i !== totalPages) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages.map((page, index) => (
      <button
        key={index}
        className={classNames(styles.pageButton, {
          [styles.active]: page === currentPage
        })}
        onClick={() => typeof page === 'number' && onPageChange(page)}
        disabled={typeof page === 'string'}>
        {page}
      </button>
    ))
  }

  return (
    <div className={styles.pagination}>
      <button
        className={classNames(styles.prevButton, {
          [styles.disabled]: currentPage === 1
        })}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        <Prev />
      </button>
      {renderPageNumbers()}
      <button
        className={classNames(styles.nextButton, {
          [styles.disabled]: currentPage === totalPages
        })}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <NextArrow />
      </button>
    </div>
  )
}

export default Pagination
