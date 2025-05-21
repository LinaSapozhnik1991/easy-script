/* eslint-disable no-console */
// pages/scripts/operator.[id].tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getScriptById } from '@/entities/user-script/api'
import UserLayout from '@/app/UserLayout/UserLayout'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import ModeSelector from '@/features/mode-selector/ui/ModeSelector'
import { Button } from '@/shared/ui/Button'
import { Clock } from '@/shared/assets/icons'
import EndTheCall from '@/features/end-the-call/ui/EndTheCall'
import ResultModal from '@/features/results-modal/ui/ResultModal'

import styles from './Operator.module.scss'

import ClientSegmentedControl from '@/widgets/client-segment-control/ui/ClientSegmentControl'

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
  const [currentMode, setCurrentMode] = useState('operator')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [rightSectionTab, setRightSectionTab] = useState<'script' | 'client'>(
    'script'
  )
  const [clientNote, setClientNote] = useState('')
  useEffect(() => {
    const modeFromQuery = router.query.mode as string
    if (modeFromQuery === 'operator' || modeFromQuery === 'construction') {
      setCurrentMode(modeFromQuery)
    } else {
      setCurrentMode('operator')
    }
  }, [router.query.mode])

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode)
    const scriptId = Array.isArray(id) ? id[0] : id
    if (mode === 'Режим оператора') {
      router.push(`/operator/${scriptId}?mode=operator`)
    } else {
      router.push(`/construction/${scriptId}?mode=construction`)
    }
  }
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
    console.log(`Fetching script for ID: ${id}`) // Логирование ID
    const fetchScript = async () => {
      if (!id) return

      const scriptId = Array.isArray(id) ? id[0] : id

      try {
        const fetchedScript = await getScriptById(scriptId)
        console.log('Fetched script:', fetchedScript) // Логирование полученного скрипта
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
      // Вместо сразу останавливать таймер — открыть модалку
      setIsModalOpen(true)
    } else {
      setIsTimerRunning(true)
    }
  }

  const confirmEndCall = () => {
    setIsTimerRunning(false) // Остановить таймер
    setTimer(0) // Сбросить таймер
    setIsModalOpen(false) // Закрыть модальное окно завершения звонка
    setIsResultModalOpen(true) // Открыть модальное окно результата разговора
  }

  const cancelEndCall = () => {
    setIsModalOpen(false) // Просто закрыть модалку завершения звонка
  }
  const handleResult = (result: string) => {
    console.log('Результат разговора:', result)
    // Здесь вы можете обработать результат разговора
    setIsResultModalOpen(false) // Закрыть модальное окно результата разговора
  }
  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
    const seconds = String(time % 60).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
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

            <ModeSelector
              selectedOption={currentMode}
              onSelect={handleModeChange}
            />

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
                  setRightSectionTab(option as 'script' | 'client')
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
