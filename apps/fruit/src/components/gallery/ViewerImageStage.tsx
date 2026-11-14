import { Button } from "@wilhalla/ui/components/button";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { imageFullSrc, type GalleryImageRecord } from "../../lib/imageGallerySession";
import { IMAGE_ZOOM, touchAction, type ImageScaleMode } from "../../lib/imageZoom";
import type { ImageZoom } from "./useImageZoom";

interface ViewerImageStageProps {
  image: GalleryImageRecord;
  scaleMode: ImageScaleMode;
  zoom: ImageZoom;
  previousId: string | undefined;
  nextId: string | undefined;
  onOpenImage: (imageId: string) => void;
}

/** How the photo's box is sized in each scale mode. */
const imageSize: Record<ImageScaleMode, string> = {
  fit: "h-auto max-h-full w-auto max-w-full",
  width: "h-auto w-full max-w-none",
  height: "h-full w-auto max-w-none",
  // Covers the stage keeping its proportions (--aspect is set once the photo's size is known).
  cover: "h-auto w-[max(100cqw,calc(100cqh*var(--aspect)))] max-w-none",
  original: "h-auto w-auto max-w-none",
};

/** The photo with its zoom, pan and magnifier, and the arrows to its neighbours. */
export default function ViewerImageStage({
  image,
  scaleMode,
  zoom,
  previousId,
  nextId,
  onOpenImage,
}: ViewerImageStageProps) {
  const { state, imageProps, attach, attachLens } = zoom;
  // The index does not hold the photos' sizes; "cover" needs the proportions.
  const [loaded, setLoaded] = useState<{ id: string; aspect: number }>();
  const aspect = loaded?.id === image.id ? loaded.aspect : undefined;
  const src = imageFullSrc(image);
  // "width" and "original" let a photo larger than the stage scroll, until it is zoomed.
  const scrolls =
    (scaleMode === "width" || scaleMode === "original") && state.zoom <= IMAGE_ZOOM.min;

  return (
    <div className="@container-size relative min-h-stage w-full min-w-0 overflow-hidden border-b border-chalk bg-powder/40 lg:min-h-0 lg:border-r lg:border-b-0">
      <div
        className={cn(
          "absolute inset-0",
          // One definite track, so `max-h-full` on the photo means the stage's height.
          scrolls
            ? "overflow-auto"
            : "grid grid-cols-1 grid-rows-1 place-items-center overflow-hidden",
          scaleMode !== "cover" && "p-4 lg:p-8",
        )}
      >
        <img
          ref={attach}
          {...imageProps}
          style={{
            "--zoom": state.zoom,
            "--pan-x": `${state.pan.x}px`,
            "--pan-y": `${state.pan.y}px`,
            "--aspect": aspect,
          }}
          className={cn(
            "block translate-x-(--pan-x) translate-y-(--pan-y) scale-(--zoom) object-contain transition-transform duration-enter ease-enter select-none data-gesture:transition-none data-lens:cursor-none data-pannable:cursor-grab data-pannable:active:cursor-grabbing",
            touchAction(scaleMode, state.zoom, state.lens) === "none"
              ? "touch-none"
              : "touch-pan-y",
            scaleMode === "cover" && aspect === undefined
              ? "size-full object-cover"
              : imageSize[scaleMode],
          )}
          src={src}
          alt={image.visualDescription || image.postTitle}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          onLoad={(event) =>
            setLoaded({
              id: image.id,
              aspect: event.currentTarget.naturalWidth / event.currentTarget.naturalHeight,
            })
          }
        />
      </div>
      {state.lens && (
        <div
          ref={attachLens}
          className="pointer-events-none absolute top-0 left-0 z-20 size-55 rounded-full border border-eggshell bg-(image:--lens-image) bg-no-repeat opacity-0 shadow-subtle-4 ring-1 ring-obsidian/20 will-change-transform"
          style={{ "--lens-image": `url("${src.replaceAll('"', '\\"')}")` }}
          aria-hidden="true"
        />
      )}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-3 lg:px-5">
        <Button
          variant="outline"
          size="icon-lg"
          className="pointer-events-auto"
          disabled={!previousId}
          onClick={() => previousId && onOpenImage(previousId)}
          aria-label="Vorige afbeelding"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          className="pointer-events-auto"
          disabled={!nextId}
          onClick={() => nextId && onOpenImage(nextId)}
          aria-label="Volgende afbeelding"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
