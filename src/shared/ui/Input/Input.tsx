import React, { FC, memo, forwardRef } from 'react'
import classNames from 'classnames'

import { InputProps, InputSizes, InputTypes } from './input.types'
import styles from './Input.module.scss'

const Input: FC<InputProps> = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        id,
        value,
        children,
        placeholder = '',
        rounded = false,
        inputSize = InputSizes.Medium,
        error = '',
        disabled,
        inputCompleted = false,
        inputScript = false,
        onChange,
        type = InputTypes.Text,
        maxLength,
        ...props
      },
      ref
    ) => {
      const inputClasses = classNames(styles.inputContainer, {
        [styles.disabled]: disabled
      })

      const inputFieldClasses = classNames(styles.input, {
        [styles.rounded]: rounded,
        [styles.inputCompleted]: inputCompleted,
        [styles.inputScript]: inputScript,
        [styles.small]: inputSize === InputSizes.Small,
        [styles.medium]: inputSize === InputSizes.Medium,
        [styles.large]: inputSize === InputSizes.Large,
        [styles.largeXL]: inputSize === InputSizes.LargeXL,
        [styles.largeScript]: inputSize === InputSizes.LargeScript,
        [styles.error]: !!error
      })

      return (
        <div className={inputClasses}>
          <label htmlFor={id} className={styles.label}>
            {children}
          </label>

          <input
            id={id}
            ref={ref}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            maxLength={maxLength}
            className={inputFieldClasses}
            aria-invalid={!!error}
            aria-disabled={disabled}
            {...props}
          />

          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      )
    }
  )
)

export default Input
