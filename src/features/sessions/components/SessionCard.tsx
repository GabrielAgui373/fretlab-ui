import { memo } from "react";
import { Icon, IconButton, Tooltip } from "../../../components";
import type { Session } from "../types";
import { formatRelativeDate } from "../utils";
import "./sessions.css";

type SessionCardProps = {
  index: number;
  isBusy: boolean;
  onInspect: (session: Session) => void;
  onOpen: (session: Session) => void;
  session: Session;
};

export const SessionCard = memo(function SessionCard({
  index,
  isBusy,
  onInspect,
  onOpen,
  session,
}: SessionCardProps) {
  return (
    <article className="session-card">
      <button
        aria-label={`Ver detalhes de ${session.name}`}
        className="session-card__hit-area"
        disabled={isBusy}
        onClick={() => onInspect(session)}
      />
      <div className={`session-card__art session-card__art--${(index % 4) + 1}`}>
        <span>{session.name.slice(0, 1).toLocaleUpperCase()}</span>
        <Tooltip content={`Abrir ${session.name}`} placement="left">
          <IconButton
            aria-label={`Abrir ${session.name}`}
            className="session-card__play"
            icon={<Icon name="play" size={18} decorative />}
            isLoading={isBusy}
            onClick={() => onOpen(session)}
            variant="secondary"
          />
        </Tooltip>
      </div>
      <div className="session-card__content">
        <div className="session-card__heading">
          <h3>{session.name}</h3>
          <Icon name="more" size={20} />
        </div>
        <p>{session.description || "Sem descrição"}</p>
        <div className="session-card__meta">
          <span>Aberta {formatRelativeDate(session.last_opened_at)}</span>
          <Icon name="arrow" size={16} />
        </div>
      </div>
    </article>
  );
});
