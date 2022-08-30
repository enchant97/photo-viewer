#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::Serialize;
use std::error::Error;
use std::fs::{read, read_dir};
use std::path::PathBuf;
use tauri::{
    http::{Request, Response, ResponseBuilder},
    AppHandle,
};
use url::Url;

#[derive(Debug, Serialize)]
struct File {
    /// filename including extension
    name: String,
}

#[derive(Debug, Serialize)]
struct Directory {
    /// directory names
    directories: Vec<String>,
    /// found files
    files: Vec<File>,
}

#[tauri::command]
fn ls_path(root_path: PathBuf) -> Directory {
    // FIXME remove all unwrap usage
    let mut directories: Vec<String> = vec![];
    let mut files: Vec<File> = vec![];

    for entry in read_dir(root_path).unwrap() {
        let path = entry.unwrap().path();
        let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
        if path.is_dir() {
            directories.push(file_name);
        } else {
            files.push(File { name: file_name });
        }
    }
    Directory { directories, files }
}

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
        .invoke_handler(tauri::generate_handler![ls_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
