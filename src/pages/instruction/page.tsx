'use  client'
import React from 'react'

import styles from './Instruction.module.scss'

const Instruction = () => {
  return (
    <div className={styles.instruction}>
      <div className={styles.instructionContent}>
        <h2>Здесь будет инструкция</h2>
      </div>
    </div>
  )
}

export default Instruction
