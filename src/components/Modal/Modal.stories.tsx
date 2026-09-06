import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Modal } from './Modal';

const meta = {
  component: Modal,
  tags: ['ai-generated'],
  args: {
    isOpen: true,
    placement: 'center',
    size: 'md',
    subtitle: 'Novo espaco',
    title: 'O que vamos praticar?',
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['center', 'right'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    children: (
      <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        De um nome claro. Voce podera organizar o conteudo depois.
      </p>
    ),
    footer: (
      <>
        <Button variant="ghost">Cancelar</Button>
        <Button>Criar sessao</Button>
      </>
    ),
    onClose: () => undefined,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: /o que vamos praticar/i })).toBeVisible();
    });
  },
};

export const Drawer: Story = {
  args: {
    children: (
      <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        Mantenha o contexto da sessao facil de encontrar.
      </p>
    ),
    onClose: () => undefined,
    placement: 'right',
    subtitle: 'Detalhes da sessao',
    title: 'Improviso em Do menor',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Este exemplo usa o mesmo portal em document.body que o app.
          </p>
        </Modal>
      </>
    );
  },
  args: {
    children: null,
    onClose: () => undefined,
    title: 'Modal controlado',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /abrir modal/i }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: /modal controlado/i })).toBeVisible();
    });
  },
};
