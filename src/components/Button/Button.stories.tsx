import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { Icon, iconNames } from '../Icon';

const iconOptions = ['none', ...iconNames];
const iconMapping = Object.fromEntries([
  ['none', undefined],
  ...iconNames.map((name) => [name, <Icon name={name} size={18} decorative />]),
]);

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: {
    children: 'Nova sessao',
    disabled: false,
    fullWidth: false,
    icon: 'none',
    iconPosition: 'left',
    isLoading: false,
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
      control: 'select',
      mapping: iconMapping,
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithIcon: Story = {
  args: {
    icon: 'add',
  },
};

export const WithRightIcon: Story = {
  args: {
    icon: 'chevronRight',
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

export const CssCheck: Story = {
  args: {
    children: 'Submit',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(144, 140, 255)');
  },
};
