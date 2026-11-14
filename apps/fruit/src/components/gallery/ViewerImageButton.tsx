import { media } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import type { ComponentProps } from "react";
import { formatImagePostDateTime, type GalleryImageRecord } from "../../lib/imageGallerySession";
import GalleryThumbnail from "./GalleryThumbnail";

type ViewerImageButtonProps = Omit<ComponentProps<"button">, "onSelect"> & {
  image: GalleryImageRecord;
  /** Marks the photo the viewer shows now. */
  current?: boolean;
  onSelect: (imageId: string) => void;
};

/** A thumbnail that opens its photo in the viewer: the filmstrip and the similar photos use it. */
export default function ViewerImageButton({
  image,
  current = false,
  onSelect,
  className,
  ...props
}: ViewerImageButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "group overflow-hidden rounded-lg ring-obsidian ring-offset-2 ring-offset-eggshell aria-current:ring-2",
        className,
      )}
      onClick={() => onSelect(image.id)}
      aria-current={current ? "true" : undefined}
      aria-label={`${image.postTitle}, ${formatImagePostDateTime(image)}`}
      title={image.postTitle}
    >
      <GalleryThumbnail
        className={cn(media.image, media.zoom, "size-full")}
        image={image}
        alt=""
        loading="lazy"
        fetchPriority="low"
      />
    </button>
  );
}
