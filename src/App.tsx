import { useCallback, useState } from "react";
import { TitleBar } from "./components";
import { SessionWorkspacePage, SessionsPage } from "./pages";
import type { Session } from "./features/sessions";

function App() {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const openSession = useCallback((session: Session) => setActiveSession(session), []);
  const closeSession = useCallback(() => setActiveSession(null), []);

  return (
    <div className="app-shell">
      <TitleBar />
      <div className="app-shell__content">
        {activeSession ? (
          <SessionWorkspacePage initialSession={activeSession} onBack={closeSession} />
        ) : (
          <SessionsPage onOpen={openSession} />
        )}
      </div>
    </div>
  );
}

export default App;
