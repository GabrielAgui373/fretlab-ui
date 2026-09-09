import {
  cloneElement,
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import type { IconButtonProps } from "../IconButton";
import "./TextInput.css";

export type TextInputSize = "sm" | "md" | "lg";

type SharedProps = {
  action?: ReactElement<IconButtonProps>;
  containerClassName?: string;
  error?: ReactNode;
  hint?: ReactNode;
  label?: ReactNode;
  leadingIcon?: ReactNode;
  optional?: boolean;
  showCount?: boolean;
  size?: TextInputSize;
  success?: ReactNode;
  trailingIcon?: ReactNode;
};

type InputProps = SharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    multiline?: false;
  };

type TextareaProps = SharedProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

export type TextInputProps = InputProps | TextareaProps;

function getValueLength(value: string | number | readonly string[] | undefined) {
  if (typeof value === "string" || typeof value === "number") return String(value).length;
  return 0;
}

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function TextInput(props, forwardedRef) {
  const generatedId = useId();
  const {
    action,
    "aria-describedby": externalDescribedBy,
    className = "",
    containerClassName = "",
    defaultValue,
    disabled,
    error,
    hint,
    id = generatedId,
    label,
    leadingIcon,
    maxLength,
    multiline = false,
    optional = false,
    readOnly,
    required,
    showCount = false,
    size = "md",
    success,
    trailingIcon,
    value,
  } = props;
  const [uncontrolledLength, setUncontrolledLength] = useState(() =>
    getValueLength(defaultValue),
  );
  const hasError = Boolean(error);
  const hasSuccess = !hasError && Boolean(success);
  const message = error || success || hint;
  const messageId = message ? `${id}-message` : undefined;
  const describedBy = [externalDescribedBy, messageId].filter(Boolean).join(" ") || undefined;
  const length = value === undefined ? uncontrolledLength : getValueLength(value);
  const showCharacterCount = showCount && typeof maxLength === "number";
  const renderedAction = action
    ? cloneElement(action, { disabled: disabled || action.props.disabled })
    : null;
  const rootClasses = [
    "ui-text-input",
    `ui-text-input--${size}`,
    multiline ? "ui-text-input--multiline" : "",
    disabled ? "ui-text-input--disabled" : "",
    readOnly ? "ui-text-input--read-only" : "",
    hasError ? "ui-text-input--error" : "",
    hasSuccess ? "ui-text-input--success" : "",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const controlClasses = ["ui-text-input__control", className].filter(Boolean).join(" ");

  let control: ReactNode;
  if (multiline) {
    const {
      action: _action,
      containerClassName: _containerClassName,
      error: _error,
      hint: _hint,
      label: _label,
      leadingIcon: _leadingIcon,
      multiline: _multiline,
      onChange,
      optional: _optional,
      showCount: _showCount,
      size: _size,
      success: _success,
      trailingIcon: _trailingIcon,
      ...textareaProps
    } = props as TextareaProps;
    control = (
      <textarea
        {...textareaProps}
        aria-describedby={describedBy}
        aria-invalid={hasError || textareaProps["aria-invalid"] || undefined}
        className={controlClasses}
        id={id}
        onChange={(event) => {
          setUncontrolledLength(event.currentTarget.value.length);
          onChange?.(event);
        }}
        ref={forwardedRef as Ref<HTMLTextAreaElement>}
      />
    );
  } else {
    const {
      action: _action,
      containerClassName: _containerClassName,
      error: _error,
      hint: _hint,
      label: _label,
      leadingIcon: _leadingIcon,
      multiline: _multiline,
      onChange,
      optional: _optional,
      showCount: _showCount,
      size: _size,
      success: _success,
      trailingIcon: _trailingIcon,
      ...inputProps
    } = props as InputProps;
    control = (
      <input
        {...inputProps}
        aria-describedby={describedBy}
        aria-invalid={hasError || inputProps["aria-invalid"] || undefined}
        className={controlClasses}
        id={id}
        onChange={(event) => {
          setUncontrolledLength(event.currentTarget.value.length);
          onChange?.(event);
        }}
        ref={forwardedRef as Ref<HTMLInputElement>}
      />
    );
  }

  return (
    <div className={rootClasses}>
      {label && (
        <div className="ui-text-input__heading">
          <label className="ui-text-input__label" htmlFor={id}>
            {label}
            {required && <span className="ui-text-input__required" aria-hidden="true">*</span>}
          </label>
          {optional && !required && <span className="ui-text-input__optional">Opcional</span>}
        </div>
      )}

      <div className="ui-text-input__field">
        {leadingIcon && (
          <span className="ui-text-input__icon ui-text-input__icon--leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {control}
        {(trailingIcon || renderedAction) && (
          <span className="ui-text-input__end">
            {trailingIcon && (
              <span className="ui-text-input__icon ui-text-input__icon--trailing" aria-hidden="true">
                {trailingIcon}
              </span>
            )}
            {renderedAction && <span className="ui-text-input__action">{renderedAction}</span>}
          </span>
        )}
      </div>

      {(message || showCharacterCount) && (
        <div className="ui-text-input__footer">
          {message && (
            <small className="ui-text-input__message" id={messageId}>
              {message}
            </small>
          )}
          {showCharacterCount && (
            <span className="ui-text-input__count" aria-live="polite">
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export type TextInputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
