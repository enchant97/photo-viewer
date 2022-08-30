import { Component, createEffect, createSignal } from "solid-js";
import { createResourceURI } from "../core/helpers";

const ObservedImage: Component<any> = (props) => {
  let imageRef: HTMLImageElement | undefined;
  let [isIntersecting, setIntersecting] = createSignal(false);
  let [srcUrl, setSrcUrl] = createSignal("");

  createEffect(() => {
    let observer = new IntersectionObserver(([entry]) => { setIntersecting(entry.isIntersecting) });
    if (imageRef) { observer.observe(imageRef) }
  });

  createEffect(() => {
    if (isIntersecting()) { setSrcUrl(props.src) }
    else { setSrcUrl("") }
  });

  return (
    <img
      ref={imageRef}
      src={srcUrl()}
      alt={props.alt} style={props.style}
      onclick={props.onclick}
    />
  );
}

export type GalleryImageProps = {
  imagePath: string
  width: string
  onClick: (imagePath: string) => void | undefined
}

const GalleryImage: Component<GalleryImageProps> = (props) => {
  const handleOnClick = () => { props.onClick?.(props.imagePath) }

  return (
    <ObservedImage
      src={createResourceURI(props.imagePath)}
      alt="" style={"width: " + props.width}
      onclick={handleOnClick}
    />);
}

export default GalleryImage;
