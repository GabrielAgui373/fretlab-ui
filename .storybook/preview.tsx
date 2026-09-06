import type { Preview } from "@storybook/react-vite";
import { fretlabStorybookBackgrounds, fretlabTheme } from "./fretlabTheme";
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
          fontFamily: '"Avenir Next", Avenir, "Segoe UI", system-ui, sans-serif',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: "fretlab purple",
      values: fretlabStorybookBackgrounds,
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
