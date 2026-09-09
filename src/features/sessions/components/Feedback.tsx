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
      layout="compact"
      onClose={onDismiss}
      placement="top-center"
      title={error || notice}
      variant={error ? "danger" : "success"}
    />
  );
}
