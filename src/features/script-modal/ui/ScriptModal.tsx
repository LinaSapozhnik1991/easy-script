/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, Up } from '@/shared/assets/icons'
import { userMe } from '@/entities/user-profile/api'
import { Routers } from '@/shared/routes'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { Script } from '@/entities/user-script'
import { User } from '@/entities/user-profile/ui/UserProfile'

import { scriptSchema } from '../model/validation'
import { createScript } from '../api'

import styles from './ScriptModal.module.scss'

interface Company {
  id: string
  name: string
}

interface ScriptModalProps {
  onClose: () => void
}

interface Errors {
  scriptName?: string
  selectedCompanyId?: string
  general?: string
}

const ScriptModal: React.FC<ScriptModalProps> = ({ onClose }) => {
  const router = useRouter()
  const setScript = useScriptStore(state => state.setScript)
  const [scriptName, setScriptName] = useState('Мой Скрипт')
  const [description, setDescription] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  )
  const [errors, setErrors] = useState<Errors>({})
  const [loadingUserData, setLoadingUserData] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUserFromApi = await userMe()
        setUser(fetchedUserFromApi || null)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoadingUserData(false)
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async () => {
    const finalScriptName = scriptName.trim() === '' ? 'Мой Скрипт' : scriptName

    const result = scriptSchema.safeParse({
      scriptName: finalScriptName,
      selectedCompanyId: selectedCompanyId || ''
    })

    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, err) => {
        acc[err.path[0] as keyof typeof acc] = err.message
        return acc
      }, {} as Errors)

      setErrors(newErrors)
      return
    }

    try {
      setLoadingSubmit(true)
      const createdScriptResponse = await createScript({
        title: finalScriptName,
        description: description || '',
        target: 'defaultTarget',
        companyId: selectedCompanyId
      })

      if (createdScriptResponse) {
        const createdScript: Script = {
          id: createdScriptResponse.id,
          title: createdScriptResponse.title,
          description: createdScriptResponse.description || '',
          target: createdScriptResponse.target || 'defaultTarget',
          company_id: selectedCompanyId ?? '',
          user_id: Number(user?.id) || 0,
          type_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator: {
            id: user?.id || '',
            name: user?.name || 'Unknown'
          },
          company: {
            id: selectedCompanyId ?? '',
            name:
              user?.companies?.find(c => c.id === selectedCompanyId)?.name || ''
          },
          type: {
            id: '1',
            name: 'Default Type'
          }
        }

        setScript(createdScript)
        setErrors({})
        onClose()
        router.push(`${Routers.Construction}/${createdScript.id}`)
      } else {
        setErrors({ general: 'Не удалось создать скрипт. Попробуйте еще раз.' })
      }
    } catch (error) {
      console.error('Error creating script:', error)
      setErrors({ general: 'Произошла ошибка. Попробуйте еще раз.' })
    } finally {
      setLoadingSubmit(false)
    }
  }
  const handleScriptNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScriptName(e.target.value)
    setErrors(prev => ({ ...prev, scriptName: undefined }))
  }

  const handleCompanySelect = (company: Company) => {
    setSelectedCompanyId(company.id.toString())
    setErrors(prev => ({ ...prev, selectedCompanyId: undefined }))
    setIsOpen(false)
  }

  if (loadingUserData) return <div>Загрузка...</div>

  return (
    <div className={styles.buildScripts}>
      <h2>Создать скрипт</h2>

      <div className={styles.inputContainer}>
        <input
          className={`${styles.scriptName} ${errors.scriptName ? styles.inputError : ''}`}
          placeholder="Введите название скрипта"
          value={scriptName}
          onChange={handleScriptNameChange}
          required
        />
        {errors.scriptName && (
          <div className={styles.error}>{errors.scriptName}</div>
        )}
      </div>

      <div className={styles.accordion}>
        {user?.companies && user.companies.length > 0 ? (
          <Accordion
            onToggle={() => setIsOpen(!isOpen)}
            items={user.companies.map(company => ({
              content: (
                <div onClick={() => handleCompanySelect(company)}>
                  {company.name}
                </div>
              )
            }))}
            label={
              selectedCompanyId
                ? user.companies.find(c => String(c.id) === selectedCompanyId)
                    ?.name || 'Неизвестная компания'
                : 'Выберите компанию'
            }
            mode={'bordered'}
            iconClose={<Up />}
            iconOpen={<Down />}
            errorClassName={errors.selectedCompanyId ? styles.inputError : ''}
          />
        ) : (
          <div>Компания не найдена</div>
        )}

        {errors.selectedCompanyId && (
          <div className={styles.error}>{errors.selectedCompanyId}</div>
        )}
      </div>

      <div className={styles.description}>
        <textarea
          className={styles.descriptionValue}
          placeholder="Запишите здесь описание скрипта (необязательно)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.modalButtons}>
        <button className={styles.cancelButton} type="button" onClick={onClose}>
          Отменить
        </button>
        <button
          className={styles.buildButton}
          type="button"
          onClick={handleSubmit}
          disabled={loadingSubmit}>
          Создать
        </button>
        {errors.general && <div className={styles.error}>{errors.general}</div>}
      </div>
    </div>
  )
}

export default ScriptModal
