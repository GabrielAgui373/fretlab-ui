import { useCallback, useMemo, useState } from "react";
import { Button, Icon, IconButton, Loader, TextInput, Toast, Tooltip } from "../../components";
import {
  DeleteSessionModal,
  SessionCard,
  SessionDetailsModal,
  SessionFormModal,
  SessionWave,
} from "../../features/sessions/components";
import { useSessionLibrary } from "../../features/sessions";
import type { Session, SessionFormValues } from "../../features/sessions";
import { formatRelativeDate } from "../../features/sessions/utils";
import "./SessionsPage.css";

export function SessionsPage({ onOpen }: { onOpen: (session: Session) => void }) {
  const {
    busyAction,
    clearError,
    createSession,
    deleteSession,
    error,
    getSession,
    isLoading,
    notice,
    openSession,
    sessions,
    updateSession,
  } = useSessionLibrary();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [createOpen, setCreateOpen] = useState(false);
  const [details, setDetails] = useState<Session | null>(null);
  const [editing, setEditing] = useState<Session | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return sessions;
    return sessions.filter((session) =>
      `${session.name} ${session.description ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    );
  }, [search, sessions]);

  const mostRecentSession = useMemo(
    () => sessions.reduce<Session | null>((mostRecent, session) => {
      if (!mostRecent) return session;

      return new Date(session.last_opened_at) > new Date(mostRecent.last_opened_at)
        ? session
        : mostRecent;
    }, null),
    [sessions],
  );

  const handleInspect = useCallback(
    async (session: Session) => {
      const result = await getSession(session.id);
      if (result) setDetails(result);
    },
    [getSession],
  );

  const handleOpen = useCallback(
    async (session: Session) => {
      const result = await openSession(session.id);
      if (result) onOpen(result);
    },
    [onOpen, openSession],
  );

  async function handleCreate(values: SessionFormValues) {
    const result = await createSession(values);
    if (result) setCreateOpen(false);
  }

  async function handleUpdate(values: SessionFormValues) {
    if (!editing) return;
    const result = await updateSession(editing, values);
    if (result) setEditing(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (await deleteSession(deleteTarget)) setDeleteTarget(null);
  }

  if (isLoading) {
    return <Loader label="Preparando sua biblioteca" variant="fullscreen" />;
  }

  return (
    <div className="sessions-layout">
      <main className="sessions-main">
        <header className="sessions-header">
          <h1>Sessões</h1>
          <Tooltip content="Criar uma nova sessão de estudo" placement="left">
            <Button
              icon={<Icon name="add" size={18} decorative />}
              onClick={() => setCreateOpen(true)}
            >
              Nova sessão
            </Button>
          </Tooltip>
        </header>

        <section aria-label="Resumo da biblioteca" className="sessions-overview">
          <div className="sessions-overview__total">
            <svg
              aria-hidden="true"
              className="sessions-overview__sessions-icon"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            >
              <path d="m12 3 9 5-9 5-9-5Z" />
              <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
            </svg>
            <strong>{sessions.length}</strong>
            <span>{sessions.length === 1 ? "sessão na biblioteca" : "sessões na biblioteca"}</span>
          </div>

          <div className="sessions-overview__recent">
            {mostRecentSession ? (
              <>
                <span className="sessions-overview__label">Última sessão</span>
                <h2 title={mostRecentSession.name}>{mostRecentSession.name}</h2>
                <p>Aberta {formatRelativeDate(mostRecentSession.last_opened_at)}</p>
                <Button
                  aria-label={`Retomar ${mostRecentSession.name}`}
                  icon={<Icon name="play" size={18} strokeWidth={2.4} decorative />}
                  isLoading={busyAction === `open:${mostRecentSession.id}`}
                  disabled={Boolean(busyAction && busyAction !== `open:${mostRecentSession.id}`)}
                  onClick={() => void handleOpen(mostRecentSession)}
                  size="md"
                  variant="primary"
                >
                  Retomar
                </Button>
              </>
            ) : (
              <>
                <span className="sessions-overview__label">Última sessão</span>
                <h2>Nenhuma sessão ainda</h2>
                <p>Suas sessões recentes aparecerão aqui.</p>
                <Button icon={<Icon name="add" size={18} strokeWidth={2.25} decorative />} onClick={() => setCreateOpen(true)}>
                  Criar sessão
                </Button>
              </>
            )}
          </div>

          <div className="sessions-overview__wave" aria-hidden="true">
            <SessionWave animated />
          </div>
        </section>

        <section className="sessions-library">
          <div className="sessions-toolbar">
            <div>
              <h2>Recentes</h2>
              <span>
                {filteredSessions.length}{" "}
                {filteredSessions.length === 1 ? "encontrada" : "encontradas"}
              </span>
            </div>
            <div className="sessions-toolbar__controls">
              <TextInput
                action={search ? (
                  <IconButton
                    aria-label="Limpar busca"
                    icon={<Icon name="close" size={16} decorative />}
                    onClick={() => setSearch("")}
                    variant="ghost"
                  />
                ) : undefined}
                aria-label="Buscar sessões"
                containerClassName="sessions-search"
                leadingIcon={<Icon name="search" size={18} />}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Buscar sessão..."
                type="search"
                value={search}
              />
              <div aria-label="Modo de visualização" className="sessions-view-switch" role="group">
                <Button
                  aria-controls="sessions-results"
                  aria-pressed={viewMode === "card"}
                  icon={<Icon name="grid" size={15} decorative />}
                  onClick={() => setViewMode("card")}
                  size="sm"
                  variant={viewMode === "card" ? "primary" : "secondary"}
                >
                  Cards
                </Button>
                <Button
                  aria-controls="sessions-results"
                  aria-pressed={viewMode === "list"}
                  icon={<Icon name="menu" size={15} decorative />}
                  onClick={() => setViewMode("list")}
                  size="sm"
                  variant={viewMode === "list" ? "primary" : "secondary"}
                >
                  Lista
                </Button>
              </div>
            </div>
          </div>

          {filteredSessions.length ? (
            <div
              aria-label={`Sessões em visualização de ${viewMode === "card" ? "cards" : "lista"}`}
              className={`sessions-grid sessions-grid--${viewMode}`}
              id="sessions-results"
            >
              {viewMode === "list" && (
                <div aria-hidden="true" className="sessions-list-header">
                  <span>Sessão</span>
                  <span>Última abertura</span>
                  <span>Ações</span>
                </div>
              )}
              {filteredSessions.map((session, index) => (
                <SessionCard
                  index={index}
                  isInspecting={busyAction === `details:${session.id}`}
                  isOpening={busyAction === `open:${session.id}`}
                  key={session.id}
                  layout={viewMode}
                  onInspect={handleInspect}
                  onOpen={handleOpen}
                  session={session}
                />
              ))}
            </div>
          ) : (
            <div className="sessions-empty">
              <h3>{search ? "Nenhuma sessão encontrada" : "Crie seu primeiro espaço"}</h3>
              <p>{search ? "Tente buscar por outro nome ou descrição." : "Comece uma sessão para organizar faixas, trechos e anotações."}</p>
              {!search && (
                <Tooltip content="Criar sua primeira sessão de estudo" placement="top">
                  <Button
                    icon={<Icon name="add" size={18} decorative />}
                    onClick={() => setCreateOpen(true)}
                  >
                    Criar primeira sessão
                  </Button>
                </Tooltip>
              )}
            </div>
          )}
        </section>
      </main>

      <SessionFormModal
        initialValues={{ name: "", description: "" }}
        isBusy={busyAction === "create"}
        isOpen={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <SessionDetailsModal
        isOpening={Boolean(details && busyAction === `open:${details.id}`)}
        onClose={() => setDetails(null)}
        onDelete={() => { setDeleteTarget(details); setDetails(null); }}
        onEdit={() => { setEditing(details); setDetails(null); }}
        onOpen={() => details && void handleOpen(details)}
        session={details}
      />
      <SessionFormModal
        initialValues={{ name: editing?.name ?? "", description: editing?.description ?? "" }}
        isBusy={busyAction === "edit"}
        isOpen={Boolean(editing)}
        mode="edit"
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
      <DeleteSessionModal
        isBusy={busyAction === "delete"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        session={deleteTarget}
      />
      <Toast
        closable={Boolean(error)}
        isOpen={Boolean(error || notice)}
        layout="compact"
        onClose={clearError}
        placement="top-center"
        title={error || notice}
        variant={error ? "danger" : "success"}
      />
    </div>
  );
}
