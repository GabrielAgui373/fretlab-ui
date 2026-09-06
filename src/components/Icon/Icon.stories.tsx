import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Icon, iconNames } from '.';

const meta = {
  component: Icon,
  tags: ['ai-generated'],
  args: {
    name: 'play',
    size: 24,
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Play',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Play' })).toBeVisible();
  },
};

export const Decorative: Story = {
  args: {
    decorative: true,
    name: 'spark',
    size: 32,
  },
};

export const Library: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))',
        gap: 12,
        maxWidth: 780,
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 8,
            padding: 12,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-soft)',
            background: 'var(--color-surface)',
          }}
        >
          <Icon name={name} size={20} />
          <small style={{ color: 'var(--color-text-subtle)', fontSize: 10 }}>{name}</small>
        </div>
      ))}
    </div>
  ),
};
