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
          <div><span className="eyebrow">Sua biblioteca</span><h1>Sessões</h1></div>
          <Tooltip content="Criar uma nova sessão de estudo" placement="left">
            <Button
              icon={<Icon name="add" size={18} decorative />}
              onClick={() => setCreateOpen(true)}
            >
              Nova sessão
            </Button>
          </Tooltip>
        </header>

        <section className="sessions-hero">
          <div>
            <span className="eyebrow">Continue de onde parou</span>
            <h2>Transforme repetição em progresso.</h2>
            <p>Organize cada estudo em um lugar e mantenha suas ideias por perto.</p>
          </div>
          <div className="sessions-hero__stats">
            <div className="sessions-hero__count"><strong>{sessions.length.toString().padStart(2, "0")}</strong><span>{sessions.length === 1 ? "sessão" : "sessões"}</span></div>
            <SessionWave animated />
          </div>
        </section>

        <section className="sessions-library">
          <div className="sessions-toolbar">
            <div><h2>Recentes</h2><span>{filteredSessions.length} encontradas</span></div>
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
          </div>

          {filteredSessions.length ? (
            <div className="sessions-grid">
              {filteredSessions.map((session, index) => (
                <SessionCard
                  index={index}
                  isBusy={busyAction?.endsWith(session.id) ?? false}
                  key={session.id}
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
