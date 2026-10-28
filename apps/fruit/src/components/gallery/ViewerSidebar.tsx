import { Badge } from "@wilhalla/ui/components/badge";
import { Button } from "@wilhalla/ui/components/button";
import { Separator } from "@wilhalla/ui/components/separator";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import type { CSSProperties, Key, RefObject } from "react";

import galleryGroupsData from "../../data/generated/gallery-groups.json";
import {
  formatImagePostDateTime,
  type GalleryImageRecord as ImageRecord,
} from "../../lib/imageGallerySession";
import GalleryThumbnail from "./GalleryThumbnail";

const categoryLabels = new Map(galleryGroupsData.themes.map((theme) => [theme.id, theme.label]));

/** Width of one item in the filmstrip; the virtualizer in GalleryViewerApp uses the same value. */
export const FILMSTRIP_ITEM_SIZE = 104;

type TimelineVirtualizer = {
  getTotalSize: () => number;
  getVirtualItems: () => Array<{ index: number; key: Key; size: number; start: number }>;
};

type Props = {
  filtered: ImageRecord[];
  relatedLoading: boolean;
  similarImages: ImageRecord[];
  timelineRef: RefObject<HTMLDivElement | null>;
  timelineVirtualizer: TimelineVirtualizer;
  viewerImage: ImageRecord;
  viewerIndex: number;
  onSelectImage: (imageId: string) => void;
};

/** About the photo first (what it shows, where it comes from), then where to go next. */
export default function ViewerSidebar({
  filtered,
  relatedLoading,
  similarImages,
  timelineRef,
  timelineVirtualizer,
  viewerImage,
  viewerIndex,
  onSelectImage,
}: Props) {
  const caption = (viewerImage.imageSpecificText ?? []).join(" · ");
  return (
    <aside className="grid content-start gap-6 bg-eggshell p-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
      <section className="grid gap-3">
        <p className={typography.eyebrow}>
          {formatImagePostDateTime(viewerImage)}
          {typeof viewerImage.imageIndex === "number" &&
            ` · foto ${viewerImage.imageIndex + 1} in dit bericht`}
        </p>
        <h1 className={cn(typography.subsection, "text-balance")}>{viewerImage.postTitle}</h1>
        {viewerImage.seriesTitle && (
          <p className={cn(typography.small, "m-0 text-gravel")}>
            Uit het verhaal “{viewerImage.seriesTitle}”
          </p>
        )}
        {viewerImage.visualDescription && (
          <p className={cn(typography.small, "m-0 text-cinder")}>{viewerImage.visualDescription}</p>
        )}
        {caption && (
          <p className="m-0 font-heading text-body-lg leading-body-lg text-obsidian italic">
            “{caption}”
          </p>
        )}
        <Button asChild className="mt-1 w-fit">
          <a href={`/posts/${viewerImage.postSlug}/`}>
            Lees het bericht <ArrowRight />
          </a>
        </Button>
        <div className="flex flex-wrap gap-1.5" aria-label="Over deze foto">
          {viewerImage.visualTags.slice(0, 5).map((tag) => (
            <Badge asChild variant="outline" key={tag}>
              <a href={`/gallery/?theme=${encodeURIComponent(tag)}`}>
                {categoryLabels.get(tag) ?? tag}
              </a>
            </Badge>
          ))}
          {viewerImage.season && <Badge variant="secondary">{viewerImage.season}</Badge>}
        </div>
      </section>

      <Separator />

      <section className="grid gap-3" aria-labelledby="viewer-filmstrip-title">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="viewer-filmstrip-title" className={typography.eyebrow}>
            In deze selectie
          </h2>
          <span className={cn(typography.small, "text-gravel tabular-nums")}>
            {viewerIndex >= 0 &&
              `${(viewerIndex + 1).toLocaleString("nl-BE")} van ${filtered.length.toLocaleString("nl-BE")}`}
          </span>
        </div>
        <div
          ref={timelineRef}
          className="h-20 overflow-x-auto overflow-y-hidden [scrollbar-width:thin]"
          aria-label="Foto's in de huidige selectie"
        >
          <div
            className="relative h-full w-(--strip-width)"
            style={{ "--strip-width": `${timelineVirtualizer.getTotalSize()}px` } as CSSProperties}
          >
            {timelineVirtualizer.getVirtualItems().map((virtualItem) => {
              const image = filtered[virtualItem.index];
              if (!image) return null;
              const active = image.id === viewerImage.id;
              return (
                <button
                  className="absolute top-0 h-full w-(--item-width) translate-x-(--item-x) overflow-hidden rounded-md bg-powder ring-obsidian ring-offset-2 ring-offset-eggshell transition-opacity duration-150 hover:opacity-90 aria-[current=true]:ring-2"
                  key={virtualItem.key}
                  type="button"
                  onClick={() => onSelectImage(image.id)}
                  aria-current={active ? "true" : undefined}
                  aria-label={`${image.postTitle}, ${formatImagePostDateTime(image)}`}
                  title={image.postTitle}
                  style={
                    {
                      "--item-width": `${virtualItem.size - 8}px`,
                      "--item-x": `${virtualItem.start}px`,
                    } as CSSProperties
                  }
                >
                  <GalleryThumbnail
                    className="size-full object-cover"
                    image={image}
                    alt=""
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      <section className="grid gap-3" aria-labelledby="viewer-related-title">
        <h2 id="viewer-related-title" className={typography.eyebrow}>
          Lijkt op deze foto{relatedLoading && " · laden…"}
        </h2>
        {similarImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {similarImages.map((image) => (
              <button
                className="aspect-square overflow-hidden rounded-md bg-powder transition-opacity duration-150 hover:opacity-90"
                key={image.id}
                type="button"
                onClick={() => onSelectImage(image.id)}
                aria-label={`${image.postTitle}, ${formatImagePostDateTime(image)}`}
                title={image.postTitle}
              >
                <GalleryThumbnail
                  className="size-full object-cover"
                  image={image}
                  alt=""
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        ) : (
          !relatedLoading && (
            <p className={cn(typography.small, "m-0 text-gravel")}>
              Geen verwante foto's gevonden.
            </p>
          )
        )}
      </section>
    </aside>
  );
}
