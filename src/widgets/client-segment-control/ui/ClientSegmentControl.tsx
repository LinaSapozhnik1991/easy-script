import React, { FC } from 'react'

import SegmentedControl from '@/shared/ui/SegmentedControl/SegmentedControl'
import ClientCard from '@/widgets/client-card/ui/ClientCard'
import { Option } from '@/shared/ui/SegmentedControl/SegmentedControl'

import styles from './Clientcontrol.module.scss'

type ClientSegmentedControlProps = {
  selectedOption: string
  onSelect: (option: string) => void
  setClientNote: (note: string) => void
  clientNote: string
  onSave: () => void
  onCancel: () => void
}

const ClientSegmentedControl: FC<ClientSegmentedControlProps> = ({
  selectedOption,
  onSelect,
  setClientNote,
  onSave,
  onCancel
}) => {
  const options: Option[] = [{ title: 'Скрипт' }, { title: 'Клиент' }]

  return (
    <div className={styles.ClientSegmentedControl}>
      <SegmentedControl
        options={options}
        defaultSelected={selectedOption}
        onSelect={onSelect}
        variant="on"
      />
      <div className={styles.content}>
        {selectedOption === 'Клиент' && (
          <ClientCard
            setClientNote={setClientNote}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}
        {selectedOption === 'Скрипт' && (
          <div>
            <h2>Разделы скрипта</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientSegmentedControl
