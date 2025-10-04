mod commands;

use commands::device::get_device_info;
use serde_json::json;
use tauri_plugin_store::StoreExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Just initialize the store, don't do heavy operations here
            let _store = app.store("store.json")?;
            println!("Store initialized successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_device_info, init_store])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Move store operations to a separate command
#[tauri::command]
async fn init_store(app: tauri::AppHandle) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;

    store.set("some-key", json!({ "value": 5 }));

    match store.get("some-key") {
        Some(value) => {
            println!("Retrieved value: {}", value);
            Ok(())
        }
        None => Err("Failed to get value from store".to_string()),
    }
}
