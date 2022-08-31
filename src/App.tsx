import { createEffect, createSignal, Show } from "solid-js";
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { Link, useNavigate, useParams } from "solid-app-router";
import { to_b64 } from "./core/base64";
import styles from "./App.module.css";
import { Directory, lsPath } from "./core/file_system";
import Gallery from "./components/Gallery";
import { createResourceURI } from "./core/helpers";

export function SingleImage() {
  const { path } = useParams();

  return (
    <>
      <h1>Single</h1>
      <Link href="/">Back</Link>
      <img src={createResourceURI(path, true)} alt="" />
    </>
  );
}

function App() {
  let navigate = useNavigate();
  let [rootPath, setRootPath] = createSignal("");
  let [columnCount, setColumnCount] = createSignal<number>(3);
  let [dirContents, setDirContents] = createSignal<Directory>();

  const refreshGrid = async (rootPath: string) => {
    setDirContents(await lsPath(rootPath));
  }

  const handleDirPickClick = async () => {
    let selected = await open({
      directory: true,
      multiple: false,
      defaultPath: await appDir(),
    });
    if (!Array.isArray(selected) && selected !== null) {
      setRootPath(selected);
    }
  }

  const handleColumnCountChange = (event: any) => {
    setColumnCount(event.target.value);
  }

  const handleImageClick = (imagePath: string) => {
    navigate("/single/" + to_b64(imagePath));
  }

  createEffect(async () => {
    let newRootPath = rootPath();
    if (newRootPath) { await refreshGrid(newRootPath) }
  })

  return (
    <>
      <div class={styles.header}>
        <h1>Photo Viewer</h1>
        <button onClick={() => handleDirPickClick()}>Pick Folder</button>
        <p>{rootPath}</p>
      </div>
      <div class={styles.main}>
        <Show when={rootPath() !== ""}>
          <Gallery
            rootPath={rootPath()}
            columnsPerRow={columnCount()}
            contents={dirContents()}
            onImageClick={handleImageClick}
          />
        </Show>
      </div>
      <div class={styles.footer}>
        <label for="gallery-row-count">Per Row</label>
        <input type="range" min="2" max="12" step="1" id="gallery-row-count"
          value={columnCount()}
          onInput={handleColumnCountChange}
          title={columnCount() + " Per Row"}
        />
      </div>
    </>
  );
}

export default App;
