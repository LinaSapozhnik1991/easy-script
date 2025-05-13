/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'

import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, Up } from '@/shared/assets/icons'
import { userMe } from '@/entities/user-profile/api'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { Script } from '@/entities/user-script'
import { User } from '@/entities/user-profile/ui/UserProfile'

import { scriptEditSchema } from '../model/validation'
import { editScript } from '../api'

import styles from './ScriptEditModal.module.scss'

interface Company {
  id: number
  name: string
}

interface ScriptEditModalProps {
  onClose: () => void
  scriptName: string
  scriptId: string | null
}

interface Errors {
  scriptName?: string
  selectedCompanyId?: string
  general?: string
}

const ScriptEditModal: React.FC<ScriptEditModalProps> = ({
  onClose,
  scriptName,
  scriptId
}) => {
  const setScript = useScriptStore(state => state.setScript)
  const [scriptNameState, setScriptName] = useState(scriptName)
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
  useEffect(() => {}, [scriptName, scriptNameState])

  const handleSubmit = async () => {
    const result = scriptEditSchema.safeParse({
      scriptName: scriptNameState,
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
      const editedScriptResponse = await editScript(scriptId, {
        title: scriptNameState,
        description: description || '',
        target: 'defaultTarget',
        companyId: selectedCompanyId
      })

      if (editedScriptResponse) {
        const editedScript: Script = {
          id: editedScriptResponse.id,
          title: editedScriptResponse.title,
          description: editedScriptResponse.description || '',
          target: editedScriptResponse.target || 'defaultTarget',
          company_id: Number(selectedCompanyId),
          user_id: Number(user?.id) || 0,
          type_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator: {
            id: Number(user?.id) || 0,
            name: user?.name || 'Unknown'
          },
          company: {
            id: Number(selectedCompanyId),
            name:
              user?.companies?.find(c => c.id === Number(selectedCompanyId))
                ?.name || ''
          },
          type: {
            id: '1',
            name: 'Default Type'
          }
        }

        setScript(editedScript)
        setErrors({})
        onClose()
      } else {
        setErrors({
          general: 'Не удалось редактировать скрипт. Попробуйте еще раз.'
        })
      }
    } catch (error) {
      console.error('Error editing script:', error)
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
      <h2>Редактировать скрипт</h2>

      <div className={styles.inputContainer}>
        <input
          className={`${styles.scriptName} ${errors.scriptName ? styles.inputError : ''}`}
          placeholder="Введите название скрипта"
          value={scriptNameState}
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
                ? user.companies.find(c => c.id === Number(selectedCompanyId))
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
          Сохранить
        </button>
      </div>
    </div>
  )
}

export default ScriptEditModal
