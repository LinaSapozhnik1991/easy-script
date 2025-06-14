/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { EditorState, ContentState } from 'draft-js'

import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, PlusGreen, Preloader, Up } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/Button'
import useScriptStore from '@/entities/user-script/lib/useScriptStore'
import { getScriptById } from '@/entities/user-script/api'
import TextEditor from '@/features/text-editor/ui/TextEditor'
import Exit from '@/features/exit-designer/ui/ExitButton'
import { SaveScript } from '@/features/save-script/ui/SaveScriprt'
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
import { getSections } from '@/entities/section/api'
import { Routers } from '@/shared/routes'
import UserLayout from '@/app/UserLayout/UserLayout'
import { saveNodeData } from '@/features/text-editor/api'
import { useNodesStore } from '@/entities/section/lib/useNodeStore'
import { getSectionNodes } from '@/entities/section/api/node'
import AddComments from '@/features/add- comments/ui/AddComments'
import TargetSelectionModal from '@/features/target-modal/ui/TargetModal'
import OpenModalTarget from '@/features/open0modal-target/ui/OpenModalTarget'
import AddSection from '@/features/add-mode/ui/AddSection'

import styles from './Construction.module.scss'

const Construction = () => {
  const { setScript, script } = useScriptStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { openModal, closeModal } = useModalStore()
  const [error, setError] = useState<string | null>(null)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [leftSections, setLeftSections] = useState<Section[]>([])
  const [rightSections, setRightSections] = useState<Section[]>([])
  const [scenarioId, setScenarioId] = useState<string>('')
  const [scriptId, setScriptId] = useState<string>('')
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isSectionsLoading, setIsSectionsLoading] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)
  const [leftSelectedAnswer, setLeftSelectedAnswer] =
    useState<AnswerNode | null>(null)
  const [rightSelectedAnswer, setRightSelectedAnswer] =
    useState<AnswerNode | null>(null)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const { setNodesForSection, updateNode } = useNodesStore()
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExitLoading, setIsExitLoading] = useState(false)
  const initialContentRef = useRef<ContentState | null>(null)
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left')

  const selectedAnswer =
    activeSide === 'left' ? leftSelectedAnswer : rightSelectedAnswer
  const allSections = [...leftSections, ...rightSections]

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

  const fetchSectionsForSide = async (side: 'left' | 'right') => {
    if (!scriptId || !scenarioId) return

    setIsSectionsLoading(true)
    setSectionsError(null)

    try {
      const fetchedSections = await getSections(scriptId, scenarioId)
      const half = Math.ceil(fetchedSections.length / 2)
      const sectionsForSide =
        side === 'left'
          ? fetchedSections.slice(0, half)
          : fetchedSections.slice(half)

      if (side === 'left') {
        setLeftSections(sectionsForSide)
      } else {
        setRightSections(sectionsForSide)
      }

      await Promise.all(
        sectionsForSide.map(async section => {
          const nodes = await getSectionNodes(scriptId, scenarioId, section.id)
          setNodesForSection(section.id, nodes)
        })
      )
    } catch (error) {
      console.error('Не удалось загрузить разделы:', error)
      setSectionsError('Ошибка при загрузке разделов')
    } finally {
      setIsSectionsLoading(false)
    }
  }

  useEffect(() => {
    if (scriptId && scenarioId) {
      fetchSectionsForSide('left')
      fetchSectionsForSide('right')
    }
  }, [scriptId, scenarioId, setNodesForSection])

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
        scriptId: String(scenario.script_id),
        scenarioId: String(scenario.scenarioId),
        description: scenario.description || null,
        weight: scenario.weight || undefined
      }))
      setScenarios(validScenarios)
    }
  }, [script])

  const handleExitClick = () => {
    if (hasUnsavedChanges) {
      setIsExitModalOpen(true)
    } else {
      setIsExitModalOpen(true)
    }
  }

  const handleExitWithoutSaving = () => {
    router.push(Routers.MyScripts)
  }

  const handleStayInEditor = () => {
    setIsExitModalOpen(false)
  }

  const handleSaveAndExit = async () => {
    setIsExitLoading(true)
    try {
      await saveScript()
      setHasUnsavedChanges(false)
      router.push(Routers.MyScripts)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    } finally {
      setIsExitLoading(false)
    }
  }

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

  const handleAddSection = async (
    newSection: Section,
    side: 'left' | 'right'
  ) => {
    try {
      const createdSection = await createSection({
        title: newSection.title,
        scriptId: String(newSection.scriptId),
        scenarioId: String(newSection.scenarioId)
      })

      if (createdSection) {
        if (side === 'left') {
          setLeftSections(prev => [
            ...prev,
            {
              ...createdSection,
              scriptId: newSection.scriptId,
              scenarioId: newSection.scenarioId
            }
          ])
        } else {
          setRightSections(prev => [
            ...prev,
            {
              ...createdSection,
              scriptId: newSection.scriptId,
              scenarioId: newSection.scenarioId
            }
          ])
        }
        setNodesForSection(createdSection.id, [])
      }
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const handleUpdateTitle = (
    id: string,
    newTitle: string,
    side: 'left' | 'right'
  ) => {
    if (side === 'left') {
      setLeftSections(prev =>
        prev.map(s => (s.id === id ? { ...s, title: newTitle } : s))
      )
    } else {
      setRightSections(prev =>
        prev.map(s => (s.id === id ? { ...s, title: newTitle } : s))
      )
    }
  }

  const saveScript = async () => {
    console.log('Скрипт сохранен с разделами:')
    alert('Скрипт сохранен')
  }

  const handleAnswerClick = (answer: AnswerNode, side: 'left' | 'right') => {
    setActiveSide(side)
    if (side === 'left') {
      setLeftSelectedAnswer(answer)
    } else {
      setRightSelectedAnswer(answer)
    }

    const content = answer.text || answer.content || ''
    const contentState = ContentState.createFromText(content)
    initialContentRef.current = contentState
    setEditorState(EditorState.createWithContent(contentState))
    setHasUnsavedChanges(false)
  }

  const handleEditorChange = (newEditorState: EditorState) => {
    if (initialContentRef.current) {
      const currentContent = newEditorState.getCurrentContent()
      setHasUnsavedChanges(!currentContent.equals(initialContentRef.current))
    }
    setEditorState(newEditorState)

    if (selectedAnswer) {
      const content = newEditorState.getCurrentContent().getPlainText()
      if (activeSide === 'left') {
        setLeftSelectedAnswer(prev =>
          prev ? { ...prev, text: content, content } : null
        )
      } else {
        setRightSelectedAnswer(prev =>
          prev ? { ...prev, text: content, content } : null
        )
      }
      updateNode(selectedAnswer.sectionId, selectedAnswer.id, {
        text: content,
        content
      })
    }
  }

  const handleSaveAnswer = async () => {
    if (!selectedAnswer || !scriptId || !scenarioId) return

    try {
      const content = editorState.getCurrentContent().getPlainText()
      updateNode(selectedAnswer.sectionId, selectedAnswer.id, {
        text: content,
        content
      })

      await saveNodeData({
        scriptId,
        scenarioId,
        sectionId: selectedAnswer.sectionId,
        nodeId: selectedAnswer.id,
        editorState,
        initialNodeData: {
          title: selectedAnswer.title,
          text: content,
          weight: selectedAnswer.weight ?? null,
          is_target: selectedAnswer.is_target ?? false
        }
      })

      if (activeSide === 'left') {
        setLeftSelectedAnswer(prev =>
          prev ? { ...prev, text: content, content } : null
        )
      } else {
        setRightSelectedAnswer(prev =>
          prev ? { ...prev, text: content, content } : null
        )
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
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

  const handleSectionDeleted = (
    deletedSectionId: string,
    side: 'left' | 'right'
  ) => {
    if (side === 'left') {
      setLeftSections(prev => prev.filter(s => s.id !== deletedSectionId))
      if (leftSelectedAnswer?.sectionId === deletedSectionId) {
        setLeftSelectedAnswer(null)
      }
    } else {
      setRightSections(prev => prev.filter(s => s.id !== deletedSectionId))
      if (rightSelectedAnswer?.sectionId === deletedSectionId) {
        setRightSelectedAnswer(null)
      }
    }
  }

  const renderSections = (sections: Section[], side: 'left' | 'right') => {
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
        key={`${side}-${section.id}`}
        section={{
          ...section,
          scriptId: scriptId,
          scenarioId: section.scenario_id || section.scenarioId
        }}
        onUpdateTitle={(id, title) => handleUpdateTitle(id, title, side)}
        script_id={scriptId}
        scenarioId={scenarioId}
        scenarios={scenarios}
        onSectionDeleted={id => handleSectionDeleted(id, side)}
        onAnswerClick={answer => handleAnswerClick(answer, side)}
        selectedAnswerId={
          side === 'left' ? leftSelectedAnswer?.id : rightSelectedAnswer?.id
        }
        scenario_Id={scenarioId}
        scriptId={scriptId}
      />
    ))
  }

  if (loading) {
    return (
      <div>
        <Preloader />
      </div>
    )
  }

  if (error) {
    return <div>Ошибка: {error}</div>
  }

  const handleSelectTargets = async (targetIds: string[]) => {
    try {
      await Promise.all(
        allSections.map(async section => {
          const nodes = await getSectionNodes(scriptId, scenarioId, section.id)
          nodes.forEach(async node => {
            if (targetIds.includes(node.id)) {
              updateNode(section.id, node.id, {
                ...node,
                is_target: true
              })
            }
          })
        })
      )
    } catch (error) {
      console.error('Ошибка при обновлении целей:', error)
    }
  }

  return (
    <>
      <UserLayout>
        <ScriptEditModalLayout>
          <div className={styles.designer}>
            <div className={styles.designerActions}>
              <div className={styles.designerActionsLeft}>
                <SaveScript
                  scriptId={scriptId}
                  scenarioId={scenarioId}
                  sectionId={selectedAnswer?.sectionId || ''}
                  selectedAnswer={selectedAnswer}
                  editorState={editorState}
                  getSectionNodes={getSectionNodes}
                  onSuccess={data => {
                    console.log('Скрипт сохранен:', data)
                  }}
                  onError={error => {
                    console.error('Ошибка сохранения:', error)
                  }}
                />
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
                <Exit
                  onClick={handleExitClick}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
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
                {renderSections(leftSections, 'left')}
                {scriptId && scenarioId && (
                  <AddSection
                    onAddSection={section => handleAddSection(section, 'left')}
                    scenarios={scenarios}
                    scriptId={scriptId || ''}
                    scenarioId={scenarioId || ''}
                  />
                )}
                <OpenModalTarget openPopup={() => setIsTargetModalOpen(true)}>
                  Добавить цель
                </OpenModalTarget>
              </div>
              <div className={styles.centerSection}>
                {selectedAnswer ? (
                  <TextEditor
                    key={`${activeSide}-${selectedAnswer.id}`}
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    scriptId={scriptId || ''}
                    scenarioId={scenarioId || ''}
                    sectionId={selectedAnswer?.sectionId || ''}
                    nodeId={selectedAnswer?.id || ''}
                    initialNodeData={{
                      title: selectedAnswer?.title || 'Новый ответ',
                      text: selectedAnswer?.content || 'Новый ответ',
                      weight: null,
                      is_target: false
                    }}
                    onSave={handleSaveAnswer}
                  />
                ) : (
                  <div className={styles.emptyEditor}>
                    Выберите ответ для редактирования
                  </div>
                )}
                <div className={styles.Comment}>
                  {selectedAnswer && (
                    <AddComments
                      scriptId={scriptId}
                      scenarioId={scenarioId}
                      sectionId={selectedAnswer.sectionId}
                      node_id={selectedAnswer.id}
                    />
                  )}
                </div>
              </div>
              <div className={styles.rightSection}>
                {renderSections(rightSections, 'right')}
                {scriptId && scenarioId && (
                  <AddSection
                    onAddSection={section => handleAddSection(section, 'right')}
                    scenarios={scenarios}
                    scriptId={scriptId || ''}
                    scenarioId={scenarioId || ''}
                  />
                )}
              </div>
            </div>
          </div>

          {isExitModalOpen && (
            <ExitConfirmationModal
              onClose={() => setIsExitModalOpen(false)}
              onExitWithoutSaving={handleExitWithoutSaving}
              onStayInEditor={handleStayInEditor}
              onSaveAndExit={handleSaveAndExit}
              isLoading={isExitLoading}
            />
          )}
          {isTargetModalOpen && selectedAnswer && (
            <TargetSelectionModal
              sectionId={selectedAnswer.sectionId}
              sections={allSections}
              onSelectTargets={handleSelectTargets}
              onClose={() => setIsTargetModalOpen(false)}
              scriptId={scriptId}
              scenarioId={scenarioId}
            />
          )}
        </ScriptEditModalLayout>
      </UserLayout>
    </>
  )
}

export default Construction
