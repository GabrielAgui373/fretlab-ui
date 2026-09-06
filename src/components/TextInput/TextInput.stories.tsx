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

export const WithLeadingIcon: Story = {
  args: {
    'aria-label': 'Buscar sessoes',
    leadingIcon: <Icon name="search" size={18} />,
    placeholder: 'Buscar sessao...',
    type: 'search',
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'voce@email.com',
    trailingIcon: <Icon name="mail" size={18} />,
    type: 'email',
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Link',
    leadingIcon: <Icon name="link" size={18} />,
    placeholder: 'https://fretlab.app',
    trailingIcon: <Icon name="externalLink" size={18} />,
    type: 'url',
  },
};

export const Focused: Story = {
  args: {
    autoFocus: true,
    label: 'Nome',
    placeholder: 'Ex.: Improviso em Do menor',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Nome',
    leadingIcon: <Icon name="lock" size={18} />,
    placeholder: 'Campo indisponivel',
    readOnly: true,
    value: 'Sessao arquivada',
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Slug',
    readOnly: true,
    trailingIcon: <Icon name="copy" size={18} />,
    value: 'improviso-em-do-menor',
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

export const WithCount: Story = {
  args: {
    label: 'Titulo',
    maxLength: 120,
    readOnly: true,
    showCount: true,
    trailingIcon: <Icon name="edit" size={18} />,
    value: 'Improviso em Do menor',
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

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 420 }}>
      <TextInput label="Padrao" placeholder="Digite algo..." />
      <TextInput
        label="Com icones"
        leadingIcon={<Icon name="search" size={18} />}
        placeholder="Buscar..."
        trailingIcon={<Icon name="filter" size={18} />}
      />
      <TextInput
        disabled
        label="Desabilitado"
        readOnly
        trailingIcon={<Icon name="lock" size={18} />}
        value="Nao editavel"
      />
      <TextInput
        error="Informe um valor valido."
        label="Erro"
        leadingIcon={<Icon name="warning" size={18} />}
        placeholder="Campo obrigatorio"
      />
    </div>
  ),
};
