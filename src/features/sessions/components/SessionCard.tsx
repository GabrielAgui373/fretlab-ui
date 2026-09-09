import { memo } from "react";
import { Button, Icon } from "../../../components";
import type { Session } from "../types";
import { formatRelativeDate } from "../utils";
import "./sessions.css";

type SessionCardProps = {
  index: number;
  isInspecting: boolean;
  isOpening: boolean;
  layout?: "card" | "list";
  onInspect: (session: Session) => void;
  onOpen: (session: Session) => void;
  session: Session;
};

export const SessionCard = memo(function SessionCard({
  index,
  isInspecting,
  isOpening,
  layout = "card",
  onInspect,
  onOpen,
  session,
}: SessionCardProps) {
  return (
    <article className={`session-card session-card--${layout}`}>
      <div
        aria-hidden="true"
        className={`session-card__art session-card__art--${(index % 4) + 1}`}
      >
        <span>{session.name.slice(0, 1).toLocaleUpperCase()}</span>
        <Icon name="equalizer" size={28} strokeWidth={1.5} decorative />
      </div>
      <div className="session-card__content">
        <div className="session-card__copy">
          <h3 title={session.name}>{session.name}</h3>
          <p>{session.description || "Sem descrição"}</p>
        </div>
        <div className="session-card__meta">
          <Icon name="calendar" size={15} decorative />
          <span>Última abertura</span>
          <strong>{formatRelativeDate(session.last_opened_at)}</strong>
        </div>
        <div className="session-card__actions">
          <Button
            aria-label={`Ver detalhes e editar ${session.name}`}
            disabled={isOpening}
            icon={<Icon name="info" size={16} decorative />}
            isLoading={isInspecting}
            loadingVariant="replace"
            onClick={() => onInspect(session)}
            size="sm"
            variant="secondary"
          >
            Detalhes
          </Button>
          <Button
            aria-label={`Abrir ${session.name}`}
            disabled={isInspecting}
            icon={<Icon name="play" size={16} decorative />}
            isLoading={isOpening}
            loadingVariant="replace"
            onClick={() => onOpen(session)}
            size="sm"
          >
            Abrir
          </Button>
        </div>
      </div>
    </article>
  );
});
