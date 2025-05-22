/* eslint-disable no-console */
// pages/scripts/operator.[id].tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getScriptById } from '@/entities/user-script/api'
import UserLayout from '@/app/UserLayout/UserLayout'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { Button } from '@/shared/ui/Button'
import { Clock } from '@/shared/assets/icons'
import EndTheCall from '@/features/end-the-call/ui/EndTheCall'
import ResultModal from '@/features/results-modal/ui/ResultModal'

import styles from './Operator.module.scss'

import ClientSegmentedControl from '@/widgets/client-segment-control/ui/ClientSegmentControl'
import { Routers } from '@/shared/routes'

interface Operator {
  createdScript?: {
    id: string
  }
}
const Operator = () => {
  const router = useRouter()
  const { id } = router.query
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { setScript, script } = useScriptStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [rightSectionTab, setRightSectionTab] = useState<'Скрипт' | 'Клиент'>(
    'Скрипт'
  )

  const [clientNote, setClientNote] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  useEffect(() => {
    console.log(`Fetching script for ID: ${id}`)
    const fetchScript = async () => {
      if (!id) return

      const scriptId = Array.isArray(id) ? id[0] : id

      try {
        const fetchedScript = await getScriptById(scriptId)
        console.log('Fetched script:', fetchedScript)
        if ('error' in fetchedScript) {
          setError(fetchedScript.error)
        } else {
          setScript(fetchedScript)
        }
      } catch (error) {
        console.error('Error fetching script:', error) // Логирование ошибок
        setError('Ошибка при получении скрипта.')
      } finally {
        setLoading(false)
      }
    }

    fetchScript()
  }, [id])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  const handleCallButtonClick = () => {
    if (isTimerRunning) {
      setIsModalOpen(true)
    } else {
      setIsTimerRunning(true)
    }
  }

  const confirmEndCall = () => {
    setIsTimerRunning(false)
    setTimer(0)
    setIsModalOpen(false)
    setIsResultModalOpen(true)
  }

  const cancelEndCall = () => {
    setIsModalOpen(false)
  }
  const handleResult = (result: string) => {
    console.log('Результат разговора:', result)
    setIsResultModalOpen(false)
  }
  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
    const seconds = String(time % 60).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }
  const handleRouteConstructor = () => {
    router.push(`${Routers.Construction}/${id}`)
  }
  const handleRouteOperator = () => {
    if (!script) {
      console.error('Script ID is missing!')
      return
    }
    router.push(`${Routers.Operator}/${id}`)
  }
  return (
    <UserLayout>
      <div className={styles.operatorMode}>
        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            <Button
              borderMedium
              scriptStyle
              onClick={() => console.log('Сбросить результаты')}>
              Сбросить результаты
            </Button>
            <div className={styles.modeButton}>
              <Button
                borderMedium
                noBorderScript
                size="mediumConstructor"
                onClick={handleRouteConstructor}>
                Режим конструктора
              </Button>
              <Button
                borderMedium
                primary
                size="mediumConstructor"
                onClick={handleRouteOperator}>
                Режим оператора
              </Button>
            </div>

            <div className={styles.timer}>
              <Clock />
              {formatTime(timer)}
            </div>
          </div>
          <Button
            borderMedium
            onClick={handleCallButtonClick}
            primary={!isTimerRunning}
            exitStyle={isTimerRunning}>
            {isTimerRunning ? 'Завершить звонок' : 'Начать звонок'}
          </Button>
        </div>

        <div className={styles.sectionsEditor}>
          <div className={styles.leftSection}>
            <h2>Разделы скрипта</h2>
            <div className={styles.sections}>
              {script?.sections?.map(section => (
                <div key={section.id} className={styles.section}>
                  {section.title}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.centerSection}>
            <h1>{script?.title || 'Неизвестный заголовок'}</h1>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.segmentedControl}>
              <ClientSegmentedControl
                selectedOption={rightSectionTab}
                onSelect={(option: string) =>
                  setRightSectionTab(option as 'Скрипт' | 'Клиент')
                }
                setClientNote={setClientNote}
                clientNote={clientNote}
                onSave={() => {
                  console.log('Сохраненная заметка:', clientNote)
                }}
                onCancel={() => setClientNote('')}
              />
            </div>
          </div>
        </div>
      </div>
      <EndTheCall
        isOpen={isModalOpen}
        onConfirm={confirmEndCall}
        onCancel={cancelEndCall}
      />
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onResult={handleResult}
      />
    </UserLayout>
  )
}

export default Operator
