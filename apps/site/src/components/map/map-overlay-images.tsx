import { cn } from "@wilhalla/ui/lib/utils";
import { introStepByImage, mapOverlayImages } from "./map-sentinels";

interface MapOverlayImagesProps {
  /** Sources of the images to light up. */
  active: readonly string[];
  /** Hand-lettered captions are left out where an explanation card shows the same name. */
  showCaptions: boolean;
  /** Plays the intro on wide screens: each place lights up in turn. */
  introducing: boolean;
}

/** Every painted overlay and caption, stacked over the map and faded in when its place is active. */
export function MapOverlayImages({ active, showCaptions, introducing }: MapOverlayImagesProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {mapOverlayImages.map(({ src, caption }) => {
        const introStep = introStepByImage.get(src);

        return (
          <img
            key={src}
            src={src}
            alt=""
            style={{ "--map-intro-step": introStep }}
            className={cn(
              "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-glow ease-out",
              active.includes(src) && (showCaptions || !caption) && "opacity-100",
              introducing && introStep !== undefined && "lg:animate-map-intro",
            )}
            decoding="async"
            fetchPriority="low"
          />
        );
      })}
    </div>
  );
}
