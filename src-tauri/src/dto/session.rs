use fretlab_core::domain::Session;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateSessionRequest {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RenameSessionRequest {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct ChangeSessionDescriptionRequest {
    pub id: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SessionResponse {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub last_opened_at: String,
}

impl From<Session> for SessionResponse {
    fn from(session: Session) -> Self {
        Self {
            id: session.id().value().to_string(),
            name: session.name().to_owned(),
            description: session.description().map(str::to_owned),
            created_at: session.created_at().to_rfc3339(),
            updated_at: session.updated_at().to_rfc3339(),
            last_opened_at: session.last_opened_at().to_rfc3339(),
        }
    }
}
