import { forwardRef, useId } from "react";
import type { IconProps } from "./Icon.types";
import { iconPaths } from "./iconPaths";

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({
  decorative,
  name,
  size = 20,
  strokeWidth = 1.8,
  title,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}, ref) {
  const titleId = useId();
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);
  const isDecorative = decorative ?? !hasAccessibleName;
  const labelledBy = title ? titleId : ariaLabelledBy;

  return (
    <svg
      {...props}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : ariaLabel}
      aria-labelledby={isDecorative ? undefined : labelledBy}
      fill="none"
      focusable="false"
      height={size}
      ref={ref}
      role={isDecorative ? undefined : "img"}
      viewBox="0 0 24 24"
      width={size}
    >
      {!isDecorative && title && <title id={titleId}>{title}</title>}
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        {iconPaths[name]}
      </g>
    </svg>
  );
});
