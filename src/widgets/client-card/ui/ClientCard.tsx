import React from 'react'

import { Button } from '@/shared/ui/Button'
import { Company, Mail, Phone } from '@/shared/assets/icons'

import styles from './ClientCard.module.scss' // Импортируйте стили, если они нужны

interface ClientCardProps {
  setClientNote: (note: string) => void
  onSave: () => void
  onCancel: () => void
}

const ClientCard: React.FC<ClientCardProps> = ({
  setClientNote,
  onSave,
  onCancel
}) => {
  return (
    <div className={styles.clientCard}>
      <p className={styles.name}>Иванов Иван Иванович</p>
      <div className={styles.phone}>
        <Phone /> <span>123456789123</span>
      </div>
      <div className={styles.mail}>
        <Mail /> <span>example.@exmaple.com</span>
      </div>
      <div className={styles.company}>
        <Company /> <span>OOO Ромашка</span>
      </div>
      <div className={styles.noteSection}>
        <label htmlFor="clientNote">Заметка:</label>
        <textarea
          id="clientNote"
          onChange={e => setClientNote(e.target.value)}
          placeholder="Введите заметку о клиенте"
          rows={4}
        />
      </div>
      <div className={styles.clientCardButtons}>
        <Button
          borderMedium
          size="smallClient"
          onClick={onCancel}
          primaryBorder>
          Отмена
        </Button>
        <Button borderMedium primary size="smallClient" onClick={onSave}>
          Сохранить
        </Button>
      </div>
    </div>
  )
}

export default ClientCard
