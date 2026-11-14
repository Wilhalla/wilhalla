import { buttonVariants } from "@wilhalla/ui/components/button";
import { Separator } from "@wilhalla/ui/components/separator";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import {
  atlasCategories,
  atlasCategory,
  categoriesOf,
  type AtlasArrangement,
  type MapPoint,
} from "../../lib/archiveAtlas";
import { formatNumber } from "../../lib/format";

interface AtlasCategoryListProps {
  points: readonly MapPoint[];
  activeCategory: string | null;
  arrangement: AtlasArrangement;
  onSelect: (category: string | null) => void;
}

/** The subjects with their number of stories; choosing one focuses the map on it. */
export default function AtlasCategoryList({
  points,
  activeCategory,
  arrangement,
  onSelect,
}: AtlasCategoryListProps) {
  // Stories that touch on a subject, and those that are mainly about it.
  const touching = new Map<string, number>();
  const primary = new Map<string, number>();
  for (const point of points) {
    primary.set(point.topicId, (primary.get(point.topicId) ?? 0) + 1);
    for (const id of categoriesOf(point)) touching.set(id, (touching.get(id) ?? 0) + 1);
  }
  const focus = activeCategory ? atlasCategory(activeCategory) : undefined;
  const focusPrimary = focus ? (primary.get(focus.id) ?? 0) : 0;
  const focusTouching = focus ? (touching.get(focus.id) ?? 0) : 0;

  return (
    <div className="grid gap-4">
      <h2 className={typography.eyebrow}>Kies een onderwerp</h2>
      <ul className="m-0 grid list-none gap-0.5 p-0">
        {atlasCategories.map((category) => {
          const active = activeCategory === category.id;
          return (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(active ? null : category.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-sans text-body text-cinder transition-colors duration-hover ease-out hover:bg-powder aria-pressed:bg-powder aria-pressed:text-obsidian"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-(--dot)"
                  style={{ "--dot": `var(${category.color})` }}
                />
                <span className="flex-1">{category.label}</span>
                <span className="text-gravel tabular-nums">
                  {formatNumber(touching.get(category.id) ?? 0)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {focus && (
        <>
          <Separator />
          <p className={cn(typography.small, "m-0 text-cinder")}>{focus.description}</p>
          <p className={cn(typography.small, "m-0 text-cinder")}>
            {arrangement === "meaning"
              ? "Deze berichten gaan ook over andere dingen en staan daarom verspreid. De kleur toont waar ze het dichtst bij elkaar staan."
              : `${formatNumber(focusPrimary)} berichten gaan vooral hierover (volle stippen). ${formatNumber(focusTouching - focusPrimary)} andere gaan er ook over; die staan bij hun eigen onderwerp (open stippen).`}
          </p>
          <a
            href={`/archive/?category=${encodeURIComponent(focus.id)}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
          >
            Alle berichten over {focus.label.toLowerCase()} <ArrowRight />
          </a>
        </>
      )}
      <p className={cn(typography.caption, "m-0")}>
        Sleep om te verschuiven en scrol om te zoomen.
      </p>
    </div>
  );
}
