// eslint-disable-next-line import/named
import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Accordion } from './Accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: { onClick: fn() }
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Accordion Button',
    items: [
      { content: 'qwe' },
      { content: 'ewq' },
      { content: 'qwe' },
      { content: 'ewq' },
      { content: 'qwe' },
      { content: 'ewq' }
    ],
    mode: 'bordered' // добавлено обязательное свойство mode
  }
}

export const Disabled: Story = {
  args: {
    label: 'Accordion Button',
    items: [{ content: 'qwe' }, { content: 'ewq' }],
    disabled: true,
    mode: 'bordered' // добавлено обязательное свойство mode
  }
}
