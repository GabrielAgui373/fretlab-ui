import { Icon } from "../../../components";
import "./sessions.css";

export function Feedback({
  error,
  notice,
  onDismiss,
}: {
  error: string | null;
  notice: string | null;
  onDismiss: () => void;
}) {
  if (!error && !notice) return null;

  return (
    <div className={`feedback ${error ? "feedback--error" : "feedback--success"}`} role="status">
      <span>{error || notice}</span>
      {error && (
        <button aria-label="Fechar aviso" onClick={onDismiss}>
          <Icon name="close" size={17} />
        </button>
      )}
    </div>
  );
}
