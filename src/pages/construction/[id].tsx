/* eslint-disable no-console */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { EditorState, ContentState } from 'draft-js'

import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, PlusGreen, Preloader, Up } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { getScriptById } from '@/entities/user-script/api'
import TextEditor from '@/features/text-editor/ui/TextEditor'
import Exit from '@/features/exit-designer/ui/ExitButton'
import SaveScriprt from '@/features/save-script/ui/SaveScriprt'
import OpenModalEditScript from '@/features/edit-script/ui/EditScript'
import ScriptEditModal from '@/features/script-edit-modal/ui/ScriptEditModal'
import useModalStore from '@/shared/Modal/model/useModalStore'
import ScriptEditModalLayout from '@/app/ScriptEditModalLayout'
import ExitConfirmationModal from '@/features/exit-modal/ExitConfirmationModal'
import SectionComponent, {
  AnswerNode,
  Scenario,
  Section
} from '@/entities/section/ui/Section'
import { createSection } from '@/features/add-mode/api'
import AddMode from '@/features/add-mode/ui/AddMode'
import { getSections } from '@/entities/section/api'
import { Routers } from '@/shared/routes'
import UserLayout from '@/app/UserLayout/UserLayout'

import styles from './Construction.module.scss'

const Construction = () => {
  const { setScript, script } = useScriptStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { openModal, closeModal } = useModalStore()
  const [error, setError] = useState<string | null>(null)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [scenarioId, setScenarioId] = useState<string>('')
  const [scriptId, setScriptId] = useState<string>('')
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isSectionsLoading, setIsSectionsLoading] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerNode | null>(null)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const fetchScript = async () => {
    if (!router.isReady || !router.query.id) return

    const id = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id

    if (!id) {
      setError('ID скрипта отсутствует')
      return
    }

    try {
      const fetchedScript = await getScriptById(id)
      if ('error' in fetchedScript) {
        setError(fetchedScript.error)
      } else {
        setScript(fetchedScript)
        setScriptId(fetchedScript.id)
      }
    } catch {
      setError('Произошла ошибка при получении скрипта.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSections = async () => {
      if (!scriptId || !scenarioId) return

      setIsSectionsLoading(true)
      setSectionsError(null)

      try {
        const fetchedSections = await getSections(scriptId, scenarioId)
        setSections(fetchedSections)
      } catch (error) {
        console.error('Не удалось загрузить разделы:', error)
        setSectionsError('Ошибка при загрузке разделов')
      } finally {
        setIsSectionsLoading(false)
      }
    }

    fetchSections()
  }, [scriptId, scenarioId])

  useEffect(() => {
    fetchScript()
  }, [router.isReady, router.query.id, setScript])

  useEffect(() => {
    if (script?.scenarios?.length) {
      setScenarioId(String(script.scenarios[0].id))
    }
  }, [script])

  useEffect(() => {
    if (script?.scenarios) {
      const validScenarios: Scenario[] = script.scenarios.map(scenario => ({
        id: String(scenario.id),
        title: scenario.title,
        scenarioId: String(scenario.scenarioId),
        scriptId: String(scenario.script_id),
        description: scenario.description || null,
        weight: scenario.weight || undefined
      }))
      setScenarios(validScenarios)
    }
  }, [script])

  const handleOpenModal = () => {
    if (script?.title) {
      openModal(
        <ScriptEditModal
          scriptId={script.id}
          scriptName={script.title}
          onClose={closeModal}
        />
      )
    } else {
      console.error('Script is undefined, cannot open modal')
    }
  }

  const handleAddSection = async (newSection: Section) => {
    try {
      const createdSection = await createSection({
        title: newSection.title,
        scriptId: String(newSection.scriptId),
        scenarioId: String(newSection.scenarioId)
      })

      if (createdSection) {
        setSections(prev => [
          ...prev,
          {
            ...createdSection,
            scriptId: newSection.scriptId,
            scenarioId: newSection.scenarioId,
            script_id: newSection.script_id,
            scenario_id: newSection.scenario_id,
            scenarios: []
          }
        ])
      } else {
        console.error('Не удалось создать раздел')
      }
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    )
  }

  const saveScript = async () => {
    console.log('Скрипт сохранен с разделами:')
    alert('Скрипт сохранен')
  }
  const handleAnswerClick = (answer: AnswerNode) => {
    setSelectedAnswer(answer)
    const contentState = ContentState.createFromText(answer.content)
    setEditorState(EditorState.createWithContent(contentState))
  }

  const handleExitClick = () => {
    setIsExitModalOpen(true)
  }

  const handleExitWithoutSaving = () => {
    router.push('/')
  }

  const handleStayInEditor = () => {
    setIsExitModalOpen(false)
  }

  const handleSaveAndExit = async () => {
    await saveScript()
    router.push('/')
  }
  const handleRouteConstructor = () => {
    router.push(`${Routers.Construction}/${scriptId}`)
  }
  const handleRouteOperator = () => {
    if (!scriptId) {
      console.error('Script ID is missing!')
      return
    }
    router.push(`${Routers.Operator}/${scriptId}`)
  }
  const handleSectionDeleted = (deletedSectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== deletedSectionId))
  }
  const renderSections = () => {
    if (isSectionsLoading) {
      return <div>Загрузка разделов...</div>
    }

    if (sectionsError) {
      return <div className={styles.error}>{sectionsError}</div>
    }

    if (sections.length === 0) {
      return <div className={styles.empty}>Разделы не найдены</div>
    }

    return sections.map(section => (
      <SectionComponent
        key={section.id}
        section={{
          ...section,
          scriptId: scriptId,
          scenarioId: section.scenario_id || section.scenarioId
        }}
        onUpdateTitle={handleUpdateTitle}
        script_id={scriptId}
        scenarioId={scenarioId}
        scenarios={scenarios}
        onSectionDeleted={handleSectionDeleted}
        onAnswerClick={handleAnswerClick}
        selectedAnswerId={selectedAnswer?.id || null}
        scenario_Id={scenarioId}
        scriptId={scriptId}
      />
    ))
  }

  if (loading)
    return (
      <div>
        <Preloader />
      </div>
    )
  if (error) return <div>Ошибка: {error}</div>

  return (
    <>
      <UserLayout>
        <ScriptEditModalLayout>
          <div className={styles.designer}>
            <div className={styles.designerActions}>
              <div className={styles.designerActionsLeft}>
                <SaveScriprt onSaveScript={saveScript} />
                <div className={styles.modeButton}>
                  <Button
                    borderMedium
                    primary
                    size="mediumConstructor"
                    onClick={handleRouteConstructor}>
                    Режим конструктора
                  </Button>
                  <Button
                    noBorderScript
                    borderMedium
                    size="mediumConstructor"
                    onClick={handleRouteOperator}>
                    Режим оператора
                  </Button>
                </div>
              </div>
              <div className={styles.designerActionsRigth}>
                <Exit onClick={handleExitClick} />
              </div>
            </div>
            <div className={styles.designerInfoScript}>
              <div className={styles.leftInfo}>
                <div className={styles.company}>
                  <Accordion
                    items={[
                      {
                        content: (
                          <span className={styles.company}>
                            {script?.company?.name || 'Неизвестная компания'}
                          </span>
                        )
                      }
                    ]}
                    label={'Компания'}
                    mode="bordered"
                    iconClose={<Up />}
                    iconOpen={<Down />}
                  />
                </div>
                <div className={styles.nameScript}>
                  <span>{script?.title || 'Неизвестный заголовок'}</span>
                  <OpenModalEditScript openModal={handleOpenModal}>
                    Редактировать
                  </OpenModalEditScript>
                </div>
              </div>
              <Button scriptStyle size="medium">
                <PlusGreen /> Создать группу
              </Button>
            </div>
            <div className={styles.sectionsEditor}>
              <div className={styles.leftSection}>
                {renderSections()}
                {scriptId && scenarioId && (
                  <AddMode
                    onAddSection={handleAddSection}
                    scenarios={scenarios}
                    scriptId={scriptId || ''}
                    scenarioId={scenarioId || ''}
                  />
                )}
                <Button
                  scriptStyle
                  size="largeMode"
                  onClick={() => console.log('')}>
                  Добавить цель
                </Button>
              </div>
              <div className={styles.centerSection}>
                {selectedAnswer ? (
                  <TextEditor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    scriptId={scriptId || ''}
                    scenarioId={scenarioId || ''}
                    sectionId={selectedAnswer.sectionId || ''}
                    nodeId={selectedAnswer.id || ''}
                    initialNodeData={{
                      title: selectedAnswer.title || 'Новый ответ',
                      text: selectedAnswer.content || 'Новый ответ',
                      weight: null,
                      is_target: false
                    }}
                  />
                ) : (
                  <div className={styles.emptyEditor}>
                    Выберите ответ для редактирования
                  </div>
                )}
              </div>
              <div className={styles.rightSection}></div>
            </div>
          </div>

          {isExitModalOpen && (
            <ExitConfirmationModal
              onClose={() => setIsExitModalOpen(false)}
              onExitWithoutSaving={handleExitWithoutSaving}
              onStayInEditor={handleStayInEditor}
              onSaveAndExit={handleSaveAndExit}
            />
          )}
        </ScriptEditModalLayout>
      </UserLayout>
    </>
  )
}

export default Construction
