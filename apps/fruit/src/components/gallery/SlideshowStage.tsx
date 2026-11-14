import { cn } from "@wilhalla/ui/lib/utils";
import { imageAlt, imageFullSrc, type GalleryImageRecord } from "../../lib/imageGallerySession";

interface SlideshowStageProps {
  image: GalleryImageRecord;
  /** The slide before, which stays on screen until `image` has arrived and faded in over it. */
  previous: GalleryImageRecord | undefined;
  /** Whether `image` has arrived. */
  loaded: boolean;
  onLoaded: () => void;
  onFaded: () => void;
}

// Black behind the letterboxed photo: the base layer gives every image a paper placeholder.
const slide = "absolute inset-0 size-full bg-obsidian object-contain duration-move ease-move";

/** The slides, cross-fading: a slide only appears once its image is there. */
export default function SlideshowStage({
  image,
  previous,
  loaded,
  onLoaded,
  onFaded,
}: SlideshowStageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {previous && (
        <img
          key={previous.id}
          className={cn(slide, loaded && "animate-out fill-mode-forwards fade-out-0")}
          src={imageFullSrc(previous)}
          alt=""
          onAnimationEnd={onFaded}
        />
      )}
      <img
        key={image.id}
        className={cn(slide, loaded ? "animate-in fade-in-0" : "opacity-0")}
        src={imageFullSrc(image)}
        alt={imageAlt(image)}
        fetchPriority="high"
        decoding="async"
        onLoad={onLoaded}
        // A photo that cannot be loaded must not hold the slideshow up.
        onError={onLoaded}
      />
    </div>
  );
}
