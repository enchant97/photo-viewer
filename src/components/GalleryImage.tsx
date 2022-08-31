import { Component } from "solid-js";
import { createResourceURI } from "../core/helpers";

export type GalleryImageProps = {
  imagePath: string
  width: string
  onClick: (imagePath: string) => void | undefined
  onLoad: () => void | undefined
}

const GalleryImage: Component<GalleryImageProps> = (props) => {
  const handleOnClick = () => { props.onClick?.(props.imagePath) }

  return (
    <img
      src={createResourceURI(props.imagePath, false, 400)}
      alt="" style={"width: " + props.width}
      onclick={handleOnClick}
      onload={props.onLoad}
    />);
}

export default GalleryImage;
