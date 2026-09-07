import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Icon, type IconName } from ".";
import "./Icon.stories.css";

const iconGroups: Array<{ label: string; icons: IconName[] }> = [
  {
    label: "Navegacao",
    icons: [
      "arrow",
      "back",
      "chevronDown",
      "chevronLeft",
      "chevronRight",
      "chevronUp",
      "externalLink",
      "home",
      "menu",
    ],
  },
  {
    label: "Acoes",
    icons: [
      "add",
      "check",
      "close",
      "copy",
      "download",
      "edit",
      "filter",
      "link",
      "minus",
      "more",
      "refresh",
      "save",
      "search",
      "settings",
      "share",
      "trash",
      "upload",
    ],
  },
  {
    label: "Midia",
    icons: ["equalizer", "heart", "pause", "play", "spark", "star"],
  },
  {
    label: "Conteudo",
    icons: ["archive", "calendar", "file", "folder", "library", "mail"],
  },
  {
    label: "Status e seguranca",
    icons: ["eye", "eyeOff", "help", "info", "lock", "warning"],
  },
  {
    label: "Conta",
    icons: ["logIn", "logOut", "user", "users"],
  },
];

const meta = {
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["ai-generated"],
  args: {
    decorative: false,
    name: "play",
    size: 24,
    strokeWidth: 1.75,
    title: "Reproduzir",
  },
  argTypes: {
    className: {
      control: false,
      table: { disable: true },
    },
    decorative: {
      control: "inline-radio",
      options: [false, true],
    },
    name: {
      control: "select",
      options: iconGroups.flatMap(({ icons }) => icons),
    },
    size: {
      control: { type: "range", min: 12, max: 64, step: 1 },
    },
    strokeWidth: {
      control: { type: "range", min: 1, max: 2.5, step: 0.25 },
    },
    title: {
      control: "text",
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Reproduzir" })).toBeVisible();
  },
};

export const Decorative: Story = {
  args: {
    decorative: true,
    name: "spark",
    size: 32,
    title: undefined,
  },
};

export const Library: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="icon-catalog">
      {iconGroups.map(({ label, icons }) => (
        <section className="icon-catalog__section" key={label}>
          <div className="icon-catalog__heading">
            <h2>{label}</h2>
            <span>{icons.length}</span>
          </div>
          <div className="icon-catalog__grid">
            {icons.map((name) => (
              <div className="icon-catalog__item" key={name}>
                <span className="icon-catalog__glyph">
                  <Icon name={name} size={22} decorative />
                </span>
                <code>{name}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="icon-specimens">
      {[16, 20, 24, 32, 40].map((size) => (
        <div className="icon-specimen" key={size}>
          <span className="icon-specimen__stage">
            <Icon name="equalizer" size={size} decorative />
          </span>
          <code>{size}px</code>
        </div>
      ))}
    </div>
  ),
};

export const StrokeWeights: Story = {
  render: () => (
    <div className="icon-specimens">
      {[1.5, 1.75, 2].map((strokeWidth) => (
        <div className="icon-specimen" key={strokeWidth}>
          <span className="icon-specimen__stage">
            <Icon name="settings" size={28} strokeWidth={strokeWidth} decorative />
          </span>
          <code>{strokeWidth}</code>
        </div>
      ))}
    </div>
  ),
};

export const ThemeColors: Story = {
  render: () => (
    <div className="icon-specimens">
      {[
        ["Principal", "var(--color-text)"],
        ["Suave", "var(--color-text-muted)"],
        ["Destaque", "var(--color-accent)"],
        ["Sucesso", "var(--color-success)"],
        ["Perigo", "var(--color-danger-text)"],
      ].map(([label, color]) => (
        <div className="icon-specimen" key={label}>
          <span className="icon-specimen__stage" style={{ color }}>
            <Icon name="check" size={28} decorative />
          </span>
          <code>{label}</code>
        </div>
      ))}
    </div>
  ),
};
