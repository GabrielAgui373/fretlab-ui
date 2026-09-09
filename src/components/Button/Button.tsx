import type { ButtonHTMLAttributes, ReactElement } from "react";
import type { IconProps } from "../Icon";
import { Loader } from "../Loader";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonType = "button" | "submit" | "reset";
export type ButtonIconPosition = "left" | "right";
export type ButtonLoadingVariant = "inline" | "replace";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  fullWidth?: boolean;
  icon?: ReactElement<IconProps>;
  iconPosition?: ButtonIconPosition;
  isLoading?: boolean;
  loadingVariant?: ButtonLoadingVariant;
  size?: ButtonSize;
  type?: ButtonType;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  icon,
  iconPosition = "left",
  isLoading = false,
  loadingVariant = "inline",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const hasIcon = Boolean(icon);
  const hasLabel = Boolean(children);
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    `ui-button--icon-${iconPosition}`,
    hasIcon ? "ui-button--has-icon" : "",
    hasLabel ? "ui-button--has-label" : "",
    fullWidth ? "ui-button--full" : "",
    isLoading ? "ui-button--loading" : "",
    `ui-button--loading-${loadingVariant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      aria-busy={isLoading}
      className={classes}
      disabled={disabled || isLoading}
      type={type}
    >
      {iconPosition === "left" && icon && <span className="ui-button__icon">{icon}</span>}
      {children && <span className="ui-button__label">{children}</span>}
      {iconPosition === "right" && icon && <span className="ui-button__icon">{icon}</span>}
      <span className="ui-button__loader-slot">
        <Loader
          active={isLoading}
          className="ui-button__loader"
          label="Carregando ação"
          variant="compact"
        />
      </span>
    </button>
  );
}
