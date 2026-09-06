import { type ReactElement, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconProps } from "../Icon";
import { IconButton } from "../IconButton";
import "./Toast.css";

export type ToastVariant = "default" | "success" | "danger";
export type ToastLayout = "compact" | "complete";
export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastProps = {
  autoCloseDelay?: number;
  children?: ReactNode;
  className?: string;
  closable?: boolean;
  icon?: ReactElement<IconProps> | null;
  isOpen: boolean;
  layout?: ToastLayout;
  onClose?: () => void;
  placement?: ToastPlacement;
  title?: ReactNode;
  variant?: ToastVariant;
};

const iconByVariant: Record<ToastVariant, IconProps["name"]> = {
  default: "info",
  success: "check",
  danger: "warning",
};

const roleByVariant: Record<ToastVariant, "status" | "alert"> = {
  default: "status",
  success: "status",
  danger: "alert",
};

export function Toast({
  autoCloseDelay,
  children,
  className = "",
  closable = true,
  icon,
  isOpen,
  layout = "complete",
  onClose,
  placement = "bottom-right",
  title,
  variant = "default",
}: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonVisible = closable && Boolean(onClose);
  const leadingIcon = layout === "compact" || icon === null ? null : icon ?? (
    <Icon name={iconByVariant[variant]} size={17} decorative />
  );
  const compactContent = title || children;
  const state = isVisible ? "open" : "closed";
  const classes = [
    "ui-toast",
    `ui-toast--${variant}`,
    `ui-toast--${layout}`,
    !title || layout === "compact" ? "ui-toast--message-only" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    setIsVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !shouldRender) return;

    const frame = window.requestAnimationFrame(() => setIsVisible(true));

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!isOpen || !autoCloseDelay || !onClose) return;

    const timeout = window.setTimeout(onClose, autoCloseDelay);

    return () => window.clearTimeout(timeout);
  }, [autoCloseDelay, isOpen, onClose]);

  useEffect(() => {
    if (isOpen || !shouldRender) return;

    const timeout = window.setTimeout(() => setShouldRender(false), 180);

    return () => window.clearTimeout(timeout);
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const toast = (
    <div className={`ui-toast-viewport ui-toast-viewport--${placement}`}>
      <section
        aria-live={variant === "danger" ? "assertive" : "polite"}
        className={classes}
        data-motion={isOpen ? "enter" : "exit"}
        data-state={state}
        onTransitionEnd={(event) => {
          if (event.currentTarget === event.target && !isVisible) {
            setShouldRender(false);
          }
        }}
        role={roleByVariant[variant]}
      >
        {leadingIcon && (
          <span className="ui-toast__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        {layout === "compact" ? (
          <strong className="ui-toast__title">{compactContent}</strong>
        ) : (
          <div className="ui-toast__body">
            {title && <strong className="ui-toast__title">{title}</strong>}
            {children && <div className="ui-toast__message">{children}</div>}
          </div>
        )}

        {closeButtonVisible && (
          <IconButton
            aria-label="Fechar aviso"
            className="ui-toast__close"
            icon={<Icon name="close" size={16} decorative />}
            onClick={onClose}
            size="sm"
            variant="ghost"
          />
        )}
      </section>
    </div>
  );

  if (typeof document === "undefined") return toast;

  return createPortal(toast, document.body);
}
