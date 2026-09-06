import { Toast } from "../../../components";

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
    <Toast
      closable={Boolean(error)}
      isOpen
      onClose={onDismiss}
      placement="bottom-right"
      variant={error ? "danger" : "success"}
    >
      {error || notice}
    </Toast>
  );
}
