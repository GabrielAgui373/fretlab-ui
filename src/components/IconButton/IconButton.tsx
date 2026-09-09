import type { ButtonHTMLAttributes, ReactElement } from "react";
import type { IconProps } from "../Icon";
import { Loader } from "../Loader";
import type { ButtonSize, ButtonType, ButtonVariant } from "../Button/Button";
import "./IconButton.css";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children" | "type"
> & {
  "aria-label": string;
  icon: ReactElement<IconProps>;
  isLoading?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
  variant?: ButtonVariant;
};

export function IconButton({
  "aria-label": ariaLabel,
  className = "",
  disabled,
  icon,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: IconButtonProps) {
  const classes = [
    "ui-icon-button",
    `ui-icon-button--${variant}`,
    `ui-icon-button--${size}`,
    isLoading ? "ui-icon-button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      className={classes}
      disabled={disabled || isLoading}
      type={type}
    >
      <span className="ui-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="ui-icon-button__loader-slot">
        <Loader
          active={isLoading}
          className="ui-icon-button__loader"
          label={ariaLabel}
          variant="compact"
        />
      </span>
    </button>
  );
}
