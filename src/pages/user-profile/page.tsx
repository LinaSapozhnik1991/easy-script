import React, { useEffect, useState } from 'react'

//import UserCard from '@/features/user-card/ui/UserCard'
import { User } from '@/entities/user-profile/ui/UserProfile'
import { userMe } from '@/entities/user-profile/api'
import { Button } from '@/shared/ui/Button'
import UserProfileCard from '@/features/user-card/ui/UserProfileCard'

import styles from './UserProfile.module.scss'

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await userMe()
      setUser(fetchedUser)
    }

    fetchUser()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  /*const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => (prev ? { ...prev, [name]: value } : null))
  }*/
  return (
    <div className={styles.userProfile}>
      <UserProfileCard
        user={user}
        isEditing={isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />
      <div className={styles.dopInfo}>
        <div className={styles.billingCard}>
          <h2>Текущий тариф</h2>
          <Button primaryBorder size="small">
            Изменить тариф
          </Button>
        </div>
        <div className={styles.companyCard}>
          <h2>Компании</h2>
          <p className={styles.company}>{user ? user.company : 'Нет данных'}</p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
