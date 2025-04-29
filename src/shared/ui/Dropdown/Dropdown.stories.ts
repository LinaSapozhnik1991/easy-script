// eslint-disable-next-line import/named
import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Dropdown } from './Dropdown'

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: { onClick: fn() }
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Select an option',
    items: [
      { content: 'Option 1', link: '#' },
      { content: 'Option 2', link: '#' },
      { content: 'Option 3', link: '#' },
      { content: 'Option 4', link: '#' }
    ],
    mode: 'bordered' // добавлено обязательное свойство mode
  }
}

export const Disabled: Story = {
  args: {
    label: 'Select an option',
    items: [
      { content: 'Option 1', link: '#' },
      { content: 'Option 2', link: '#' }
    ],
    disabled: true,
    mode: 'bordered' // добавлено обязательное свойство mode
  }
}

export const WithSeparator: Story = {
  args: {
    label: 'Select an option',
    items: [
      { content: 'Option 1', link: '#' },
      { content: 'Option 2', link: '#' },
      { content: 'Option 3', link: '#' }
    ],
    separator: true,
    mode: 'bordered' // добавлено обязательное свойство mode
  }
}
