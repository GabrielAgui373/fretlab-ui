import type { SVGAttributes } from "react";
import type { IconName } from "./iconNames";

export type IconProps = Omit<SVGAttributes<SVGSVGElement>, "children" | "name" | "strokeWidth"> & {
  decorative?: boolean;
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  title?: string;
};
