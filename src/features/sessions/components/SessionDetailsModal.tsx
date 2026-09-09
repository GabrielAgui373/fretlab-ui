import { useEffect, useState } from "react";
import { Button, Icon, Modal } from "../../../components";
import type { Session } from "../types";
import { formatFullDate } from "../utils";
import "./sessions.css";

type SessionDetailsModalProps = {
  isOpening: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onOpen: () => void;
  session: Session | null;
};

export function SessionDetailsModal({
  isOpening,
  onClose,
  onDelete,
  onEdit,
  onOpen,
  session,
}: SessionDetailsModalProps) {
  const [displayedSession, setDisplayedSession] = useState(session);

  useEffect(() => {
    if (session) setDisplayedSession(session);
  }, [session]);

  return (
    <Modal
      className="session-details"
      footer={
        <>
          <Button icon={<Icon name="edit" size={17} />} onClick={onEdit} variant="secondary">Editar</Button>
          <Button icon={<Icon name="trash" size={17} />} onClick={onDelete} variant="ghost">Excluir</Button>
        </>
      }
      isOpen={Boolean(session)}
      onClose={onClose}
      placement="right"
      subtitle="Detalhes da sessão"
    >
      {displayedSession && (
        <>
          <div className="session-details__art">
            <span>{displayedSession.name.slice(0, 1).toLocaleUpperCase()}</span>
          </div>
          <div className="session-details__body">
            <h2>{displayedSession.name}</h2>
            <p>{displayedSession.description || "Nenhuma descrição adicionada."}</p>
            <Button
              fullWidth
              icon={<Icon name="play" size={17} />}
              isLoading={isOpening}
              onClick={onOpen}
              size="lg"
            >
              Abrir sessão
            </Button>
            <dl className="session-details__dates">
              <div><dt>Último acesso</dt><dd>{formatFullDate(displayedSession.last_opened_at)}</dd></div>
              <div><dt>Criada em</dt><dd>{formatFullDate(displayedSession.created_at)}</dd></div>
            </dl>
          </div>
        </>
      )}
    </Modal>
  );
}
