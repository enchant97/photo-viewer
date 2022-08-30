import { invoke } from '@tauri-apps/api/tauri';

export type File = {
  name: string
}

export type Directory = {
  directories: string[]
  files: File[]
}

export async function lsPath(rootPath: string): Promise<Directory> {
  return await invoke("ls_path", { rootPath });
}
