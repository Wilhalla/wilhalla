import { useState, type ComponentProps } from "react";
import {
  imageAlt,
  imageFullSrc,
  imageThumbSrc,
  type GalleryImageRecord,
} from "../../lib/imageGallerySession";

type GalleryThumbnailProps = Omit<ComponentProps<"img">, "src" | "onError"> & {
  image: Pick<GalleryImageRecord, "src" | "caption" | "postTitle" | "visualDescription">;
};

/** The small version of a photo; when that file is missing it shows the full photo, once. */
export default function GalleryThumbnail({ image, alt, ...props }: GalleryThumbnailProps) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <img
      decoding="async"
      {...props}
      src={thumbFailed ? imageFullSrc(image) : imageThumbSrc(image)}
      alt={alt ?? imageAlt(image)}
      onError={() => setThumbFailed(true)}
    />
  );
}
