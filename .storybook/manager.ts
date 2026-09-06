import { addons } from "storybook/manager-api";
import { fretlabTheme } from "./fretlabTheme";

addons.setConfig({
  theme: fretlabTheme,
});
