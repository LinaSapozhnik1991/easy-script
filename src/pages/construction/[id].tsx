/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import ModeSelector from '@/features/mode-selector/ui/ModeSelector'
import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, PlusGreen, Up } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { getScriptById } from '@/entities/user-script/api'
import TextEditor from '@/features/text-editor/ui/TextEditor'
import Exit from '@/features/exit-designer/ui/ExitButton'
import SaveScriprt from '@/features/save-script/ui/SaveScriprt'
import UserLayout from '@/app/UserLayout/UserLayout'
import OpenModalEditScript from '@/features/edit-script/ui/EditScript'
import ScriptEditModal from '@/features/script-edit-modal/ui/ScriptEditModal'
import useModalStore from '@/shared/Modal/model/useModalStore'
import ScriptEditModalLayout from '@/app/ScriptEditModalLayout'
import ExitConfirmationModal from '@/features/exit-modal/ExitConfirmationModal'
import SectionComponent, {
  Scenario,
  Section
} from '@/entities/section/ui/Section'
import { createSection } from '@/features/add-mode/api'
import AddMode from '@/features/add-mode/ui/AddMode'
import ModalSectionNode from '@/entities/section/ui/ModalSectionNode'
import { getSections } from '@/entities/section/api'

import styles from './Construction.module.scss'

const Construction = () => {
  const { setScript, script } = useScriptStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { openModal, closeModal } = useModalStore()
  const [error, setError] = useState<string | null>(null)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [isModalNodeOpen, setIsModalNodeOpen] = useState(false)
  const [currentMode, setCurrentMode] = useState('operator')
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [scriptId, setScriptId] = useState<string | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isSectionsLoading, setIsSectionsLoading] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)

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
        scenarioId: String(scenario.scenarioId), // Убедитесь, что это поле существует
        scriptId: String(scenario.script_id), // Убедитесь, что это поле существует
        description: scenario.description || null,
        weight: scenario.weight || undefined
      }))
      setScenarios(validScenarios) // Убедитесь, что это массив Scenario
    }
  }, [script])

  useEffect(() => {
    const modeFromQuery = router.query.mode as string
    setCurrentMode(modeFromQuery === 'operator' ? 'operator' : 'construction')
  }, [router.query.mode])

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
    if (!script || !scenarioId) {
      console.error('Script or scenarioId not loaded yet')
      return
    }

    const params = {
      title: newSection.title,
      scriptId: script.id,
      scenarioId: scenarioId
    }

    const createdSection = await createSection(params)
    if (createdSection) {
      const sectionToAdd: Section = {
        ...createdSection,
        scriptId: script.id,
        scenarioId: scenarioId,
        scenarios: []
      }
      setSections(prev => [...prev, sectionToAdd])
    } else {
      console.error('Failed to create section')
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

  const handleExitClick = () => {
    setIsExitModalOpen(true)
  }

  const handleModeChange = (newMode: string) => {
    setCurrentMode(newMode)
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

  const handleSelectGoals = (selectedGoals: any) => {
    // Логика обработки выбранных целей
    console.log('Selected goals:', selectedGoals)
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
        section={section}
        onUpdateTitle={handleUpdateTitle}
        scenarioId={scenarioId!}
        scenarios={scenarios}
        onSectionDeleted={handleSectionDeleted}
      />
    ))
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <UserLayout>
      <ScriptEditModalLayout>
        <div className={styles.designer}>
          <div className={styles.designerActions}>
            <div className={styles.designerActionsLeft}>
              <SaveScriprt onSaveScript={saveScript} />
              <ModeSelector
                selectedOption={currentMode}
                onSelect={handleModeChange}
              />
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
              <AddMode onAddSection={handleAddSection} scenarios={scenarios} />
              <Button
                scriptStyle
                size="largeMode"
                onClick={() => setIsModalNodeOpen(true)}>
                Добавить цель
              </Button>
            </div>
            <div className={styles.centerSection}>
              <TextEditor />
            </div>
            <div className={styles.rightSection}></div>
          </div>
        </div>
      </ScriptEditModalLayout>
      {isExitModalOpen && (
        <ExitConfirmationModal
          onClose={() => setIsExitModalOpen(false)}
          onExitWithoutSaving={handleExitWithoutSaving}
          onStayInEditor={handleStayInEditor}
          onSaveAndExit={handleSaveAndExit}
        />
      )}
      {isModalNodeOpen && (
        <ModalSectionNode
          sections={sections}
          onClose={() => setIsModalNodeOpen(false)}
          onSelectGoals={handleSelectGoals}
        />
      )}
    </UserLayout>
  )
}

export default Construction
