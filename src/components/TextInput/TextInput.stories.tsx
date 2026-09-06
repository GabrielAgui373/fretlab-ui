import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TextInput } from './TextInput';
import { Icon } from '../Icon';

const meta = {
  component: TextInput,
  tags: ['ai-generated'],
  args: {
    label: 'Nome',
    placeholder: 'Ex.: Improviso em Do menor',
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <TextInput
        label={args.label}
        multiline={false}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder={args.placeholder}
        value={value}
      />
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Nome'), 'Pentatonica');
    await expect(canvas.getByDisplayValue('Pentatonica')).toBeVisible();
  },
};

export const WithIcon: Story = {
  args: {
    'aria-label': 'Buscar sessoes',
    leadingIcon: <Icon name="search" size={18} />,
    placeholder: 'Buscar sessao...',
    type: 'search',
  },
};

export const WithHint: Story = {
  args: {
    hint: 'Use um nome curto e facil de reconhecer.',
  },
};

export const WithError: Story = {
  args: {
    error: 'Informe um nome para continuar.',
    readOnly: true,
    value: '',
  },
};

export const Multiline: Story = {
  args: {
    label: 'Descricao',
    maxLength: 2000,
    multiline: true,
    placeholder: 'Objetivos, repertorio ou lembretes...',
    rows: 4,
    readOnly: true,
    showCount: true,
    value: 'Treinar entrada do solo e repetir o trecho final.',
  },
};
