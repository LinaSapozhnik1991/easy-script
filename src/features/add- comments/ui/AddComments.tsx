import React, { useState } from 'react'

import styles from './AddComments.module.scss'
import { ButtonComments } from '@/shared/assets/icons'

interface Comment {
  id: number
  text: string
}

const AddComments = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentToAdd = {
        id: comments.length + 1,
        text: newComment
      }
      setComments([...comments, commentToAdd])
      setNewComment('')
    }
  }

  return (
    <div className={styles.commentSection}>
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
