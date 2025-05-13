import React from 'react'

import { Button } from '@/shared/ui/Button'

import styles from './SaveScript.module.scss'
const SaveScriprt = () => {
  return (
    <div className={styles.saveButton}>
      <Button primary size="mediumScript">
        Сохранить скрипт
      </Button>
    </div>
  )
}

export default SaveScriprt
