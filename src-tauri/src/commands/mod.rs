pub(crate) mod session;

pub fn handler<R: tauri::Runtime>() -> impl Fn(tauri::ipc::Invoke<R>) -> bool + Send + Sync + 'static
{
    tauri::generate_handler![
        session::create_session,
        session::list_sessions,
        session::get_session,
        session::open_session,
        session::rename_session,
        session::change_session_description,
        session::delete_session,
    ]
}
