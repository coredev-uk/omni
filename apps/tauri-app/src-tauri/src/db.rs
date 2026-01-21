use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use std::fs;
use tauri::{AppHandle, Manager};

pub struct AppState {
    pub db: SqlitePool,
}

pub async fn init_db(app_handle: &AppHandle) -> Result<SqlitePool, String> {
    let app_data_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;
    }
    
    let db_path = app_data_dir.join("melos.db");
    let db_url = format!("sqlite://{}", db_path.to_string_lossy());

    // Create DB File if missing
    if !Sqlite::database_exists(&db_url).await.unwrap_or(false) {
        Sqlite::create_database(&db_url).await.map_err(|e| e.to_string())?;
    }

    // Connect
    let pool = SqlitePool::connect(&db_url).await.map_err(|e| e.to_string())?;

    // Run Schema (assuming file exists in packages/db-schema)
    // Note: In a real build, use include_str! macro with a relative path
    // tailored to where your Cargo.toml is.
    let schema = "
        CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT);
        CREATE TABLE IF NOT EXISTS unified_tracks (id TEXT PRIMARY KEY, title TEXT);
    ";
    
    sqlx::query(schema).execute(&pool).await.map_err(|e| e.to_string())?;

    Ok(pool)
}
