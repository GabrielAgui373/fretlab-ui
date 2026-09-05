import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader } from "../Loader";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  icon,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? "ui-button--full" : "",
    isLoading ? "ui-button--loading" : "",
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
      {icon && <span className="ui-button__icon">{icon}</span>}
      {children && <span className="ui-button__label">{children}</span>}
      <Loader
        active={isLoading}
        className="ui-button__loader"
        label="Carregando ação"
        variant="compact"
      />
    </button>
  );
}
