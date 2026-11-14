import { FileText } from "lucide-react";
import { archiveSmallThumbUrl } from "../lib/assetUrls";

interface PostThumbnailProps {
  /** The post's first image, if it has one. */
  image: string | undefined;
}

/** Small picture for a post in a list; a document icon when the post has no image. */
export default function PostThumbnail({ image }: PostThumbnailProps) {
  return image ? (
    <img src={archiveSmallThumbUrl(image)} alt="" loading="lazy" decoding="async" />
  ) : (
    <span className="grid size-full place-items-center text-fog">
      <FileText className="size-5" strokeWidth={1.5} />
    </span>
  );
}
