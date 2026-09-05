import { useCallback, useState } from "react";
import { SessionWorkspacePage, SessionsPage } from "./pages";
import type { Session } from "./features/sessions";

function App() {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const openSession = useCallback((session: Session) => setActiveSession(session), []);
  const closeSession = useCallback(() => setActiveSession(null), []);

  return activeSession ? (
    <SessionWorkspacePage initialSession={activeSession} onBack={closeSession} />
  ) : (
    <SessionsPage onOpen={openSession} />
  );
}

export default App;
