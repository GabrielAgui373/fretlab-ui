use fretlab_core::application::use_cases::session::{
    ChangeSessionDescription, ChangeSessionDescriptionInput, CreateSession, CreateSessionInput,
    DeleteSession, GetSession, ListSessions, OpenSession, RenameSession, RenameSessionInput,
};
use fretlab_core::domain::SessionId;
use fretlab_core::infrastructure::database::sqlite::repositories::SqliteSessionRepository;
use tauri::State;

use crate::dto::session::{
    ChangeSessionDescriptionRequest, CreateSessionRequest, RenameSessionRequest, SessionResponse,
};
use crate::state::AppState;

fn parse_session_id(id: &str) -> Result<SessionId, String> {
    SessionId::parse(id).map_err(|error| format!("invalid session id: {error}"))
}

#[tauri::command]
pub fn create_session(
    state: State<'_, AppState>,
    input: CreateSessionRequest,
) -> Result<SessionResponse, String> {
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = CreateSession::new(&repository);

    let session = use_case
        .execute(CreateSessionInput {
            name: input.name,
            description: input.description,
        })
        .map_err(|error| error.to_string())?;

    Ok(SessionResponse::from(session))
}

#[tauri::command]
pub fn list_sessions(state: State<'_, AppState>) -> Result<Vec<SessionResponse>, String> {
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = ListSessions::new(&repository);

    let sessions = use_case.execute().map_err(|error| error.to_string())?;

    Ok(sessions.into_iter().map(SessionResponse::from).collect())
}

#[tauri::command]
pub fn get_session(state: State<'_, AppState>, id: String) -> Result<SessionResponse, String> {
    let id = parse_session_id(&id)?;
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = GetSession::new(&repository);

    let session = use_case.execute(id).map_err(|error| error.to_string())?;

    Ok(SessionResponse::from(session))
}

#[tauri::command]
pub fn open_session(state: State<'_, AppState>, id: String) -> Result<SessionResponse, String> {
    let id = parse_session_id(&id)?;
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = OpenSession::new(&repository);

    let session = use_case.execute(id).map_err(|error| error.to_string())?;

    Ok(SessionResponse::from(session))
}

#[tauri::command]
pub fn rename_session(
    state: State<'_, AppState>,
    input: RenameSessionRequest,
) -> Result<SessionResponse, String> {
    let id = parse_session_id(&input.id)?;
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = RenameSession::new(&repository);

    let session = use_case
        .execute(RenameSessionInput {
            id,
            name: input.name,
        })
        .map_err(|error| error.to_string())?;

    Ok(SessionResponse::from(session))
}

#[tauri::command]
pub fn change_session_description(
    state: State<'_, AppState>,
    input: ChangeSessionDescriptionRequest,
) -> Result<SessionResponse, String> {
    let id = parse_session_id(&input.id)?;
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = ChangeSessionDescription::new(&repository);

    let session = use_case
        .execute(ChangeSessionDescriptionInput {
            id,
            description: input.description,
        })
        .map_err(|error| error.to_string())?;

    Ok(SessionResponse::from(session))
}

#[tauri::command]
pub fn delete_session(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let id = parse_session_id(&id)?;
    let connection = state
        .connection
        .lock()
        .map_err(|_| "database lock is unavailable".to_owned())?;

    let repository = SqliteSessionRepository::new(&connection);
    let use_case = DeleteSession::new(&repository);

    use_case.execute(id).map_err(|error| error.to_string())
}
