import "./Loader.css";

export type LoaderVariant = "fullscreen" | "compact";

export type LoaderProps = {
  active?: boolean;
  className?: string;
  label?: string;
  variant?: LoaderVariant;
};

const PRIMARY_WAVE =
  "M-4 28 C3 28 5 14 13 14 S23 42 32 42 S42 14 51 14 S61 42 70 42 S80 14 89 14 S99 42 108 42 S118 14 127 14 S137 42 146 42 S156 14 165 14 S175 42 184 42";

const SECONDARY_WAVE =
  "M-4 28 C4 28 7 19 16 19 S27 37 37 37 S48 19 58 19 S69 37 79 37 S90 19 100 19 S111 37 121 37 S132 19 142 19 S153 37 163 37 S174 19 184 19";

export function Loader({
  active = true,
  className = "",
  label = "Carregando",
  variant = "fullscreen",
}: LoaderProps) {
  const classes = [
    "ui-loader",
    `ui-loader--${variant}`,
    active && "ui-loader--active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "compact") {
    return (
      <span
        aria-hidden={!active}
        aria-label={active ? label : undefined}
        className={classes}
        role={active ? "status" : undefined}
      >
        <svg aria-hidden="true" viewBox="0 0 36 16">
          <path
            className="ui-loader__compact-base"
            d="M0 8 C3 8 3 3 6 3 S9 13 12 13 S15 3 18 3 S21 13 24 13 S27 3 30 3 S33 8 36 8"
          />
          <path
            className="ui-loader__compact-pulse"
            d="M0 8 C3 8 3 3 6 3 S9 13 12 13 S15 3 18 3 S21 13 24 13 S27 3 30 3 S33 8 36 8"
            pathLength="1"
          />
        </svg>
      </span>
    );
  }

  return (
    <div
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
      className={classes}
      role="status"
    >
      <div className="ui-loader__content">
        <div className="ui-loader__signal" aria-hidden="true">
          <svg viewBox="0 0 180 56">
            <path className="ui-loader__wave ui-loader__wave--primary" d={PRIMARY_WAVE} />
            <path className="ui-loader__wave ui-loader__wave--secondary" d={SECONDARY_WAVE} />
            <path
              className="ui-loader__pulse ui-loader__pulse--primary"
              d={PRIMARY_WAVE}
              pathLength="1"
            />
            <path
              className="ui-loader__pulse ui-loader__pulse--secondary"
              d={SECONDARY_WAVE}
              pathLength="1"
            />
          </svg>
          <span className="ui-loader__marker" />
        </div>

        {label && (
          <p className="ui-loader__label">
            {label}
            <span className="ui-loader__ellipsis" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
