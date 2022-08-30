import { createEffect, createSignal, For } from "solid-js";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { Link, useNavigate, useParams } from "solid-app-router";
import { to_b64, from_b64 } from "./core/base64";
import { isSupportedExtension } from "./core/helpers";
import styles from "./App.module.css";
import { lsPath } from "./core/file_system";

function img_resource_uri(path: string) {
  return "reqimg://" + location.hostname + "/" + to_b64(path);
}

function Img(props: any) {
  let navigate = useNavigate();

  function onClick() {
    navigate("/single/" + to_b64(props.path));
  }

  return <img src={img_resource_uri(props.path)} alt="" style={"width:" + props.size + "%"} onclick={onClick} />;
}

export function SingleImage() {
  const { path } = useParams();

  return (
    <>
      <h1>Single</h1>
      <Link href="/">Back</Link>
      <Img path={from_b64(path)} size={100}></Img>
    </>
  );
}

function App() {
  let [dir, setDir] = createSignal("");
  let [files, setFiles] = createSignal<string[]>([]);
  let [dirs, setDirs] = createSignal<string[]>([]);
  let [rowCount, setRowCount] = createSignal<number>(3);
  let [imageSize, setImageSize] = createSignal<number>(32);

  async function handleDirPickClick() {
    let selected = await open({
      directory: true,
      multiple: false,
      defaultPath: await appDir(),
    });
    if (!Array.isArray(selected) && selected !== null) {
      setDir(selected);
    }
  }

  function handleRowCountChange(event: any) {
    setRowCount(event.target.value);
    setImageSize(100 / rowCount() - 2);
  }

  async function refreshGrid(root_dir: string) {
    let entries = await lsPath(root_dir);
    var new_files = [];
    var new_dirs = entries.directories;
    for (let entry of entries.files) {
      if (isSupportedExtension(entry.name)) {
        new_files.push(entry.name);
      }
    }
    setFiles(new_files);
    setDirs(new_dirs);
  }

  createEffect(async () => { if (dir()) { await refreshGrid(dir()) } });

  return (
    <>
      <div class={styles.header}>
        <h1>Photo Viewer</h1>
        <button onClick={() => handleDirPickClick()}>Pick Folder</button>
        <p>{dir}</p>
      </div>
      <div class={styles.gallery}>
        <h2>Directories</h2>
        <ul>
          <For each={dirs()}>
            {(path) => <li>{path}</li>}
          </For>
        </ul>
        <h2>Files</h2>
        <div class={styles.images}>
          <For each={files()}>
            {(path) => <Img path={dir() + "/" + path} size={imageSize()}></Img>}
          </For>
        </div>
      </div>
      <div class={styles.footer}>
        <label for="gallery-row-count">Per Row</label>
        <input type="range" min="2" max="12" step="1" id="gallery-row-count"
          value={rowCount()}
          onInput={handleRowCountChange}
          title={rowCount() + " Per Row"}
        />
      </div>
    </>
  );
}

export default App;
