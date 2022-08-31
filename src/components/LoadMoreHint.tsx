import { Component, createSignal, createEffect, onMount } from "solid-js";

export type LoadMoreHintProps = {
    onObserveChange: (isIntersecting: boolean) => void
}

/**
 * Placed at end of the content,
 * signals when shown (intersecting) to allow
 * for more content to be loaded dynamically
 */
const LoadMoreHint: Component<LoadMoreHintProps> = (props) => {
    let loadMoreElement: HTMLDivElement | undefined;
    let [isIntersecting, setIntersecting] = createSignal(false);

    onMount(() => {
        let observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        });
        if (loadMoreElement) { observer.observe(loadMoreElement) }
    });

    createEffect(() => {
        props.onObserveChange(isIntersecting());
    });

    return <div style="height: 20px;width:100%;" ref={loadMoreElement}></div>
}

export default LoadMoreHint;
