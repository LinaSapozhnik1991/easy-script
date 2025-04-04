// eslint-disable-next-line import/named
import { Meta, StoryObj } from '@storybook/react'

import Input from './Input'
import { InputSizes } from './input.types'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    pseudo: { hover: true, active: true }
  },
  argTypes: {
    value: { control: 'text' },
    inputSize: {
      control: {
        type: 'select',
        options: [InputSizes.Large, InputSizes.Medium, InputSizes.Small]
      }
    },
    rounded: { control: 'boolean' },
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' }
  }
}

export default meta

type Story = StoryObj<typeof Input>

export const DefaultInput: Story = {
  args: {
    value: '',

    inputSize: InputSizes.Medium
  }
}
