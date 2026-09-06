import { ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import "./Modal.css";

export type ModalProps = {
  children: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  placement?: "center" | "right";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  title?: string;
};

export function Modal({
  children,
  className = "",
  closeOnBackdrop = true,
  footer,
  isOpen,
  onClose,
  placement = "center",
  size = "md",
  subtitle,
  title,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`ui-modal-backdrop ui-modal-backdrop--${placement}`}
      onMouseDown={() => closeOnBackdrop && onClose()}
      role="presentation"
    >
      <section
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={`ui-modal ui-modal--${placement} ui-modal--${size} ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="ui-modal__header">
          <div>
            {subtitle && <span className="ui-modal__subtitle">{subtitle}</span>}
            {title && <h2 id={titleId}>{title}</h2>}
          </div>
          <IconButton
            aria-label="Fechar"
            icon={<Icon name="close" size={19} decorative />}
            onClick={onClose}
          />
        </header>
        <div className="ui-modal__content">{children}</div>
        {footer && <footer className="ui-modal__footer">{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
}
