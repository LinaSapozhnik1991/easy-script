import React, { FC, useState } from 'react'

import { Accordion } from '@/shared/ui/Accordion/Accordion' // Импортируем аккордеон
import Radio from '@/shared/ui/Radio/Radio'
import { Down, Up } from '@/shared/assets/icons'

import styles from './AllCompanies.module.scss'

export interface AllCompaniesProps {
  companies: CompanyItem[]
  label: React.ReactNode
  disabled?: boolean
  mode: 'bordered' | 'filled' | 'clear'
}

type CompanyItem = {
  name: string
  id: string
  disabled?: boolean
}

export const AllCompanies: FC<AllCompaniesProps> = ({
  companies,
  label,
  disabled,
  mode
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  )

  const handleRadioChange = (id: string) => {
    setSelectedCompanyId(id)
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
    disabled: company.disabled
  }))

  return (
    <div className={styles.allCompanies}>
      <Accordion
        label={label}
        items={items}
        disabled={disabled}
        mode={mode}
        iconClose={<Up />}
        iconOpen={<Down />}
      />
    </div>
  )
}
