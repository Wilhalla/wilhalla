import { Badge } from "@wilhalla/ui/components/badge";
import { Button } from "@wilhalla/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wilhalla/ui/components/collapsible";
import { Separator } from "@wilhalla/ui/components/separator";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";
import galleryGroupsData from "../../data/generated/gallery-groups.json";
import { defaultGalleryFilters, galleryHref } from "../../lib/galleryFilters";
import { formatNumber } from "../../lib/format";
import {
  formatImagePostDateTime,
  type GalleryImageRecord,
  imageCaption,
} from "../../lib/imageGallerySession";
import ViewerFilmstrip from "./ViewerFilmstrip";
import ViewerImageButton from "./ViewerImageButton";

interface ViewerSidebarProps {
  image: GalleryImageRecord;
  /** The photos the viewer steps through, and where `image` is among them (-1: not in it). */
  selection: readonly GalleryImageRecord[];
  index: number;
  related: readonly GalleryImageRecord[];
  relatedLoading: boolean;
  onSelectImage: (imageId: string) => void;
}

const themeLabels = new Map(galleryGroupsData.themes.map((theme) => [theme.id, theme.label]));

/** About the photo first (what it shows, where it comes from), then where to go next. */
export default function ViewerSidebar({
  image,
  selection,
  index,
  related,
  relatedLoading,
  onSelectImage,
}: ViewerSidebarProps) {
  const caption = imageCaption(image);

  return (
    <aside className="grid content-start gap-6 bg-eggshell p-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
      <section className="grid gap-3">
        <p className={typography.eyebrow}>
          {formatImagePostDateTime(image)}
          {image.imageIndex !== undefined && ` · foto ${image.imageIndex + 1} in dit bericht`}
        </p>
        <h1 className={cn(typography.subsection, "text-balance")}>{image.postTitle}</h1>
        {image.seriesTitle && (
          <p className={cn(typography.small, "m-0 text-gravel")}>
            Uit het verhaal “{image.seriesTitle}”
          </p>
        )}
        {caption && (
          <p className="m-0 font-heading text-body-lg leading-body-lg text-obsidian italic">
            “{caption}”
          </p>
        )}
        <Button asChild className="mt-1 w-fit">
          <a href={`/posts/${image.postSlug}/`}>
            Lees het bericht <ArrowRight />
          </a>
        </Button>
        {image.visualDescription && (
          // Written by a vision model to derive the tags: kept out of the way of the author's words.
          <Collapsible key={image.id}>
            <CollapsibleTrigger asChild>
              <Button variant="link" size="inline" className="group">
                Automatische beschrijving
                <ChevronDown className="transition-transform duration-hover ease-out group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className={cn(typography.small, "m-0 mt-2 text-cinder")}>
                {image.visualDescription}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
        <div className="flex flex-wrap gap-1.5" aria-label="Over deze foto">
          {image.visualTags.slice(0, 5).map((tag) => (
            <Badge asChild variant="outline" key={tag}>
              <a
                href={galleryHref("grid", { ...defaultGalleryFilters, theme: tag, imageId: null })}
              >
                {themeLabels.get(tag) ?? tag}
              </a>
            </Badge>
          ))}
          {image.season && <Badge variant="secondary">{image.season}</Badge>}
        </div>
      </section>

      <Separator />

      <section className="grid gap-3" aria-labelledby="viewer-filmstrip-title">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="viewer-filmstrip-title" className={typography.eyebrow}>
            In deze selectie
          </h2>
          <span className={cn(typography.small, "text-gravel tabular-nums")}>
            {index >= 0 && `${formatNumber(index + 1)} van ${formatNumber(selection.length)}`}
          </span>
        </div>
        <ViewerFilmstrip images={selection} activeIndex={index} onSelectImage={onSelectImage} />
      </section>

      <Separator />

      <section className="grid gap-3" aria-labelledby="viewer-related-title">
        <h2 id="viewer-related-title" className={typography.eyebrow}>
          Lijkt op deze foto{relatedLoading && " · laden…"}
        </h2>
        {related.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {related.map((item) => (
              <ViewerImageButton
                key={item.id}
                className="aspect-square"
                image={item}
                onSelect={onSelectImage}
              />
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
