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
import useModalStore from '@/shared/Modal/model/useModalStore'
import ScriptEditModal from '@/features/script-edit-modal/ui/ScriptEditModal'
import OpenModalEditScript from '@/features/edit-script/ui/EditScript'
import ScriptEditModalLayout from '@/app/ScriptEditModalLayout'
import ExitConfirmationModal from '@/features/exit-modal/ExitConfirmationModal'
import AddMode from '@/features/add-mode/ui/AddMode'
import AddHeadMode from '@/features/add-head-mode/ui/AddHeadMode'
import SelectTarget from '@/features/selected-target/ui/SelectedTargets'
import AddComments from '@/features/add- comments/ui/AddComments'
import { Section, SectionResponse } from '@/entities/section/ui/Section'
import useSectionStore from '@/entities/section/lib'
import { createSection } from '@/features/add-mode/api'

import styles from './Construction.module.scss'
import { getSections } from '@/entities/section/api'

interface Construction {
  createdScript?: {
    id: string
  }
}

const Construction = () => {
  const { setScript, script } = useScriptStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { openModal, closeModal } = useModalStore()
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const { sections, addSection, setSections } = useSectionStore()

  const fetchSections = async (scenarioId: string) => {
    try {
      const fetchedSections = await getSections(scenarioId)
      if (fetchedSections) {
        setSections(fetchedSections) // Обновляем состояние разделов
      }
    } catch (error) {
      console.error('Ошибка при получении разделов:', error)
      setError('Не удалось получить разделы.')
    }
  }
  useEffect(() => {
    const fetchScript = async () => {
      try {
        if (!router.isReady || !router.query.id) {
          return
        }

        const id = Array.isArray(router.query.id)
          ? router.query.id[0]
          : router.query.id

        if (!id) {
          setError('ID скрипта отсутствует')
          return
        }

        const fetchedScript = await getScriptById(id)

        if ('error' in fetchedScript) {
          setError(fetchedScript.error)
        } else {
          setScript(fetchedScript)
          // Теперь вызываем fetchSections с scenarioId
          if (fetchedScript.scenarioId) {
            await fetchSections(fetchedScript.scenarioId) // Вызов функции
          }
        }
      } catch {
        setError('Произошла ошибка при получении скрипта.')
      } finally {
        setLoading(false)
      }
    }

    fetchScript()
  }, [router.isReady, router.query, router.query.id, setScript])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  const handleExitClick = () => {
    setIsExitModalOpen(true)
  }

  const handleExitWithoutSaving = () => {
    router.push('/some-route')
  }

  const handleStayInEditor = () => {
    setIsExitModalOpen(false)
  }

  const handleSaveAndExit = () => {
    router.push('/some-route')
  }
  const handleOpenModal = () => {
    if (script && script.title) {
      console.log('Opening modal with script:', script.title)
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
  const handleAddSection = async () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'Новый раздел',
      weight: null,
      scriptId: script?.id?.toString() || ''
    }

    try {
      const response: SectionResponse | null = await createSection(newSection)
      if (response && response.id) {
        const sectionToAdd: Section = {
          id: response.id,
          weight: null,
          title: newSection.title,
          scriptId: newSection.scriptId
        }

        addSection(sectionToAdd)
      } else {
        throw new Error('Не удалось создать раздел')
      }
    } catch (error) {
      console.error('Ошибка при добавлении раздела:', error)
      alert('Не удалось добавить раздел. Попробуйте еще раз.')
    }
  }

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections(
      sections.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    )
  }

  const saveScript = async () => {
    console.log('Скрипт сохранен с разделами:', sections)
    alert('Скрипт сохранен')
  }

  return (
    <UserLayout>
      <ScriptEditModalLayout>
        <div className={styles.designer}>
          <div className={styles.designerActions}>
            <div className={styles.designerActionsLeft}>
              <SaveScriprt onSaveScript={saveScript} />
              <ModeSelector currentMode="constructor" />
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
                          {script?.company?.name || 'Моя компания'}
                        </span>
                      )
                    }
                  ]}
                  label={script?.company?.name || 'Компании'}
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
              <AddMode onAddSection={} />
              <AddHeadMode />
              <SelectTarget />

              <div className={styles.sectionsList}>
                {sections.map(section => (
                  <div key={section.id} className={styles.sectionItem}>
                    <input
                      type="text"
                      value={'title'}
                      onChange={e =>
                        updateSectionTitle(section.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.centerSection}>
              <TextEditor />
              <AddComments />
            </div>
            <div className={styles.rightSection}>
              <AddMode onAddSection={addSection} />
              <AddHeadMode />
              <SelectTarget />
            </div>
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
    </UserLayout>
  )
}

export default Construction
