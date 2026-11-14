import { Button, buttonVariants } from "@wilhalla/ui/components/button";
import { Separator } from "@wilhalla/ui/components/separator";
import { media, typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { atlasCategory, type MapPoint } from "../../lib/archiveAtlas";
import { formatLongDate } from "../../lib/archiveDateTime";
import { archiveSmallThumbUrl } from "../../lib/assetUrls";

interface AtlasStoryPanelProps {
  point: MapPoint;
  related: readonly MapPoint[];
  /** Selects another story, or none (null) to return to the subjects. */
  onSelect: (point: MapPoint | null) => void;
}

/** The selected story: what it is, a link to read it, and the stories closest to it. */
export default function AtlasStoryPanel({ point, related, onSelect }: AtlasStoryPanelProps) {
  const category = atlasCategory(point.topicId);

  return (
    <article className="grid gap-4">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => onSelect(null)}>
        <ArrowLeft /> Alle onderwerpen
      </Button>
      {point.image && (
        <img
          src={archiveSmallThumbUrl(point.image)}
          alt=""
          className={cn(media.image, "aspect-4/3 w-full rounded-lg")}
          loading="lazy"
        />
      )}
      <div className="grid gap-2">
        <p className={typography.eyebrow}>
          {formatLongDate(point.date)}
          {category && <> · {category.label}</>}
        </p>
        <h2 className={typography.heading}>{point.title}</h2>
        <p className={cn(typography.small, "m-0 line-clamp-5 text-cinder")}>{point.excerpt}</p>
      </div>
      <a
        href={`/posts/${encodeURIComponent(point.slug)}/`}
        className={cn(buttonVariants(), "w-fit")}
      >
        Lees het bericht <ArrowRight />
      </a>
      {related.length > 0 && (
        <>
          <Separator />
          <h3 className={typography.eyebrow}>Verwante berichten</h3>
          <ul className="m-0 grid list-none gap-0.5 p-0">
            {related.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="grid w-full gap-0.5 rounded-lg px-3 py-2 text-left transition-colors duration-hover ease-out hover:bg-powder"
                >
                  <span className="font-sans text-body leading-body text-obsidian">
                    {item.title}
                  </span>
                  <span className={typography.caption}>{formatLongDate(item.date)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
