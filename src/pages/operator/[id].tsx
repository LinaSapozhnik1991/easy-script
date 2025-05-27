/* eslint-disable no-console */
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
import { getSectionNodes } from '@/entities/section/api/node'
import SectionComponent, {
  AnswerNode,
  Section
} from '@/entities/section/ui/Section'
import { getSections } from '@/entities/section/api'
import { useNodesStore } from '@/entities/section/lib/useNodeStore'

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
  const [sections, setSections] = useState<Section[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)
  const [scenarioId, setScenarioId] = useState<string>('')
  const [scriptId, setScriptId] = useState<string>('')
  const { setNodesForSection } = useNodesStore()
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerNode | null>(null)

  // Новое состояние для выбранной секции
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  )

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
    if (scriptId && scenarioId) {
      fetchSections()
    }
  }, [scriptId, scenarioId])

  useEffect(() => {
    if (!id) return
    const fetchScript = async () => {
      const scriptId = Array.isArray(id) ? id[0] : id
      try {
        const fetchedScript = await getScriptById(scriptId)
        if ('error' in fetchedScript) {
          setError(fetchedScript.error)
        } else {
          setScript(fetchedScript)
          setScriptId(fetchedScript.id)
          if (fetchedScript.scenarios?.length) {
            setScenarioId(String(fetchedScript.scenarios[0].id))
          }
        }
      } catch {
        setError('Ошибка при получении скрипта.')
      } finally {
        setLoading(false)
      }
    }
    fetchScript()
  }, [id])

  const fetchSections = async () => {
    if (!scriptId || !scenarioId) return

    setSectionsLoading(true)
    setSectionsError(null)

    try {
      const fetchedSections = await getSections(scriptId, scenarioId)
      setSections(fetchedSections)

      // Устанавливаем выбранную секцию первой по умолчанию, если еще не выбрана
      if (fetchedSections.length && !selectedSectionId) {
        setSelectedSectionId(fetchedSections[0].id)
      }

      // Загрузка узлов для каждой секции
      await Promise.all(
        fetchedSections.map(async section => {
          const nodes = await getSectionNodes(scriptId, scenarioId, section.id)
          setNodesForSection(section.id, nodes)
        })
      )
    } catch (error) {
      console.error('Ошибка загрузки секций:', error)
      setSectionsError('Ошибка при загрузке секций')
    } finally {
      setSectionsLoading(false)
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

  const handleAnswerClick = (answer: AnswerNode) => {
    setSelectedAnswer(answer)
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    )
  }

  const handleSectionDeleted = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id))
    if (selectedAnswer?.sectionId === id) {
      setSelectedAnswer(null)
    }
    if (selectedSectionId === id) {
      setSelectedSectionId(null)
    }
  }

  const handleRouteOperator = () => {
    if (!script) {
      console.error('Script ID is missing!')
      return
    }
    router.push(`${Routers.Operator}/${id}`)
  }

  // Находим выбранную секцию по id
  const selectedSection = sections.find(
    section => section.id === selectedSectionId
  )

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

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
            onClick={() => {
              if (isTimerRunning) {
                setIsModalOpen(true)
              } else {
                setIsTimerRunning(true)
              }
            }}
            primary={!isTimerRunning}
            exitStyle={isTimerRunning}>
            {isTimerRunning ? 'Завершить звонок' : 'Начать звонок'}
          </Button>
        </div>

        <div className={styles.sectionsEditor}>
          <div className={styles.leftSection}>
            <h2>Разделы скрипта</h2>
            {sectionsLoading && <div>Загрузка разделов...</div>}
            {sectionsError && <div>Ошибка: {sectionsError}</div>}
            {!sectionsLoading && !sectionsError && sections.length === 0 && (
              <div>Разделы не найдены</div>
            )}
            {!sectionsLoading && !sectionsError && sections.length > 0 && (
              <div>
                {sections.map(section => (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      backgroundColor:
                        section.id === selectedSectionId
                          ? '#d0e6ff'
                          : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}>
                    <SectionComponent
                      scenario_Id={scenarioId}
                      script_id={scriptId}
                      section={{
                        ...section,
                        scriptId: scriptId,
                        scenarioId:
                          section.scenario_id ||
                          section.scenarioId ||
                          scenarioId
                      }}
                      onUpdateTitle={handleUpdateTitle}
                      scriptId={scriptId}
                      scenarioId={scenarioId}
                      scenarios={
                        script?.scenarios?.map(scenario => ({
                          ...scenario,
                          id: String(scenario.id) // гарантируем строку
                        })) || []
                      }
                      onSectionDeleted={handleSectionDeleted}
                      onAnswerClick={handleAnswerClick}
                      selectedAnswerId={selectedAnswer?.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.centerSection}>
            <div className={styles.selectSection}>
              <h1 className={styles.selectedSection}>
                {selectedSection?.title || 'Неизвестный заголовок'}
              </h1>
            </div>
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
