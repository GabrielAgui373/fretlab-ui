import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta = {
  component: Tooltip,
  tags: ['ai-generated'],
  args: {
    children: <Button icon={<Icon name="add" size={18} decorative />}>Nova sessao</Button>,
    content: 'Cria uma nova sessao de estudo.',
    disabled: false,
    hideDelay: 80,
    placement: 'top',
    showDelay: 140,
  },
  argTypes: {
    children: {
      control: false,
      table: { disable: true },
    },
    className: {
      control: false,
      table: { disable: true },
    },
    content: {
      control: 'text',
    },
    disabled: {
      control: 'inline-radio',
      options: [false, true],
    },
    placement: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  render: ({ children, ...args }) => (
    <Tooltip {...args}>{children}</Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const button = canvas.getByRole('button', { name: /nova sessao/i });
    await userEvent.hover(button);
    const tooltip = await body.findByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    await userEvent.unhover(button);
    await waitFor(() => expect(tooltip.querySelector('.ui-tooltip')).toHaveAttribute('data-state', 'close'));
    await waitFor(() => expect(tooltip).not.toBeInTheDocument());
    await userEvent.tab();
    button.focus();
    await expect(button).toHaveFocus();
    await expect(await body.findByRole('tooltip')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

export const WithIconButton: Story = {
  render: () => (
    <Tooltip content="Fechar modal">
      <IconButton aria-label="Fechar" icon={<Icon name="close" size={18} decorative />} />
    </Tooltip>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const button = canvas.getByRole('button', { name: 'Fechar' });
    await userEvent.hover(button);
    const tooltip = await body.findByRole('tooltip');
    await userEvent.unhover(button);
    await waitFor(() => expect(tooltip.querySelector('.ui-tooltip')).toHaveAttribute('data-state', 'close'));
    await userEvent.hover(button);
    await waitFor(() => expect(body.getByRole('tooltip')).toBeVisible());
    await userEvent.unhover(button);
    await waitFor(() => expect(body.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument());
  },
};

export const Edges: Story = {
  render: () => (
    <>
      {(['top', 'right', 'bottom', 'left'] as const).map((placement, index) => (
        <div key={placement} style={{
          position: 'fixed',
          top: index < 2 ? 8 : undefined,
          bottom: index >= 2 ? 8 : undefined,
          left: index === 0 || index === 3 ? 8 : undefined,
          right: index === 1 || index === 2 ? 8 : undefined,
        }}>
          <Tooltip content="Adicionar a sessao de estudo" placement={placement}>
            <IconButton aria-label={`Canto ${index + 1}`} icon={<Icon name="add" size={18} decorative />} />
          </Tooltip>
        </div>
      ))}
    </>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const viewport = canvasElement.ownerDocument.documentElement;
    for (const button of canvas.getAllByRole('button')) {
      await userEvent.hover(button);
      const tooltip = await body.findByRole('tooltip');
      await waitFor(() => {
        const rect = tooltip.getBoundingClientRect();
        expect(rect.left).toBeGreaterThanOrEqual(7);
        expect(rect.top).toBeGreaterThanOrEqual(7);
        expect(rect.right).toBeLessThanOrEqual(viewport.clientWidth - 7);
        expect(rect.bottom).toBeLessThanOrEqual(viewport.clientHeight - 7);
      });
      await userEvent.unhover(button);
      await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    }
  },
};

export const LongContent: Story = {
  args: {
    content: 'Adicione exercicios a sua sessao de estudo e acompanhe o progresso ao longo da semana. Organize as atividades por instrumento, tecnica e nivel de dificuldade.',
  },
};

export const ScrollContainer: Story = {
  render: () => (
    <div style={{ width: 'min(360px, 100%)', height: 180, overflow: 'auto', border: '1px solid var(--color-border)' }}>
      <div style={{ height: 500, padding: 24 }}>
        <Tooltip content="Adicionar exercicio" placement="right">
          <Button icon={<Icon name="add" size={18} decorative />}>Exercicio</Button>
        </Tooltip>
      </div>
    </div>
  ),
};
