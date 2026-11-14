import { Button } from "@wilhalla/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@wilhalla/ui/components/dialog";
import { cn } from "@wilhalla/ui/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pin,
  PinOff,
  X,
} from "lucide-react";
import { useReducer, useState, type KeyboardEvent } from "react";
import { preload } from "react-dom";
import { toggleFullscreen, useFullscreen } from "../../hooks/useFullscreen";
import { useIdle } from "../../hooks/useIdle";
import { useLoadable } from "../../hooks/useLoadable";
import { useTimeout } from "../../hooks/useTimeout";
import { speciesByImageStore } from "../../lib/galleryData";
import { galleryRoutes, galleryUrlCodec, type GalleryFilters } from "../../lib/galleryFilters";
import {
  initialSlideTransition,
  initialSlideshowSettings,
  slideAt,
  slideTransitionReducer,
  slideshowOrder,
  slideshowReducer,
} from "../../lib/gallerySlideshow";
import { KEY_CONSUMERS, viewerKeyAction } from "../../lib/galleryViewer";
import {
  filterGalleryImages,
  formatImagePostDateTime,
  imageFullSrc,
  type GalleryImageRecord,
  type SpeciesByImage,
  imageCaption,
} from "../../lib/imageGallerySession";
import { writeUrlState } from "../../lib/urlState";
import SlideshowControls from "./SlideshowControls";
import SlideshowStage from "./SlideshowStage";

interface GallerySlideshowProps {
  /** The slide shown now: the photo in the URL. */
  image: GalleryImageRecord;
  /** Every photo known now; the slideshow plays those that pass the filters. */
  images: readonly GalleryImageRecord[];
  filters: GalleryFilters;
}

const CONTROLS_HIDE_AFTER_MS = 5000;
const noSpecies: SpeciesByImage = new Map();

/** The current selection of photos, full screen, one after another. */
export default function GallerySlideshow({ image, images, filters }: GallerySlideshowProps) {
  const [settings, dispatch] = useReducer(slideshowReducer, initialSlideshowSettings);
  const [transition, dispatchTransition] = useReducer(
    slideTransitionReducer,
    initialSlideTransition,
  );
  const [pinned, setPinned] = useState(false);
  const idle = useIdle(CONTROLS_HIDE_AFTER_MS);
  const fullscreen = useFullscreen();
  const species = useLoadable(speciesByImageStore);

  const order = slideshowOrder(
    filterGalleryImages(images, filters, species.status === "ready" ? species.value : noSpecies),
    settings,
  );
  const position = order.findIndex((slide) => slide.id === image.id);
  const canStep = order.length > 1;
  const loaded = transition.loadedId === image.id;
  const controlsVisible = pinned || !idle;

  for (const step of [1, 2, 3, -1]) {
    const upcoming = slideAt(order, image.id, step);
    if (upcoming) preload(imageFullSrc(upcoming), { as: "image" });
  }

  const step = (by: 1 | -1) => {
    const target = slideAt(order, image.id, by);
    if (!target || target.id === image.id) return;
    dispatchTransition({ type: "leave", id: image.id });
    writeUrlState(galleryUrlCodec, { ...filters, imageId: target.id });
  };

  const close = () => {
    if (document.fullscreenElement) toggleFullscreen(document.documentElement);
    writeUrlState(
      galleryUrlCodec,
      { ...filters, imageId: image.id },
      "replace",
      galleryRoutes.viewer,
    );
  };

  // The next slide is due a full interval after this one has arrived, however long it took.
  useTimeout(() => step(1), loaded && canStep && !settings.paused ? settings.seconds * 1000 : null);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const action = viewerKeyAction({
      key: event.key,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      defaultPrevented: event.defaultPrevented,
      consumed: event.target instanceof Element && event.target.closest(KEY_CONSUMERS) !== null,
    });
    if (action === "previous") step(-1);
    else if (action === "next") step(1);
  };

  const bar =
    "absolute inset-x-0 z-20 border-eggshell/15 bg-obsidian/90 px-4 backdrop-blur md:px-6";
  // The controls fade in quickly on a touch or a move, and away a little faster when left alone.
  const fade = cn(
    "transition-opacity",
    controlsVisible
      ? "duration-enter ease-enter"
      : "pointer-events-none opacity-0 duration-exit ease-exit",
  );

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent showCloseButton={false} onKeyDown={onKeyDown} variant="screen">
        <DialogDescription className="sr-only">
          Diashow van de foto's in de huidige selectie.
        </DialogDescription>
        <header
          inert={!controlsVisible}
          className={cn(
            bar,
            "top-0 flex min-h-16 items-center justify-between gap-3 border-b",
            fade,
          )}
        >
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <DialogTitle className="min-w-0">
                <span className="block truncate font-sans text-body font-medium">
                  {imageCaption(image) || image.postTitle}
                </span>
              </DialogTitle>
              <Button asChild variant="inverse" size="icon-sm">
                <a
                  href={`/posts/${image.postSlug}/`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open artikel in nieuw tabblad"
                  title="Open artikel in nieuw tabblad"
                >
                  <ExternalLink />
                </a>
              </Button>
            </div>
            <p className="m-0 font-sans text-caption leading-caption text-eggshell/70 tabular-nums">
              {formatImagePostDateTime(image)}
              {position >= 0 && ` · ${position + 1}/${order.length}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="inverse"
              size="icon-lg"
              onClick={() => setPinned(!pinned)}
              aria-pressed={pinned}
              aria-label={pinned ? "Bediening automatisch verbergen" : "Bediening zichtbaar houden"}
              title={pinned ? "Bediening automatisch verbergen" : "Bediening zichtbaar houden"}
            >
              {pinned ? <PinOff /> : <Pin />}
            </Button>
            <Button
              variant="inverse"
              size="icon-lg"
              onClick={() => toggleFullscreen(document.documentElement)}
              aria-label={fullscreen ? "Verlaat volledig scherm" : "Volledig scherm"}
              title={fullscreen ? "Verlaat volledig scherm" : "Volledig scherm"}
            >
              {fullscreen ? <Minimize2 /> : <Maximize2 />}
            </Button>
            <Button variant="inverse" size="icon-lg" onClick={close} aria-label="Sluit diashow">
              <X />
            </Button>
          </div>
        </header>

        <SlideshowStage
          image={image}
          previous={images.find((slide) => slide.id === transition.previousId)}
          loaded={loaded}
          onLoaded={() => dispatchTransition({ type: "loaded", id: image.id })}
          onFaded={() => dispatchTransition({ type: "faded" })}
        />
        <div
          inert={!controlsVisible}
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4",
            fade,
          )}
        >
          <Button
            variant="inverse"
            size="icon-lg"
            className="pointer-events-auto"
            onClick={() => step(-1)}
            disabled={!canStep}
            aria-label="Vorige dia"
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="inverse"
            size="icon-lg"
            className="pointer-events-auto"
            onClick={() => step(1)}
            disabled={!canStep}
            aria-label="Volgende dia"
          >
            <ArrowRight />
          </Button>
        </div>

        <footer
          inert={!controlsVisible}
          className={cn(
            bar,
            "bottom-0 flex flex-wrap items-center justify-center gap-2 border-t py-3 pb-safe",
            fade,
          )}
        >
          <SlideshowControls settings={settings} canPlay={canStep} dispatch={dispatch} />
        </footer>
      </DialogContent>
    </Dialog>
  );
}
