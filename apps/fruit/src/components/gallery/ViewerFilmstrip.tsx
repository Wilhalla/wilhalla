import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import type { GalleryImageRecord } from "../../lib/imageGallerySession";
import ViewerImageButton from "./ViewerImageButton";

interface ViewerFilmstripProps {
  images: readonly GalleryImageRecord[];
  /** Position of the photo shown now; -1 when it is not among `images`. */
  activeIndex: number;
  onSelectImage: (imageId: string) => void;
}

/** Width of one photo in the strip, gap included (`w-24` plus `mr-2`). */
const ITEM_SIZE = 104;

/** The current selection as a horizontal strip that keeps the photo shown now in the middle. */
export default function ViewerFilmstrip({
  images,
  activeIndex,
  onSelectImage,
}: ViewerFilmstripProps) {
  // The virtualizer is one stable object whose methods read state that changes on scroll, which
  // memoization would freeze (React Compiler reports TanStack Virtual as incompatible).
  "use no memo";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => ITEM_SIZE,
    horizontal: true,
    overscan: 12,
    initialOffset: Math.max(0, activeIndex) * ITEM_SIZE,
    getItemKey: (index) => images[index]?.id ?? index,
  });
  // Runs when the strip mounts and when another photo becomes the current one, not on every
  // render: scrolling the strip by hand must not snap it back.
  const centreOnActive = useCallback(
    (scroller: HTMLDivElement | null) => {
      scrollerRef.current = scroller;
      if (scroller && activeIndex >= 0) virtualizer.scrollToIndex(activeIndex, { align: "center" });
    },
    [activeIndex, virtualizer],
  );

  return (
    <div
      ref={centreOnActive}
      className="h-20 overflow-x-auto overflow-y-hidden [scrollbar-width:thin]"
      aria-label="Foto's in de huidige selectie"
    >
      <div
        className="relative h-full w-(--strip-width)"
        style={{ "--strip-width": `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const image = images[item.index];
          return (
            image && (
              <ViewerImageButton
                key={item.key}
                className="absolute top-0 left-0 h-full w-24 translate-x-(--item-start)"
                style={{ "--item-start": `${item.start}px` }}
                image={image}
                current={item.index === activeIndex}
                onSelect={onSelectImage}
              />
            )
          );
        })}
      </div>
    </div>
  );
}
