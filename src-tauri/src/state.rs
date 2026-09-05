use std::sync::Mutex;

use rusqlite::Connection;

pub struct AppState {
    pub connection: Mutex<Connection>,
}
