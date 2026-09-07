import { type HTMLAttributes, type ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import "./Modal.css";

export type ModalProps = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  body?: ReactNode;
  bodyClassName?: string;
  children?: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
  customFooter?: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  header?: ReactNode;
  headerClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  placement?: "center" | "right";
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg";
  subtitle?: ReactNode;
  title?: ReactNode;
};

export type ModalHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  closeLabel?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  subtitle?: ReactNode;
  title?: ReactNode;
  titleId?: string;
};

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;
export type ModalFooterProps = HTMLAttributes<HTMLElement>;

export function ModalHeader({
  children,
  className = "",
  closeLabel = "Fechar",
  onClose,
  showCloseButton = true,
  subtitle,
  title,
  titleId,
  ...props
}: ModalHeaderProps) {
  return (
    <header {...props} className={`ui-modal__header ${className}`.trim()}>
      {children ?? (
        <div>
          {subtitle && <span className="ui-modal__subtitle">{subtitle}</span>}
          {title && <h2 id={titleId}>{title}</h2>}
        </div>
      )}
      {showCloseButton && onClose && (
        <IconButton
          aria-label={closeLabel}
          icon={<Icon name="close" size={19} decorative />}
          onClick={onClose}
        />
      )}
    </header>
  );
}

export function ModalBody({ children, className = "", ...props }: ModalBodyProps) {
  return (
    <div {...props} className={`ui-modal__content ${className}`.trim()}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = "", ...props }: ModalFooterProps) {
  return (
    <footer {...props} className={`ui-modal__footer ${className}`.trim()}>
      {children}
    </footer>
  );
}

export function Modal({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  body,
  bodyClassName,
  children,
  className = "",
  closeOnBackdrop = true,
  customFooter,
  footer,
  footerClassName,
  header,
  headerClassName,
  isOpen,
  onClose,
  placement = "center",
  showCloseButton = true,
  size = "md",
  subtitle,
  title,
}: ModalProps) {
  const titleId = useId();
  const bodyContent = body ?? children;
  const labelledBy = ariaLabelledBy ?? (header === undefined && title ? titleId : undefined);
  const shouldRenderDefaultHeader =
    header === undefined && (Boolean(title) || Boolean(subtitle) || showCloseButton);

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
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`ui-modal ui-modal--${placement} ui-modal--${size} ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        {header}
        {shouldRenderDefaultHeader && (
          <ModalHeader
            className={headerClassName}
            onClose={onClose}
            showCloseButton={showCloseButton}
            subtitle={subtitle}
            title={title}
            titleId={titleId}
          />
        )}
        {bodyContent && <ModalBody className={bodyClassName}>{bodyContent}</ModalBody>}
        {customFooter ?? (footer && <ModalFooter className={footerClassName}>{footer}</ModalFooter>)}
      </section>
    </div>,
    document.body,
  );
}
