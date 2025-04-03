// eslint-disable-next-line import/named
import { Meta, StoryObj } from '@storybook/react'

import SegmentedControl from './SegmentedControl'

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: {
        type: 'object'
      },
      description: 'Array of options for the segmented control'
    },
    variant: {
      control: {
        type: 'select',
        option: ['on', 'line']
      }
    },

    size: {
      control: {
        type: 'select',
        options: ['large', 'medium', 'small', 'xs']
      }
    },
    selected: {
      control: {
        type: 'text'
      },
      description: 'Currently selected option'
    },
    onSelect: {
      action: 'selected',
      description: 'Function called when an option is selected'
    },
    disabled: {
      control: {
        type: 'boolean'
      },
      description: 'Disable the segmented control'
    }
  }
}

export default meta

type Story = StoryObj<typeof SegmentedControl>

export const DefaultSegmentedControl: Story = {
  args: {
    label: 'Default Segment Control',
    options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4', 'Вариант 5'],
    selected: 'Вариант 1',
    variant: 'on'
  }
}

export const FiveSegmentedControl: Story = {
  args: {
    label: 'Disabled Segment Control',
    options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4', 'Вариант 5'],
    selected: 'Вариант 2',
    disabled: true,
    variant: 'on'
  }
}

export const FourSelectedSegment: Story = {
  args: {
    label: 'Custom Selected Segment Control',
    options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
    selected: 'Вариант 4',
    variant: 'on'
  }
}

export const ThreeSegmentedControl: Story = {
  args: {
    label: 'Interactive Segment Control',
    options: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
    selected: 'Вариант 1',
    variant: 'on'
  }
}
export const TwoSegmentedControl: Story = {
  args: {
    label: 'Interactive Segment Control',
    options: ['Вариант 1', 'Вариант 2'],
    selected: 'Вариант 1',
    variant: 'on'
  }
}
export const LineControl: Story = {
  args: {
    label: 'Interactive Segment Control',
    options: ['Вар', 'Вариант', 'Вариантище'],
    selected: 'Вариант',
    variant: 'line',
    disabled: false
  }
}
