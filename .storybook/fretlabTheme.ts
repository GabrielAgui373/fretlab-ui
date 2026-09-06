import { create } from "storybook/theming";

const colors = {
  background: "#090a12",
  backgroundSubtle: "#0d0e18",
  surface: "#121421",
  surfaceRaised: "#181b2b",
  surfaceHover: "#20243a",
  field: "#0c0e18",
  text: "#f6f4ff",
  textSoft: "#d1cde0",
  textMuted: "#918da3",
  border: "#282a3d",
  borderStrong: "#383b55",
  purple: "#908cff",
  purpleHover: "#aaa7ff",
  purpleSoft: "rgba(144, 140, 255, 0.13)",
  purpleContrast: "#11111d",
};

export const fretlabStorybookBackgrounds = [
  { name: "fretlab purple", value: colors.background },
  { name: "surface", value: colors.surface },
  { name: "raised", value: colors.surfaceRaised },
];

export const fretlabTheme = create({
  base: "dark",
  brandTitle: "FretLab",
  colorPrimary: colors.purple,
  colorSecondary: colors.purple,
  appBg: colors.background,
  appContentBg: colors.surface,
  appPreviewBg: colors.background,
  appBorderColor: colors.border,
  appBorderRadius: 9,
  barBg: colors.surface,
  barHoverColor: colors.purpleHover,
  barSelectedColor: colors.purple,
  barTextColor: colors.textSoft,
  booleanBg: colors.surfaceRaised,
  booleanSelectedBg: colors.purple,
  buttonBg: colors.surfaceRaised,
  buttonBorder: colors.borderStrong,
  inputBg: colors.field,
  inputBorder: colors.border,
  inputBorderRadius: 6,
  inputTextColor: colors.text,
  textColor: colors.text,
  textInverseColor: colors.purpleContrast,
  textMutedColor: colors.textMuted,
  fontBase: '"Avenir Next", Avenir, "Segoe UI", system-ui, sans-serif',
  fontCode: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
});
