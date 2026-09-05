import { Button, Icon, Modal } from "../../../components";
import type { Session } from "../types";
import "./sessions.css";

export function DeleteSessionModal({
  isBusy,
  onCancel,
  onConfirm,
  session,
}: {
  isBusy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  session: Session | null;
}) {
  return (
    <Modal
      className="delete-session"
      closeOnBackdrop={!isBusy}
      footer={
        <>
          <Button disabled={isBusy} onClick={onCancel} variant="ghost">Manter sessão</Button>
          <Button isLoading={isBusy} onClick={onConfirm} variant="danger">Excluir sessão</Button>
        </>
      }
      isOpen={Boolean(session)}
      onClose={onCancel}
      size="sm"
    >
      {session && (
        <div className="delete-session__body">
          <span><Icon name="trash" /></span>
          <h2>Excluir “{session.name}”?</h2>
          <p>Essa ação é permanente e os dados associados à sessão serão removidos.</p>
        </div>
      )}
    </Modal>
  );
}
