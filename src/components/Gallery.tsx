import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { Directory, File as FsFile } from "../core/file_system";
import styles from "./Gallery.module.css";
import GalleryImages from "./GalleryImages";
import LoadMoreHint from "./LoadMoreHint";

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
  let [fileContentsToShow, setFileContentsToShow] = createSignal<FsFile[]>([]);
  let [leftToLoad, setLeftToLoad] = createSignal(0);
  let currentRootPath = props.rootPath;
  let currentFileIndex = 0;

  const handleLoadMoreContent = (isIntersecting: boolean) => {
    if (props.rootPath !== currentRootPath) {
      currentRootPath = props.rootPath;
      setFileContentsToShow([])
      currentFileIndex = 0
      return;
    }
    // only allow new images when all others have finished loading
    if (!isIntersecting || leftToLoad() !== 0) return;
    // the max number of files or default to 0 if none exist
    let maxLength = props.contents?.files.length || 0;
    // detect that allow images have been loaded
    if (currentFileIndex == maxLength) return;
    // get amount of images to load, ensuring that
    // we stay within the number of files left
    let endIndex = currentFileIndex + props.columnsPerRow;
    if (endIndex > maxLength) { endIndex = maxLength }
    // get the new files to add
    let newElements = props.contents?.files.slice(currentFileIndex, endIndex);
    if (newElements) {
      // set number of images left to load (for checking when we are done)
      setLeftToLoad(newElements.length);
      // update the actual array of files (including the existing ones)
      let updatedElements = [];
      updatedElements.push(...fileContentsToShow())
      updatedElements.push(...newElements)
      setFileContentsToShow(updatedElements);
    }
    // update the current index so we know where we are for next time
    currentFileIndex = endIndex;
  }

  const imageLoaded = () => {
    // once an image is loaded we can mark it as done
    // Math.max() ensures we never get negative
    // (only happens during a live update during development)
    setLeftToLoad(Math.max(0, leftToLoad() - 1));
  }

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
      <GalleryImages
        fileContentsToShow={fileContentsToShow()}
        imageWidth={imageWidth()}
        rootPath={props.rootPath}
        onImageClick={props.onImageClick}
        onImageLoad={imageLoaded}
      />
      {/* we don't need to observe while loading */}
      <Show when={leftToLoad() === 0}>
        <LoadMoreHint onObserveChange={handleLoadMoreContent} />
      </Show>
    </div>
  );
}

export default Gallery;
