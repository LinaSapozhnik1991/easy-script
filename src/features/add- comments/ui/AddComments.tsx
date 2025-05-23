import React, { useState } from 'react'
import styles from './AddComments.module.scss'
import { ButtonComments } from '@/shared/assets/icons'
import { addComment, AddCommentResponse } from '../api' // Импортируйте вашу функцию addComment

interface Comment {
  id: number
  text: string
}

const AddComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response: AddCommentResponse = await addComment(
          scriptId,
          scenarioId,
          sectionId,
          nodeId,
          newComment
        )

        if (response.success) {
          const commentToAdd: Comment = {
            id: Number(response.data?.id) || comments.length + 1, // Преобразуем id в число
            text: response.data?.text || newComment // Используйте текст из ответа API
          }
          setComments([...comments, commentToAdd])
          setNewComment('')
          setError(null)
        } else {
          setError(response.message || 'Ошибка при добавлении комментария')
        }
      } catch {
        setError('Неизвестная ошибка при добавлении комментария')
      }
    }
  }

  return (
    <div className={styles.commentSection}>
      {error && <div className={styles.error}>{error}</div>}{' '}
      {/* Отображение ошибок */}
      <div className={styles.commentsList}>
        {comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            {comment.text}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Добавьте комментарий..."
          className={styles.commentInput}
        />
        <button onClick={handleAddComment} className={styles.addButton}>
          <ButtonComments />
        </button>
      </div>
    </div>
  )
}

export default AddComments
