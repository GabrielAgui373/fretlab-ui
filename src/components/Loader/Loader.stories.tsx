import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Loader } from './Loader';

const meta = {
  component: Loader,
  tags: ['ai-generated'],
  args: {
    active: true,
    label: 'Carregando',
    variant: 'compact',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['compact', 'fullscreen'],
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Carregando' })).toBeVisible();
  },
};

export const CompactInactive: Story = {
  args: {
    active: false,
  },
};

export const Fullscreen: Story = {
  args: {
    label: 'Preparando sua biblioteca',
    variant: 'fullscreen',
  },
};
