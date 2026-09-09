import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Icon, iconNames, type IconName } from '../Icon';
import { IconButton } from './IconButton';

type IconButtonStoryArgs = ComponentProps<typeof IconButton> & {
  iconName?: IconName;
};

const meta = {
  component: IconButton,
  tags: ['ai-generated'],
  render: ({ icon, iconName = 'close', ...args }) => (
    <IconButton {...args} icon={iconName ? <Icon name={iconName} size={18} decorative /> : icon} />
  ),
  args: {
    'aria-label': 'Fechar',
    disabled: false,
    icon: <Icon name="close" size={18} decorative />,
    iconName: 'close',
    isLoading: false,
    size: 'md',
    variant: 'secondary',
  },
  argTypes: {
    'aria-label': {
      control: 'text',
    },
    className: {
      control: false,
      table: { disable: true },
    },
    disabled: {
      control: 'inline-radio',
      options: [false, true],
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    iconName: {
      control: 'select',
      options: iconNames,
    },
    isLoading: {
      control: 'inline-radio',
      options: [false, true],
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
} satisfies Meta<IconButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /fechar/i })).toBeVisible();
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton
        aria-label="Fechar pequeno"
        icon={<Icon name="close" size={16} decorative />}
        size="sm"
      />
      <IconButton aria-label="Fechar medio" icon={<Icon name="close" size={18} decorative />} />
      <IconButton
        aria-label="Fechar grande"
        icon={<Icon name="close" size={20} decorative />}
        size="lg"
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <IconButton
        aria-label="Adicionar"
        icon={<Icon name="add" size={18} decorative />}
        variant="primary"
      />
      <IconButton
        aria-label="Editar"
        icon={<Icon name="edit" size={18} decorative />}
        variant="secondary"
      />
      <IconButton
        aria-label="Buscar"
        icon={<Icon name="search" size={18} decorative />}
        variant="ghost"
      />
      <IconButton
        aria-label="Excluir"
        icon={<Icon name="trash" size={18} decorative />}
        variant="danger"
      />
    </div>
  ),
};
