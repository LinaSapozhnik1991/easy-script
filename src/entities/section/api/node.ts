/* eslint-disable no-console */
import Cookies from 'js-cookie'

import { instance } from '@/shared/api'

export const addAnswer = async (
  script_Id: string,
  scenario_Id: string,
  sectionId: string,
  title: string,
  text: string,
  weight: number | null = null,
  isTarget: boolean = false
) => {
  const token = Cookies.get('token')

  try {
    const response = await instance.post(
      `/scripts/${Number(script_Id)}/scenarios/${Number(scenario_Id)}/sections/${Number(sectionId)}/nodes`,
      {
        title,
        text,
        weight,
        is_target: isTarget,
        type: 'answer'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data.data
  } catch (error) {
    console.error('Error adding answer:', error)
    throw error
  }
}
