import type { Preview } from "@storybook/react-vite";
import { fretlabTheme } from "./fretlabTheme";
import "../src/theme/index.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          padding: '32px',
          color: "var(--color-text)",
          background: "var(--color-background)",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: "fretlab",
      values: [
        { name: "fretlab", value: "#090a12" },
        { name: "surface", value: "#121421" },
      ],
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      theme: fretlabTheme,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
