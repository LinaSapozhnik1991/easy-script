/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { ButtonComments } from '@/shared/assets/icons'
import { addComment, getComments } from '../api'
import styles from './AddComments.module.scss'

// Основной интерфейс для комментария в нашем приложении
interface AppComment {
  id: string | number
  node_id: string
  comment: string
  created_at: string
  updated_at: string
  user_name: string
}

// Интерфейс для данных, приходящих от API
interface ApiCommentResponse {
  id: string | number
  node_id: string
  comment?: string
  text?: string
  created_at?: string
  updated_at?: string
  user_name?: string
}

interface AddCommentsProps {
  scriptId: string
  scenarioId: string
  sectionId: string
  node_id: string
}

interface ValidationErrors {
  [key: string]: string[]
}

const AddComments: React.FC<AddCommentsProps> = ({
  scriptId,
  scenarioId,
  sectionId,
  node_id
}) => {
  const [comments, setComments] = useState<AppComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizeComment = (data: ApiCommentResponse): AppComment => ({
    id: data.id,
    node_id: data.node_id || '',
    comment: data.comment || data.text || '',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    user_name: data.user_name || 'Аноним'
  })

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response: ApiCommentResponse[] = await getComments(
          scriptId,
          scenarioId,
          sectionId,
          node_id
        )

        const normalizedComments = response.map(normalizeComment)
        setComments(normalizedComments)
      } catch (err) {
        console.error('Ошибка загрузки:', err)
        setError('Не удалось загрузить комментарии')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [scriptId, scenarioId, sectionId, node_id])

  const handleAddComment = async (): Promise<void> => {
    if (!newComment.trim()) {
      setValidationErrors({
        'comment.required': ['Комментарий обязателен для заполнения']
      })
      return
    }

    setIsSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const response = await addComment(
        scriptId,
        scenarioId,
        sectionId,
        node_id,
        newComment
      )

      if (response.success && response.data) {
        const newCommentItem = normalizeComment(response.data)
        setComments(prev => [newCommentItem, ...prev])
        setNewComment('')
      } else if (response.errors) {
        setValidationErrors(response.errors)
      } else {
        setError(response.message || 'Не удалось добавить комментарий')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.message)
      } else {
        setError('Неизвестная ошибка')
        console.error('Ошибка:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const getErrorMessage = (): string | null => {
    if (error) return error

    const errorKeys = Object.keys(validationErrors)
    if (errorKeys.length > 0) {
      return validationErrors[errorKeys[0]][0]
    }

    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.commentSection}>
        {isLoading ? (
          <div className={styles.loading}>Загрузка комментариев...</div>
        ) : (
          <>
            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <strong className={styles.userName}>
                        {comment.user_name}
                      </strong>
                      <span className={styles.commentDate}>
                        {new Date(comment.created_at).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>Пока нет комментариев</p>
              )}
            </div>

            <div className={styles.inputContainer}>
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={e => {
                  setNewComment(e.target.value)
                  if (Object.keys(validationErrors).length > 0) {
                    setValidationErrors({})
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Напишите комментарий..."
                className={styles.commentInput}
                disabled={isSubmitting}
                maxLength={255}
              />
              <button
                onClick={handleAddComment}
                className={styles.addButton}
                disabled={!newComment.trim() || isSubmitting}
                aria-label="Отправить комментарий">
                <ButtonComments />
              </button>
            </div>

            {getErrorMessage() && (
              <div className={styles.error}>{getErrorMessage()}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AddComments
