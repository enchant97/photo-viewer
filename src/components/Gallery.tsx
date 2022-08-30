import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { Directory } from "../core/file_system";
import GalleryImage from "./GalleryImage";
import styles from "./Gallery.module.css";
import { isSupportedExtension } from "../core/helpers";

export type GalleryProps = {
  rootPath: string
  columnsPerRow: number
  contents: Directory | undefined
  onImageClick: (imagePath: string) => void | undefined
}

function calculateImageWidth(columns: number): string {
  return (100 / columns - 2).toString() + "%"
}

const Gallery: Component<GalleryProps> = (props) => {
  let [imageWidth, setImageWidth] = createSignal("");

  createEffect(() => setImageWidth(calculateImageWidth(props.columnsPerRow)))

  return (
    <div class={styles.gallery}>
      <h2>Directories</h2>
      <ul>
        <For each={props.contents?.directories}>
          {(path) => <li>{path}</li>}
        </For>
      </ul>
      <h2>Files</h2>
      <div class={styles.images}>
        <For each={props.contents?.files}>
          {(file) =>
            <Show when={isSupportedExtension(file.name)}>
              <GalleryImage
                imagePath={props.rootPath + "/" + file.name}
                width={imageWidth()}
                onClick={props.onImageClick} />
            </Show>
          }
        </For>
      </div>
    </div>
  );
}

export default Gallery;
