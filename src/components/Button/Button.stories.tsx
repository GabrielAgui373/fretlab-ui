import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { Icon, iconNames, type IconName } from '../Icon';

const iconOptions = ['none', ...iconNames];

type ButtonStoryArgs = Omit<ComponentProps<typeof Button>, 'icon'> & {
  icon?: ComponentProps<typeof Button>['icon'];
  iconName?: IconName | 'none';
};

const meta = {
  component: Button,
  tags: ['ai-generated'],
  render: ({ icon, iconName = 'none', ...args }) => (
    <Button
      {...args}
      icon={iconName === 'none' ? icon : <Icon name={iconName} size={18} decorative />}
    />
  ),
  args: {
    children: 'Nova sessao',
    disabled: false,
    fullWidth: false,
    iconName: 'none',
    iconPosition: 'left',
    isLoading: false,
    loadingVariant: 'inline',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    disabled: {
      control: 'inline-radio',
      options: [false, true],
    },
    className: {
      control: false,
      table: { disable: true },
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    iconName: {
      control: 'select',
      options: iconOptions,
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    isLoading: {
      control: 'inline-radio',
      options: [false, true],
    },
    loadingVariant: {
      control: 'inline-radio',
      options: ['inline', 'replace'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: false,
      table: { disable: true },
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
  },
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithIcon: Story = {
  args: {
    iconName: 'add',
  },
};

export const WithRightIcon: Story = {
  args: {
    iconName: 'chevronRight',
    iconPosition: 'right',
  },
};

export const Loading: Story = {
  args: {
    children: 'Salvando',
    isLoading: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /salvando/i })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const LoadingReplace: Story = {
  args: {
    iconName: 'save',
    isLoading: true,
    loadingVariant: 'replace',
  },
};

export const LoadingWithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button icon={<Icon name="save" size={18} decorative />} isLoading>
        Salvando
      </Button>
      <Button
        icon={<Icon name="chevronRight" size={18} decorative />}
        iconPosition="right"
        isLoading
      >
        Continuar
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
