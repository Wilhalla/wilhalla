import { media } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { galleryHref, type GalleryFilters } from "../../lib/galleryFilters";
import { saveGalleryReturnPoint } from "../../lib/galleryReturnPoint";
import {
  EAGER_THUMBNAILS,
  HIGH_PRIORITY_THUMBNAILS,
  type GalleryImageRecord,
} from "../../lib/imageGallerySession";
import GalleryThumbnail from "./GalleryThumbnail";

interface GalleryImageRowProps {
  images: readonly GalleryImageRecord[];
  /** Position of the row's first photo among all filtered photos. */
  offset: number;
  /** Carried along to the viewer, which steps through the same selection. */
  filters: GalleryFilters;
}

/** One row of the grid; the column count follows the same breakpoints as the row builder. */
export default function GalleryImageRow({ images, offset, filters }: GalleryImageRowProps) {
  return (
    // Rows sit flush in the virtual list, so half the gap above and below gives an even 8px grid.
    <div className="grid h-37.5 grid-cols-2 gap-2 py-1 md:h-47.5 md:grid-cols-4 lg:h-55 lg:grid-cols-5">
      {images.map((image, column) => {
        const position = offset + column;
        const eager = position < EAGER_THUMBNAILS;
        return (
          <a
            className="group relative block min-h-0 overflow-hidden rounded-lg"
            key={image.id}
            href={galleryHref("viewer", { ...filters, imageId: image.id })}
            onClick={saveGalleryReturnPoint}
            title={image.postTitle}
          >
            <GalleryThumbnail
              className={cn(media.image, media.zoom, "size-full")}
              image={image}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={position < HIGH_PRIORITY_THUMBNAILS ? "high" : eager ? "auto" : "low"}
            />
          </a>
        );
      })}
    </div>
  );
}
