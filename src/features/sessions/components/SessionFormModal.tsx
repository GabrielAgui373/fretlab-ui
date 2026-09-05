import { FormEvent, useState } from "react";
import { Button, Modal, TextInput } from "../../../components";
import type { TextInputChangeEvent } from "../../../components";
import type { SessionFormValues } from "../types";
import "./sessions.css";

type SessionFormModalProps = {
  initialValues: SessionFormValues;
  isBusy: boolean;
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => Promise<void>;
};

export function SessionFormModal({
  initialValues,
  isBusy,
  isOpen,
  mode,
  onClose,
  onSubmit,
}: SessionFormModalProps) {
  const [values, setValues] = useState(initialValues);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.name.trim() || isBusy) return;
    void onSubmit(values);
  }

  function handleNameChange(event: TextInputChangeEvent) {
    const name = event.currentTarget.value;
    setValues((current) => ({ ...current, name }));
  }

  function handleDescriptionChange(event: TextInputChangeEvent) {
    const description = event.currentTarget.value;
    setValues((current) => ({ ...current, description }));
  }

  const footer = (
    <>
      <Button onClick={onClose} variant="ghost">Cancelar</Button>
      <Button
        disabled={!values.name.trim()}
        isLoading={isBusy}
        onClick={() => void onSubmit(values)}
      >
        {mode === "create" ? "Criar sessão" : "Salvar alterações"}
      </Button>
    </>
  );

  return (
    <Modal
      footer={footer}
      isOpen={isOpen}
      onClose={onClose}
      subtitle={mode === "create" ? "Novo espaço" : "Editar sessão"}
      title={mode === "create" ? "O que vamos praticar?" : "Ajuste os detalhes"}
    >
      <p className="session-form__copy">
        {mode === "create"
          ? "Dê um nome claro. Você poderá organizar o conteúdo depois."
          : "Mantenha o contexto da sessão fácil de encontrar."}
      </p>
      <form className="session-form" onSubmit={handleSubmit}>
        <TextInput
          autoFocus
          label="Nome"
          maxLength={120}
          onChange={handleNameChange}
          placeholder="Ex.: Improviso em Dó menor"
          showCount
          value={values.name}
        />
        <TextInput
          label="Descrição (opcional)"
          maxLength={2000}
          multiline
          onChange={handleDescriptionChange}
          placeholder="Objetivos, repertório ou lembretes para esta sessão..."
          rows={4}
          showCount
          value={values.description}
        />
      </form>
    </Modal>
  );
}
