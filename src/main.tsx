import React from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { getCurrentWindow } from "@tauri-apps/api/window";
import App from "./App";
import "./theme/index.css";

const TAURI_UI_SCALE = 1.1;
const isTauri = "__TAURI_INTERNALS__" in window || "__TAURI__" in window;

async function prepareDesktopWindow() {
  if (!isTauri) return;

  try {
    await getCurrentWebview().setZoom(TAURI_UI_SCALE);
  } catch (error) {
    if (import.meta.env.DEV) console.error("Nao foi possivel ajustar a escala:", error);
  }
}

function revealDesktopWindow() {
  if (!isTauri) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      void getCurrentWindow().show().catch((error) => {
        if (import.meta.env.DEV) console.error("Nao foi possivel exibir a janela:", error);
      });
    });
  });
}

async function bootstrap() {
  await prepareDesktopWindow();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  revealDesktopWindow();
}

void bootstrap();
