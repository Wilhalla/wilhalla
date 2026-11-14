import { Button } from "@wilhalla/ui/components/button";
import { ArrowLeft } from "lucide-react";
import type { KeyboardEvent } from "react";
import { toggleFullscreen, useFullscreen } from "../../hooks/useFullscreen";
import { useLoadable } from "../../hooks/useLoadable";
import { useStoredPreference } from "../../hooks/useStoredPreference";
import { relatedImagesStore, speciesByImageStore } from "../../lib/galleryData";
import {
  galleryHref,
  galleryRoutes,
  galleryUrlCodec,
  type GalleryFilters,
} from "../../lib/galleryFilters";
import { KEY_CONSUMERS, galleryExit, viewerKeyAction } from "../../lib/galleryViewer";
import {
  filterGalleryImages,
  locateGalleryImage,
  relatedGalleryImages,
  type GalleryImageRecord,
  type SpeciesByImage,
} from "../../lib/imageGallerySession";
import { isImageScaleMode } from "../../lib/imageZoom";
import { writeUrlState } from "../../lib/urlState";
import { useImageZoom } from "./useImageZoom";
import ViewerImageStage from "./ViewerImageStage";
import ViewerSidebar from "./ViewerSidebar";
import ViewerToolbar from "./ViewerToolbar";

interface ViewerImagePageProps {
  image: GalleryImageRecord;
  /** Every photo known now; the selection the viewer steps through is filtered from it. */
  images: readonly GalleryImageRecord[];
  filters: GalleryFilters;
}

const SCALE_MODE_STORAGE_KEY = "fruit-gallery-viewer-scale-mode";
const noSpecies: SpeciesByImage = new Map();

function focusWithoutScrolling(element: HTMLElement | null) {
  element?.focus({ preventScroll: true });
}

export default function ViewerImagePage({ image, images, filters }: ViewerImagePageProps) {
  const species = useLoadable(speciesByImageStore);
  const related = useLoadable(relatedImagesStore);
  const fullscreen = useFullscreen();
  const [scaleMode, setScaleMode] = useStoredPreference(
    SCALE_MODE_STORAGE_KEY,
    "fit",
    isImageScaleMode,
  );
  const zoom = useImageZoom(`${image.id}:${scaleMode}`, scaleMode);
  const selection = filterGalleryImages(
    images,
    filters,
    species.status === "ready" ? species.value : noSpecies,
  );
  const { index, previous, next } = locateGalleryImage(selection, image.id);

  const open = (imageId: string) => writeUrlState(galleryUrlCodec, { ...filters, imageId });

  const exit = () => {
    if (galleryExit(document.referrer, window.location.origin) === "back") window.history.back();
    else window.location.assign(galleryHref("grid", { ...filters, imageId: null }));
  };

  const startSlideshow = () => {
    // Replaces the viewer's history entry, as stepping through photos does: "back" always
    // leaves the viewer, whatever it showed last.
    writeUrlState(
      galleryUrlCodec,
      { ...filters, imageId: image.id },
      "replace",
      galleryRoutes.slideshow,
    );
    if (!document.fullscreenElement) toggleFullscreen(document.documentElement);
  };

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
    if (action === "exit") exit();
    else if (action === "previous" && previous) open(previous.id);
    else if (action === "next" && next) open(next.id);
  };

  return (
    // Focused on arrival so the arrow keys and Escape work without a click first.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- keyboard shortcuts for the controls inside, which all have buttons too
    <main
      ref={focusWithoutScrolling}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="min-h-below-navbar w-full overflow-x-clip bg-eggshell text-obsidian outline-none lg:flex lg:h-below-navbar lg:flex-col lg:overflow-hidden"
    >
      <header className="sticky top-navbar z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-chalk bg-eggshell px-3 md:px-5 lg:static">
        <Button variant="ghost" size="sm" onClick={exit}>
          <ArrowLeft /> Beeldarchief
        </Button>
        <ViewerToolbar
          image={image}
          zoom={zoom}
          scaleMode={scaleMode}
          fullscreen={fullscreen}
          canStartSlideshow={selection.length > 0}
          onScaleModeChange={setScaleMode}
          onStartSlideshow={startSlideshow}
        />
      </header>

      <div className="w-full min-w-0 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-aside lg:overflow-hidden">
        <ViewerImageStage
          image={image}
          scaleMode={scaleMode}
          zoom={zoom}
          previousId={previous?.id}
          nextId={next?.id}
          onOpenImage={open}
        />
        <ViewerSidebar
          image={image}
          selection={selection}
          index={index}
          related={
            related.status === "ready" ? relatedGalleryImages(image, images, related.value) : []
          }
          relatedLoading={related.status === "loading"}
          onSelectImage={open}
        />
      </div>
    </main>
  );
}
