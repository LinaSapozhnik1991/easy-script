import type { Meta, StoryObj } from '@storybook/react'

import Radio from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Radio,Checkbox,Toggle/Radio',
  component: Radio,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['medium', 'small']
      }
    },

    disabled: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'medium',
    checked: false,
    isDefault: false,
    disabled: false
  }
}

export const Disabled: Story = {
  args: {
    size: 'medium',
    checked: false,
    disabled: true
  }
}
