import { createEffect, createSignal, For } from "solid-js";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { readDir, readBinaryFile } from '@tauri-apps/api/fs';

import "./App.css";
import { Link, useNavigate, useParams } from "solid-app-router";

function Img(props: any) {
  let navigate = useNavigate();
  let [srcUrl, setSrcUrl] = createSignal("");

  createEffect(async () => {
    let contents = await readBinaryFile(props.path);
    let blob = new Blob([contents], { type: "image/jpeg" });
    setSrcUrl(URL.createObjectURL(blob));
  });

  function onClick() {
    let encoded = btoa(props.path)
    navigate("/single/" + encoded);
  }

  return <img src={srcUrl()} alt="" onclick={() => onClick()} />;
}

export function SingleImage() {
  const { path } = useParams();
  const [actualPath, setActualPath] = createSignal("");

  createEffect(() => {
    setActualPath(atob(path));
  })

  return (
    <>
      <h1>Single</h1>
      <Link href="/">Back</Link>
      <Img path={actualPath()}></Img>
    </>
  );
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
