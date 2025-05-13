/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import ModeSelector from '@/features/mode-selector/ui/ModeSelector'
import { Accordion } from '@/shared/ui/Accordion/Accordion'
import { Down, Plus, Up } from '@/shared/assets/icons'
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

import styles from './Construction.module.scss'

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

  return (
    <UserLayout>
      <ScriptEditModalLayout>
        <div className={styles.designer}>
          <div className={styles.designerActions}>
            <div className={styles.designerActionsLeft}>
              <SaveScriprt />
              <ModeSelector />
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
              <Plus /> Создать группу
            </Button>
          </div>
          <div className={styles.sectionsEditor}>
            <div className={styles.leftSection}></div>
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
    </UserLayout>
  )
}

export default Construction
