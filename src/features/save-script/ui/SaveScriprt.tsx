import React from 'react'
import { Button } from '@/shared/ui/Button'
import styles from './SaveScript.module.scss'

interface SaveScriptProps {
  onSaveScript: () => void // Добавление типа для пропса
}

const SaveScript: React.FC<SaveScriptProps> = ({ onSaveScript }) => {
  return (
    <div className={styles.saveButton}>
      <Button primary size="mediumScript" onClick={onSaveScript}>
        Сохранить скрипт
      </Button>
    </div>
  )
}

export default SaveScript
