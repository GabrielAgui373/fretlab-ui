import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  useId,
} from "react";
import "./TextInput.css";

type SharedProps = {
  error?: string;
  hint?: string;
  label?: string;
  leadingIcon?: ReactNode;
  showCount?: boolean;
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

export function TextInput(props: TextInputProps) {
  const generatedId = useId();
  const {
    className = "",
    error,
    hint,
    id = generatedId,
    label,
    leadingIcon,
    maxLength,
    multiline,
    showCount = false,
    value,
  } = props;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const length = typeof value === "string" ? value.length : 0;
  const controlClasses = [
    "ui-text-input__control",
    leadingIcon ? "ui-text-input__control--with-icon" : "",
    error ? "ui-text-input__control--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let control;
  if (multiline) {
    const {
      error: _error,
      hint: _hint,
      label: _label,
      leadingIcon: _leadingIcon,
      multiline: _multiline,
      showCount: _showCount,
      ...textareaProps
    } = props as TextareaProps;
    control = (
      <textarea
        {...textareaProps}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={controlClasses}
        id={id}
      />
    );
  } else {
    const {
      error: _error,
      hint: _hint,
      label: _label,
      leadingIcon: _leadingIcon,
      multiline: _multiline,
      showCount: _showCount,
      ...inputProps
    } = props as InputProps;
    control = (
      <input
        {...inputProps}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={controlClasses}
        id={id}
      />
    );
  }

  return (
    <label className="ui-text-input" htmlFor={id}>
      {label && <span className="ui-text-input__label">{label}</span>}
      <span className="ui-text-input__field">
        {leadingIcon && <span className="ui-text-input__icon">{leadingIcon}</span>}
        {control}
        {showCount && maxLength && (
          <span className="ui-text-input__count">{length}/{maxLength}</span>
        )}
      </span>
      {(error || hint) && (
        <small
          className={error ? "ui-text-input__message--error" : "ui-text-input__message"}
          id={describedBy}
        >
          {error || hint}
        </small>
      )}
    </label>
  );
}

export type TextInputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
