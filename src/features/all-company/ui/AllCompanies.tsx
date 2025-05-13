/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react'

import { Accordion } from '@/shared/ui/Accordion/Accordion'
import Radio from '@/shared/ui/Radio/Radio'
import { Down, Up } from '@/shared/assets/icons'
import { userMe } from '@/entities/user-profile/api' // Импортируйте функцию для получения пользователя

import styles from './AllCompanies.module.scss'

export interface AllCompaniesProps {
  label: React.ReactNode
  disabled?: boolean
  mode: 'bordered' | 'filled' | 'clear'
  onSelectCompany?: (id: string) => void
}

type CompanyItem = {
  name: string
  id: string
  disabled?: boolean
}

export const AllCompanies: FC<AllCompaniesProps> = ({
  disabled,
  onSelectCompany
}) => {
  const [companies, setCompanies] = useState<CompanyItem[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserCompanies = async () => {
      setLoading(true)
      try {
        const fetchedUserFromApi = await userMe()
        if (fetchedUserFromApi && fetchedUserFromApi.companies) {
          setCompanies(
            fetchedUserFromApi.companies.map(company => ({
              id: company.id.toString(),
              name: company.name
            }))
          )
        }
      } catch (error) {
        console.error('Ошибка при получении компаний пользователя:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserCompanies()
  }, [])

  const handleRadioChange = (id: string) => {
    setSelectedCompanyId(id)
    if (onSelectCompany) {
      onSelectCompany(id)
    }
  }

  const items = companies.map(company => ({
    content: (
      <div className={styles.radioItem} key={company.id}>
        <Radio
          id={company.id}
          size="medium"
          label={company.name}
          isDefault={selectedCompanyId === company.id}
          disabled={company.disabled}
          onChange={(event, checked) => {
            if (checked) {
              handleRadioChange(company.id)
            }
          }}
        />
      </div>
    ),
    disabled: company.disabled,
    key: company.id
  }))

  if (loading) {
    return <div>Загрузка...</div>
  }

  const displayLabel = selectedCompanyId
    ? companies.find(company => company.id === selectedCompanyId)?.name ||
      'Все компании'
    : 'Все компании'

  return (
    <div className={styles.allCompanies}>
      <Accordion
        label={displayLabel}
        items={items}
        disabled={disabled}
        mode="bordered"
        iconClose={<Up />}
        iconOpen={<Down />}
      />
    </div>
  )
}
