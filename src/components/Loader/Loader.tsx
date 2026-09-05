import type { HTMLAttributes } from "react";
import "./Loader.css";

type LoaderProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  fullScreen?: boolean;
  label?: string;
};

const PRIMARY_WAVE =
  "M-4 28 C3 28 5 14 13 14 S23 42 32 42 S42 14 51 14 S61 42 70 42 S80 14 89 14 S99 42 108 42 S118 14 127 14 S137 42 146 42 S156 14 165 14 S175 42 184 42";

const SECONDARY_WAVE =
  "M-4 28 C4 28 7 19 16 19 S27 37 37 37 S48 19 58 19 S69 37 79 37 S90 19 100 19 S111 37 121 37 S132 19 142 19 S153 37 163 37 S174 19 184 19";

export function Loader({
  className = "",
  fullScreen = false,
  label = "Carregando",
  ...props
}: LoaderProps) {
  const classes = [
    "ui-loader",
    fullScreen && "ui-loader--fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
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
