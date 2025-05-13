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
  const setUserName = (name: string) => {
    setUser(prev => {
      if (prev) {
        return { ...prev, name }
      }
      return prev
    })
  }

  return (
    <div className={styles.userProfile}>
      <UserProfileCard
        user={user}
        isEditing={isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        setUserName={setUserName}
      />
      <div className={styles.dopInfo}>
        <div className={styles.billingCard}>
          <h2>Текущий тариф</h2>
          <Button primaryBorder size="small">
            Изменить тариф
          </Button>
        </div>
        <div className={styles.companyCard}>
          <div className={styles.companiesList}>
            <h2>Компании</h2>
            {user && user.companies && user.companies.length > 0 ? (
              <ul>
                {user.companies.map(company => (
                  <li
                    key={company.id}
                    className={
                      company.id === user.currentCompany?.id
                        ? styles.currentCompany
                        : ''
                    }>
                    {company.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет данных о компаниях</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
