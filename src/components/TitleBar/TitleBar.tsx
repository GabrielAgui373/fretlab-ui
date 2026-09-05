import { getCurrentWindow } from "@tauri-apps/api/window";
import "./TitleBar.css";

async function runWindowAction(action: () => Promise<void>) {
  try {
    await action();
  } catch (error) {
    if (import.meta.env.DEV) console.error("Não foi possível controlar a janela:", error);
  }
}

export function TitleBar() {
  return (
    <header className="app-titlebar" data-tauri-drag-region>
      <div className="app-titlebar__brand" data-tauri-drag-region>
        <span className="app-titlebar__mark" data-tauri-drag-region>
          <svg aria-hidden="true" viewBox="0 0 22 12">
            <path d="M1 6c2.1 0 2.1-4 4.2-4s2.1 8 4.2 8 2.1-8 4.2-8 2.1 4 4.2 4 2.1-2 3.2-2" />
          </svg>
        </span>
        <strong data-tauri-drag-region>fretlab</strong>
        <span className="app-titlebar__edition" data-tauri-drag-region>studio</span>
      </div>

      <div
        aria-hidden="true"
        className="app-titlebar__drag-area"
        data-tauri-drag-region
        onDoubleClick={() => void runWindowAction(() => getCurrentWindow().toggleMaximize())}
      />

      <nav aria-label="Controles da janela" className="app-titlebar__controls">
        <button
          aria-label="Minimizar"
          className="app-titlebar__control"
          onClick={() => void runWindowAction(() => getCurrentWindow().minimize())}
          title="Minimizar"
          type="button"
        >
          <span className="app-titlebar__minimize" />
        </button>
        <button
          aria-label="Maximizar ou restaurar"
          className="app-titlebar__control"
          onClick={() => void runWindowAction(() => getCurrentWindow().toggleMaximize())}
          title="Maximizar ou restaurar"
          type="button"
        >
          <span className="app-titlebar__maximize" />
        </button>
        <button
          aria-label="Fechar"
          className="app-titlebar__control app-titlebar__control--close"
          onClick={() => void runWindowAction(() => getCurrentWindow().close())}
          title="Fechar"
          type="button"
        >
          <span className="app-titlebar__close" />
        </button>
      </nav>
    </header>
  );
}
