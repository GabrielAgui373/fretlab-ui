import { useState } from "react";
import { Button, Icon } from "../../components";
import { Feedback, SessionFormModal } from "../../features/sessions/components";
import { sessionApi } from "../../features/sessions";
import type { Session, SessionFormValues } from "../../features/sessions";
import { getErrorMessage } from "../../features/sessions/utils";
import "./SessionWorkspacePage.css";

export function SessionWorkspacePage({
  initialSession,
  onBack,
}: {
  initialSession: Session;
  onBack: () => void;
}) {
  const [session, setSession] = useState(initialSession);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleUpdate(values: SessionFormValues) {
    setIsSaving(true);
    setError(null);
    try {
      let updated = session;
      if (values.name.trim() !== session.name) {
        updated = await sessionApi.rename(session.id, values.name);
        setSession(updated);
      }
      const description = values.description.trim() || null;
      if (description !== updated.description) {
        updated = await sessionApi.changeDescription(session.id, description);
      }
      setSession(updated);
      setIsEditing(false);
      setNotice("Alterações salvas.");
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="workspace-page">
      <header className="workspace-header">
        <Button aria-label="Voltar para sessões" icon={<Icon name="back" />} onClick={onBack} variant="secondary" />
        <div className="workspace-header__title"><span className="eyebrow">Sessão ativa</span><strong>{session.name}</strong></div>
        <div className="workspace-header__actions">
          <span className="workspace-saved"><i /> Salvo</span>
          <Button icon={<Icon name="edit" size={17} />} onClick={() => setIsEditing(true)} variant="secondary">Editar</Button>
        </div>
      </header>
      <main className="workspace-body">
        <aside className="workspace-rail" aria-hidden="true"><span>01</span><i /><small>00:00</small></aside>
        <section className="workspace-placeholder">
          <div className="workspace-placeholder__art"><Icon name="equalizer" size={42} /></div>
          <span className="eyebrow">Área de trabalho</span>
          <h1>Sua sessão começa aqui.</h1>
          <p>A estrutura está pronta. Na próxima etapa, você poderá adicionar faixas, marcadores e regiões de estudo.</p>
          <div className="workspace-notes"><span>Notas da sessão</span><p>{session.description || "Nenhuma nota adicionada."}</p></div>
        </section>
      </main>

      <SessionFormModal
        initialValues={{ name: session.name, description: session.description ?? "" }}
        isBusy={isSaving}
        isOpen={isEditing}
        mode="edit"
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
      />
      <Feedback error={error} notice={notice} onDismiss={() => setError(null)} />
    </div>
  );
}
