#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::error::Error;
use std::fs::read;
use std::path::PathBuf;
use tauri::{
    http::{Request, Response, ResponseBuilder},
    AppHandle,
};
use url::Url;

fn handle_register_uri_scheme_req_img(
    _app: &AppHandle,
    request: &Request,
) -> Result<Response, Box<dyn Error>> {
    // FIXME remove all unwrap usage
    let not_found_response = ResponseBuilder::new().status(404).body(vec![]);

    if request.method() != "GET" {
        return not_found_response;
    }

    // Converts reqimg://localhost/<base64> into a PathBuf
    let file_path = Url::parse(request.uri())?;
    let file_path = file_path
        .path_segments()
        .map(|c| c.collect::<Vec<_>>())
        .unwrap();
    if file_path.len() != 1 {
        return not_found_response;
    }
    let file_path = file_path[0];
    let file_path = String::from_utf8(base64::decode(file_path).unwrap()).unwrap();
    let file_path = PathBuf::from(file_path);
    if !file_path.is_file() {
        return not_found_response;
    }

    let content = read(file_path).unwrap();
    ResponseBuilder::new().status(200).body(content)
}

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("reqimg", handle_register_uri_scheme_req_img)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
