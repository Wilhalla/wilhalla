import { useCallback } from "react";
import { useGalleryIndex } from "../../hooks/useGalleryIndex";
import { useHydrated } from "../../hooks/useHydrated";
import { galleryRoutes, galleryUrlCodec } from "../../lib/galleryFilters";
import { requestGalleryIndex } from "../../lib/galleryIndex";
import { startGalleryViewer, viewerView } from "../../lib/galleryViewer";
import type { GalleryImageRecord } from "../../lib/imageGallerySession";
import { useUrlPathname, useUrlState } from "../../lib/urlState";
import GallerySlideshow from "./GallerySlideshow";
import ViewerImagePage from "./ViewerImagePage";
import ViewerMessage from "./ViewerMessage";

interface GalleryViewerAppProps {
  /** The newest photos, built into the page; the rest of the index loads after it. */
  initialImages: GalleryImageRecord[];
}

/**
 * One photo on its own page, and the slideshow that starts from it. The URL owns which photo
 * and which of the two; this component only decides what that means with the photos known now.
 */
export default function GalleryViewerApp({ initialImages }: GalleryViewerAppProps) {
  const hydrated = useHydrated();
  const { imageId, ...filters } = useUrlState(galleryUrlCodec);
  const slideshow = useUrlPathname() === galleryRoutes.slideshow;
  const index = useGalleryIndex(initialImages);
  const view = viewerView({ hydrated, imageId, index, slideshow });
  // A ref callback runs again whenever its identity changes, so this one must not change.
  const start = useCallback(() => startGalleryViewer(initialImages), [initialImages]);

  return (
    <div ref={start} className="contents">
      {view.kind === "image" ? (
        <ViewerImagePage image={view.image} images={index.images} filters={filters} />
      ) : view.kind === "slideshow" ? (
        <GallerySlideshow image={view.image} images={index.images} filters={filters} />
      ) : view.kind === "hydrating" ? (
        <main className="min-h-svh bg-eggshell" aria-hidden="true" />
      ) : view.kind === "loading" ? (
        <ViewerMessage
          title={view.slideshow ? "Diashow laden…" : "Beeld laden…"}
          text="We zoeken de foto in het beeldarchief."
          busy
        />
      ) : view.kind === "failed" ? (
        <ViewerMessage
          title="Het beeldarchief laadt niet"
          text={view.message}
          onRetry={() => requestGalleryIndex(initialImages, "high")}
        />
      ) : view.kind === "notFound" ? (
        <ViewerMessage
          title="Beeld niet gevonden"
          text="Deze link verwijst naar een beeld dat niet in het beeldarchief staat."
        />
      ) : (
        <ViewerMessage title="Geen beeld gekozen" />
      )}
    </div>
  );
}
