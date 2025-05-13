import { InputHTMLAttributes, ReactNode } from 'react'

export enum InputSizes {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  LargeXL = 'largeXL',
  LargeScript = 'largeScript'
}

export type InputSize =
  | InputSizes.Large
  | InputSizes.Medium
  | InputSizes.Small
  | InputSizes.LargeXL
  | InputSizes.LargeScript

export enum InputTypes {
  Text = 'text',
  Email = 'email',
  Password = 'password',
  Number = 'number',
  Tel = 'tel',
  Url = 'url',
  Search = 'search'
}

export type InputType =
  | InputTypes.Text
  | InputTypes.Email
  | InputTypes.Password
  | InputTypes.Number
  | InputTypes.Tel
  | InputTypes.Url
  | InputTypes.Search

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string
  value?: string | number | readonly string[]
  placeholder?: string
  rounded?: boolean
  disabled?: boolean
  inputSize?: InputSizes
  inputCompleted?: boolean
  inputScript?: boolean
  error?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  icon?: ReactNode
  showIcon?: boolean
  onClear?: () => void
  type?: InputType
  maxLength?: number
  className?: string
  children?: ReactNode
}
