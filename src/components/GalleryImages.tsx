import { Component, For } from "solid-js";
import GalleryImage from "./GalleryImage";
import { File } from "../core/file_system";
import styles from "./Gallery.module.css";
import { combineRootPath } from "../core/helpers";

export type GalleryImagesProps = {
  rootPath: string
  fileContentsToShow: File[]
  imageWidth: string
  onImageClick: (imagePath: string) => void | undefined
  onImageLoad: () => void
}

const GalleryImages: Component<GalleryImagesProps> = (props) => {
  return (
    <div class={styles.images}>
      <For each={props.fileContentsToShow}>
        {(file) =>
          <GalleryImage
            imagePath={combineRootPath(props.rootPath, file.name)}
            width={props.imageWidth}
            onClick={props.onImageClick}
            onLoad={props.onImageLoad}
          />
        }
      </For>
    </div>
  );
}

export default GalleryImages;
