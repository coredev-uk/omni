mod db;
use tauri::Manager;

// 1. Define Commands (Placeholder)
#[tauri::command]
async fn save_token(state: tauri::State<'_, db::AppState>, key: String, value: String) -> Result<(), String> {
    sqlx::query("INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)")
        .bind(key)
        .bind(value)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();
            
            tauri::async_runtime::block_on(async move {
                let pool = db::init_db(&handle).await.expect("Failed to init DB");
                
                // Manage the state so commands can access it
                handle.manage(db::AppState { db: pool });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_token
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
