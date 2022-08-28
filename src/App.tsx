import { createSignal, For } from "solid-js";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/api/fs';

import "./App.css";

function img_resource_uri(path: string) {
  return "reqimg://" + location.hostname + "/" + encodeURIComponent(path);
}

function Img(props: any) {
  return <img src={img_resource_uri(props.path)} alt="" />;
}

function App() {
  let [dir, setDir] = createSignal("");
  let [files, setFiles] = createSignal<string[]>([]);
  let [dirs, setDirs] = createSignal<string[]>([]);

  async function handleDirPickClick() {
    let selected = await open({
      directory: true,
      multiple: false,
      defaultPath: await appDir(),
    });
    if (!Array.isArray(selected) && selected !== null) {
      setDir(selected);
      await refreshGrid();
    }
  }

  async function refreshGrid() {
    let root_dir = dir();
    if (root_dir) {
      let entries = await readDir(root_dir, { recursive: false });
      var new_files = [];
      var new_dirs = [];
      for (let entry of entries) {
        if (entry.children === undefined) {
          if ((entry.path.toLowerCase()).endsWith(".jpg")) {
            new_files.push(entry.path);
          }
        } else {
          new_dirs.push(entry.path)
        }
      }
      setFiles(new_files);
      setDirs(new_dirs);
    }
  }

  return (
    <>
      <h1>Photo Viewer</h1>
      <button onClick={() => handleDirPickClick()}>Pick Folder</button>
      <p>{dir}</p>
      <h2>Directories</h2>
      <ul>
        <For each={dirs()}>
          {(path) => <li>{path}</li>}
        </For>
      </ul>
      <h2>Files</h2>
      <div class="images">
        <For each={files()}>
          {(path) => <Img path={path}></Img>}
        </For>
      </div>
    </>
  );
}

export default App;
