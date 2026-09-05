import { useCallback, useEffect, useState } from "react";
import { sessionApi } from "./api";
import type { Session, SessionFormValues } from "./types";
import { getErrorMessage } from "./utils";

const MIN_ACTION_DURATION = import.meta.env.DEV ? 1500 : 0;

function upsert(items: Session[], updated: Session) {
  return [updated, ...items.filter((item) => item.id !== updated.id)];
}

export function useSessionLibrary() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    sessionApi
      .list()
      .then((result) => !cancelled && setSessions(result))
      .catch((reason) => !cancelled && setError(getErrorMessage(reason)))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const run = useCallback(async <T,>(key: string, operation: () => Promise<T>) => {
    const startedAt = performance.now();
    setBusyAction(key);
    setError(null);
    try {
      return await operation();
    } catch (reason) {
      setError(getErrorMessage(reason));
      return null;
    } finally {
      const remainingTime = MIN_ACTION_DURATION - (performance.now() - startedAt);
      if (remainingTime > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingTime));
      }
      setBusyAction(null);
    }
  }, []);

  const getSession = useCallback(
    async (id: string) => {
      const result = await run(`details:${id}`, () => sessionApi.get(id));
      if (result) setSessions((current) => upsert(current, result));
      return result;
    },
    [run],
  );

  const openSession = useCallback(
    async (id: string) => {
      const result = await run(`open:${id}`, () => sessionApi.open(id));
      if (result) setSessions((current) => upsert(current, result));
      return result;
    },
    [run],
  );

  const createSession = useCallback(
    async (values: SessionFormValues) => {
      const result = await run("create", () =>
        sessionApi.create(values.name, values.description.trim() || null),
      );
      if (result) {
        setSessions((current) => upsert(current, result));
        setNotice("Sessão criada e pronta para começar.");
      }
      return result;
    },
    [run],
  );

  const updateSession = useCallback(
    async (session: Session, values: SessionFormValues) => {
      const result = await run("edit", async () => {
        let updated = session;
        if (values.name.trim() !== session.name) {
          updated = await sessionApi.rename(session.id, values.name);
          setSessions((current) => upsert(current, updated));
        }

        const description = values.description.trim() || null;
        if (description !== updated.description) {
          updated = await sessionApi.changeDescription(session.id, description);
        }
        return updated;
      });

      if (result) {
        setSessions((current) => upsert(current, result));
        setNotice("Alterações salvas.");
      }
      return result;
    },
    [run],
  );

  const deleteSession = useCallback(
    async (session: Session) => {
      const result = await run("delete", async () => {
        await sessionApi.delete(session.id);
        return true;
      });
      if (result) {
        setSessions((current) => current.filter((item) => item.id !== session.id));
        setNotice("Sessão excluída.");
      }
      return Boolean(result);
    },
    [run],
  );

  return {
    busyAction,
    clearError: () => setError(null),
    createSession,
    deleteSession,
    error,
    getSession,
    isLoading,
    notice,
    openSession,
    sessions,
    updateSession,
  };
}
