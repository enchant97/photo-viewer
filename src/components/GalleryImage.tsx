import { Component } from "solid-js";
import { createResourceURI } from "../core/helpers";

export type GalleryImageProps = {
  imagePath: string
  width: string
  onClick: (imagePath: string) => void | undefined
}

const GalleryImage: Component<GalleryImageProps> = (props) => {
  const handleOnClick = () => { props.onClick?.(props.imagePath) }

  return (
    <img
      src={createResourceURI(props.imagePath)}
      alt="" style={"width: " + props.width}
      onclick={handleOnClick}
    />
  );
}

export default GalleryImage;
