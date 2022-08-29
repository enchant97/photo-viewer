#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::read;
use std::path::PathBuf;
use tauri::{
    http::{Request, ResponseBuilder},
    AppHandle,
};

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("reqimg", move |app: &AppHandle, request: &Request| {
            // FIXME remove all unwrap usage
            let not_found_response = ResponseBuilder::new().status(404).body(vec![]);

            let file_path = request.uri();
            let file_path = file_path.strip_prefix("reqimg://localhost/").unwrap();


            let file_path = String::from_utf8(base64::decode(file_path).unwrap()).unwrap();
            let file_path = PathBuf::from(file_path);

            if request.method() != "GET" || !file_path.is_file() {
                return not_found_response;
            }

            let content = read(file_path).unwrap();
            ResponseBuilder::new().status(200).body(content)
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
