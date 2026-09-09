import { invoke } from "@tauri-apps/api/core";
import type { Session } from "./types";

export const sessionApi = {
  list: () => invoke<Session[]>("list_sessions"),
  get: (id: string) => invoke<Session>("get_session", { id }),
  create: (name: string, description: string | null) =>
    invoke<Session>("create_session", { input: { name, description } }),
  open: (id: string) => invoke<Session>("open_session", { id }),
  rename: (id: string, name: string) =>
    invoke<Session>("rename_session", { input: { id, name } }),
  changeDescription: (id: string, description: string | null) =>
    invoke<Session>("change_session_description", {
      input: { id, description },
    }),
  delete: (id: string) => invoke<void>("delete_session", { id }),
};
