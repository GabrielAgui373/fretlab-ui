mod commands;
mod dto;
mod state;

use std::sync::Mutex;

use fretlab_core::infrastructure::database::open;
use state::AppState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let data_dir = app.path().app_data_dir()?;

            std::fs::create_dir_all(&data_dir)?;

            let database_path = data_dir.join("fretlab.db");
            let connection = open(database_path)?;

            app.manage(AppState {
                connection: Mutex::new(connection),
            });

            Ok(())
        })
        .invoke_handler(commands::handler())
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
